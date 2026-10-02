import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { randomBytes } from 'node:crypto';
const require = createRequire(import.meta.url);
const { MongoClient, ObjectId } = require('mongodb');
const uri = process.env.SECURITY_TEST_MONGODB_URI;

test('real MongoDB: one-use verification, session revocation, and input isolation', { skip: !uri, timeout: 60000 }, async () => {
  const dbName = new URL(uri).pathname.slice(1);
  assert.match(dbName, /^security_test_/); // Never mutate application databases.
  const client = new MongoClient(uri);
  await client.connect();
  const port = 4320;
  const child = spawn(process.execPath, ['dist/app.js'], { env: { ...process.env, NODE_ENV: 'development', PORT: String(port), MONGODB_URI: uri, JWT_SECRET: randomBytes(32).toString('hex'), OTP_DEV_CODE: '123456' }, stdio: ['ignore', 'pipe', 'pipe'] });
  try {
    await new Promise((resolve, reject) => {
      child.stdout.on('data', data => { if (data.toString().includes('Development Server')) resolve(); });
      child.once('exit', code => reject(new Error(`Test server exited: ${code}`)));
    });
    const base = `http://127.0.0.1:${port}`;
    async function post(path, body, token) {
      const res = await fetch(base + path, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body) });
      return { status: res.status, body: await res.json() };
    }
    async function me(token) { return fetch(base + '/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }); }
    const account = { username: 'security_user', fullName: 'Security Test', email: 'security@example.com', mobile: '+15551234567', password: 'InitialPass123' };
    const started = await post('/api/auth/register', account);
    assert.equal(started.status, 202);
    const complete = await post('/api/auth/register/verify', { challengeToken: started.body.challengeToken, emailCode: '123456' });
    assert.equal(complete.status, 201);
    assert.equal((await post('/api/auth/register/verify', { challengeToken: started.body.challengeToken, emailCode: '123456' })).status, 400);
    // Reusing exactly one unique field must identify that field, not block unrelated accounts.
    const other = { ...account, username: 'different_user', email: 'different@example.com', mobile: '+15551234999' };
    for (const field of ['username', 'email', 'mobile']) {
      const duplicate = await post('/api/auth/register', { ...other, [field]: account[field] });
      assert.equal(duplicate.status, 409);
      assert.deepEqual(duplicate.body.fields, [field]);
    }
    const caseDuplicate = await post('/api/auth/register', { ...other, username: account.username.toUpperCase() });
    assert.equal(caseDuplicate.status, 409);
    assert.deepEqual(caseDuplicate.body.fields, ['username']);
    const independent = await post('/api/auth/register', other);
    assert.equal(independent.status, 202);
    const independentVerified = await post('/api/auth/register/verify', { challengeToken: independent.body.challengeToken, emailCode: '123456' });
    assert.equal(independentVerified.status, 201);
    const oldToken = complete.body.token;
    assert.equal((await me(oldToken)).status, 200);
    assert.equal((await post('/api/progress/review', { wordId: { $ne: null }, rating: 3 }, oldToken)).status, 400);
    assert.equal((await post('/api/quiz/submit', { answers: [{ wordId: { $ne: null }, answer: 'x' }] }, oldToken)).status, 400);
    const reset = await post('/api/auth/forgot-password', { identifier: account.email });
    assert.equal(reset.status, 202);
    const resetBody = { challengeToken: reset.body.challengeToken, emailCode: '123456', newPassword: 'ChangedPass123', confirmPassword: 'ChangedPass123' };
    const results = await Promise.all([post('/api/auth/forgot-password/verify', resetBody), post('/api/auth/forgot-password/verify', resetBody)]);
    assert.equal(results.filter(r => r.status === 200).length, 1);
    assert.equal((await me(oldToken)).status, 401);
    const missing = await post('/api/auth/login', { username: 'missing', password: account.password });
    const wrong = await post('/api/auth/login', { username: account.username, password: account.password });
    assert.deepEqual(wrong, missing);
    const login = await post('/api/auth/login', { username: account.username, password: 'ChangedPass123' });
    assert.equal(login.status, 200);
    await client.db().collection('users').deleteOne({ _id: new ObjectId(login.body.user.id) });
    assert.equal((await me(login.body.token)).status, 401);
    const locked = await post('/api/auth/register', { ...account, username: 'locked_user', email: 'locked@example.com', mobile: '+15551234568' });
    assert.equal(locked.status, 202);
    for (let attempt = 0; attempt < 10; attempt++) await post('/api/auth/register/verify', { challengeToken: locked.body.challengeToken, emailCode: '999999' });
    assert.equal((await post('/api/auth/register/verify', { challengeToken: locked.body.challengeToken, emailCode: '123456' })).status, 429);
  } finally {
    const stopped = once(child, 'exit');
    child.kill('SIGTERM');
    await stopped;
    await client.db().dropDatabase();
    await client.close();
  }
});

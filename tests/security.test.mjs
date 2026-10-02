import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { User } = require('../dist/models/User.js');
const { authenticateJWT } = require('../dist/middlewares/authMiddleware.js');
const { signToken } = require('../dist/controllers/authController.js');
const { escapeRegExp } = require('../dist/utils/escapeRegExp.js');
const { validateRegisterInput, validateLoginInput } = require('../dist/utils/validators.js');

test('sessions reject deleted users and old password versions, and use the current role', async () => {
  const original = User.findById;
  const id = '012345678901234567890123';
  const token = signToken(id, 'admin', 0);
  async function authenticate(user) {
    User.findById = async () => user;
    const req = { headers: { authorization: `Bearer ${token}` } };
    const result = { status: 200, next: false };
    const res = { status(code) { result.status = code; return this; }, json() {} };
    await authenticateJWT(req, res, () => { result.next = true; });
    return { ...result, user: req.user };
  }
  try {
    assert.equal((await authenticate(null)).status, 401);
    assert.equal((await authenticate({ _id: id, role: 'student', sessionVersion: 1 })).status, 401);
    const current = await authenticate({ _id: id, role: 'student', sessionVersion: 0 });
    assert.equal(current.next, true);
    assert.equal(current.user.role, 'student');
  } finally { User.findById = original; }
});

test('regex metacharacters are treated literally in account and content searches', () => {
  for (const input of ['.*', '(a+)+$', '[a-z]', 'a|b', '\\', 'user@example.com']) {
    const expression = new RegExp(`^${escapeRegExp(input)}$`, 'i');
    assert.equal(expression.test(input), true);
    assert.equal(expression.test('unrelated'), false);
  }
});

test('passwords exceeding bcrypt byte limits and malformed login bodies are rejected', () => {
  assert.ok(validateLoginInput(undefined));
  assert.ok(validateLoginInput({ username: { $ne: null }, password: 'Password123' }));
  const account = { username: 'tester', fullName: 'Test User', email: 'test@example.com', mobile: '+15551234567' };
  assert.ok(validateRegisterInput({ ...account, password: 'a1' + '😀'.repeat(18) }));
  assert.equal(validateRegisterInput({ ...account, password: 'a1' + 'x'.repeat(70) }), null);
});

test('stored search payloads stay text and are never interpolated into event handlers', async () => {
  const { readFileSync } = await import('node:fs');
  const { runInNewContext } = await import('node:vm');
  const source = readFileSync(new URL('../src/app.ts', import.meta.url), 'utf8');
  const start = source.indexOf('async function fetchSearchHistory()');
  assert.ok(start >= 0);
  const end = source.indexOf('function applyRecentSearch(', start);
  const payload = `');globalThis.compromised=true;//<img src=x onerror=alert(1)>`;
  const nodes = [];
  const container = { replaceChildren() { nodes.length = 0; }, appendChild(node) { nodes.push(node); }, set innerHTML(_) { throw new Error('Unsafe HTML insertion'); } };
  let searched;
  const context = {
    token: 'test-token', console,
    fetch: async () => ({ ok: true, json: async () => [{ query: payload }] }),
    document: { getElementById: () => container, createElement: () => ({ addEventListener(event, callback) { this[event] = callback; } }) },
    applyRecentSearch: query => { searched = query; },
  };
  runInNewContext(source.slice(start, end), context);
  await context.fetchSearchHistory();
  assert.equal(nodes.length, 1);
  assert.equal(nodes[0].textContent, payload);
  nodes[0].click();
  assert.equal(searched, payload);
  assert.equal(context.compromised, undefined);
});

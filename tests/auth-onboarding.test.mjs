import { test } from "node:test";
import assert from "node:assert/strict";

const base = process.env.E2E_BASE_URL;
const code = process.env.OTP_DEV_CODE;

async function post(path, body) {
  const response = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: response.status, body: await response.json() };
}

test("registration and password recovery require an email code", { skip: !base || !code }, async () => {
  const suffix = String(Date.now()).slice(-9);
  const username = `seeker_${suffix}`;
  const email = `${username}@example.com`;
  const mobile = `+1555${suffix}`;
  const password = "InitialPass123";
  const newPassword = "NewSecurePass456";
  const register = { username, fullName: "Test Seeker", email, mobile, password };

  assert.equal((await post("/api/auth/register", { ...register, mobile: "555" })).status, 400);
  const started = await post("/api/auth/register", register);
  assert.equal(started.status, 202, JSON.stringify(started.body));
  assert.ok(started.body.challengeToken);
  assert.equal((await post("/api/auth/login", { username, password })).status, 401);
  assert.equal((await post("/api/auth/register", register)).status, 429);
  assert.equal((await post("/api/auth/otp/resend", { challengeToken: started.body.challengeToken, purpose: "signup", channel: "email" })).status, 429);
  assert.equal((await post("/api/auth/otp/resend", { challengeToken: started.body.challengeToken, purpose: "signup", channel: "mobile" })).status, 400);

  const firstCheck = await post("/api/auth/register/verify", { challengeToken: started.body.challengeToken, emailCode: "999999" });
  assert.equal(firstCheck.status, 400);
  const completed = await post("/api/auth/register/verify", { challengeToken: started.body.challengeToken, emailCode: code });
  assert.equal(completed.status, 201, JSON.stringify(completed.body));
  assert.equal(completed.body.user.emailVerified, true);
  assert.equal(completed.body.user.mobileVerified, false);
  assert.ok(completed.body.token);
  assert.equal((await post("/api/auth/register", register)).status, 409);

  assert.equal((await post("/api/auth/login", { username: email, password })).status, 200);
  const reset = await post("/api/auth/forgot-password", { identifier: username });
  assert.equal(reset.status, 202, JSON.stringify(reset.body));
  assert.ok(reset.body.challengeToken);
  assert.equal((await post("/api/auth/forgot-password", { identifier: username })).status, 429);
  assert.equal((await post("/api/auth/forgot-password/verify", { challengeToken: reset.body.challengeToken, emailCode: "999999", newPassword, confirmPassword: newPassword })).status, 400);
  const resetDone = await post("/api/auth/forgot-password/verify", { challengeToken: reset.body.challengeToken, emailCode: code, newPassword, confirmPassword: newPassword });
  assert.equal(resetDone.status, 200, JSON.stringify(resetDone.body));
  assert.equal((await post("/api/auth/login", { username, password })).status, 401);
  assert.equal((await post("/api/auth/login", { username: mobile, password: newPassword })).status, 200);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { sendOtp, checkOtp, otpReady } = require("../dist/services/otp.js");

test("production sends an email code through Resend and verifies it locally", async () => {
  process.env.NODE_ENV = "production";
  process.env.RESEND_KEY = "re_test_key";
  process.env.RESEND_FROM = "Mahabharat <verify@example.com>";
  delete process.env.OTP_DEV_CODE;

  const calls = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), options });
    return new Response(JSON.stringify({ id: "email-test" }), { status: 200 });
  };
  try {
    assert.equal(otpReady(), true);
    const hash = await sendOtp("challenge", "seeker@example.com");
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "https://api.resend.com/emails");
    const body = JSON.parse(calls[0].options.body);
    assert.deepEqual(body.to, ["seeker@example.com"]);
    assert.equal(body.from, process.env.RESEND_FROM);
    const code = body.text.match(/\b\d{6}\b/)?.[0];
    assert.ok(code);
    assert.equal(checkOtp("challenge", code, hash), true);
    assert.equal(checkOtp("challenge", "000000", hash), false);
    assert.equal(calls.length, 1, "checking the code must not call an external provider");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("production requires a sender address", () => {
  process.env.NODE_ENV = "production";
  process.env.RESEND_KEY = "re_test_key";
  delete process.env.RESEND_FROM;
  assert.equal(otpReady(), false);
});

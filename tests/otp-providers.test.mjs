import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { sendOtp, checkOtp, otpReady } = require("../dist/services/otp.js");

test("production routes email through Resend and mobile through Twilio Verify", async () => {
  process.env.NODE_ENV = "production";
  process.env.RESEND_KEY = "re_test_key";
  process.env.RESEND_FROM = "Mahabharat <verify@example.com>";
  process.env.TWILIO_API_KEY = "SKtest";
  process.env.TWILIO_API_SECRET = "test_secret";
  process.env.TWILIO_VERIFY_SERVICE_SID = "VAtest";
  delete process.env.OTP_DEV_CODE;

  const calls = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), options });
    return new Response(JSON.stringify({ status: url.includes("VerificationCheck") ? "approved" : "pending", id: "email-test" }), { status: 200 });
  };
  try {
    assert.equal(otpReady(), true);
    const hash = await sendOtp("challenge", "email", "seeker@example.com");
    const emailCall = calls.at(-1);
    assert.equal(emailCall.url, "https://api.resend.com/emails");
    const emailBody = JSON.parse(emailCall.options.body);
    assert.deepEqual(emailBody.to, ["seeker@example.com"]);
    assert.match(emailBody.text, /\b\d{6}\b/);
    const code = emailBody.text.match(/\b\d{6}\b/)[0];
    assert.equal(await checkOtp("challenge", "email", "seeker@example.com", code, hash), true);
    assert.equal(await checkOtp("challenge", "email", "seeker@example.com", "000000", hash), false);
    assert.equal(calls.length, 1, "email verification must not call Twilio");

    assert.equal(await sendOtp("challenge", "mobile", "+8801712345678"), undefined);
    assert.match(calls.at(-1).url, /verify\.twilio\.com.*Verifications$/);
    assert.equal(new URLSearchParams(calls.at(-1).options.body).get("Channel"), "sms");
    assert.equal(await checkOtp("challenge", "mobile", "+8801712345678", "123456"), true);
    assert.match(calls.at(-1).url, /VerificationCheck$/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

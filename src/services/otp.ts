import { createHash, randomInt, timingSafeEqual } from "node:crypto";

export type OtpChannel = "email" | "mobile";

function twilioCredentials() {
  const account = process.env.TWILIO_API_KEY || process.env.TWILIO_ACCOUNT_SID;
  const secret = process.env.TWILIO_API_SECRET || process.env.TWILIO_AUTH_TOKEN;
  const service = process.env.TWILIO_VERIFY_SERVICE_SID;
  return account && secret && service ? { account, secret, service } : null;
}

function resendCredentials() {
  const key = process.env.RESEND_KEY || process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  return key && from ? { key, from } : null;
}

export function otpReady(): boolean {
  return process.env.NODE_ENV !== "production" || (!!twilioCredentials() && !!resendCredentials());
}

function codeHash(tokenHash: string, channel: OtpChannel, code: string): string {
  return createHash("sha256").update(`${tokenHash}:${channel}:${code}`).digest("hex");
}

function safeEqualHex(left: string, right: string): boolean {
  const a = Buffer.from(left, "hex");
  const b = Buffer.from(right, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

async function twilioRequest(path: string, params: Record<string, string>): Promise<any> {
  const credentials = twilioCredentials();
  if (!credentials) throw new Error("OTP provider is not configured.");
  const endpoint = `https://verify.twilio.com/v2/Services/${encodeURIComponent(credentials.service)}/${path}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${credentials.account}:${credentials.secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(params),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) {
    console.error(`Twilio Verify returned HTTP ${response.status} for ${path}.`);
    throw new Error("Verification delivery or check failed. Please try again shortly.");
  }
  return response.json();
}

async function resendEmail(to: string, code: string): Promise<void> {
  const credentials = resendCredentials();
  if (!credentials) throw new Error("Email OTP provider is not configured.");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${credentials.key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: credentials.from,
      to: [to],
      subject: "Your Mahabharat verification code",
      text: `Your Mahabharat verification code is ${code}. It expires in 15 minutes. If you did not request this, you can ignore this email.`,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) {
    console.error(`Resend returned HTTP ${response.status} while sending a verification email.`);
    throw new Error("Email verification delivery failed. Please try again shortly.");
  }
}

export async function sendOtp(tokenHash: string, channel: OtpChannel, to: string): Promise<string | undefined> {
  if (process.env.NODE_ENV !== "production" && process.env.OTP_DEV_CODE) {
    const code = process.env.OTP_DEV_CODE;
    console.log(`[development OTP] ${channel} ${to}: ${code}`);
    return codeHash(tokenHash, channel, code);
  }
  if (channel === "email" && resendCredentials()) {
    const code = String(randomInt(100000, 1000000));
    await resendEmail(to, code);
    return codeHash(tokenHash, channel, code);
  }
  if (channel === "email" && process.env.NODE_ENV === "production") {
    throw new Error("Email OTP provider is not configured.");
  }
  const credentials = twilioCredentials();
  if (channel === "mobile" && credentials) {
    const result = await twilioRequest("Verifications", { To: to, Channel: "sms" });
    if (result.status !== "pending") throw new Error("Verification delivery failed.");
    return undefined;
  }
  if (process.env.NODE_ENV === "production") throw new Error("OTP provider is not configured.");
  const code = process.env.OTP_DEV_CODE || String(randomInt(100000, 1000000));
  console.log(`[development OTP] ${channel} ${to}: ${code}`);
  return codeHash(tokenHash, channel, code);
}

export async function checkOtp(tokenHash: string, channel: OtpChannel, to: string, code: string, storedHash?: string): Promise<boolean> {
  if (!/^\d{4,10}$/.test(code)) return false;
  if (process.env.NODE_ENV !== "production" && process.env.OTP_DEV_CODE) {
    return !!storedHash && safeEqualHex(codeHash(tokenHash, channel, code), storedHash);
  }
  if (channel === "email") {
    return !!storedHash && safeEqualHex(codeHash(tokenHash, channel, code), storedHash);
  }
  if (twilioCredentials()) {
    const result = await twilioRequest("VerificationCheck", { To: to, Code: code });
    return result.status === "approved";
  }
  if (process.env.NODE_ENV === "production" || !storedHash) return false;
  return safeEqualHex(codeHash(tokenHash, channel, code), storedHash);
}

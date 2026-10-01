import { createHash, randomInt, timingSafeEqual } from "node:crypto";

export type OtpChannel = "email" | "mobile";

function twilioCredentials() {
  const account = process.env.TWILIO_API_KEY || process.env.TWILIO_ACCOUNT_SID;
  const secret = process.env.TWILIO_API_SECRET || process.env.TWILIO_AUTH_TOKEN;
  const service = process.env.TWILIO_VERIFY_SERVICE_SID;
  return account && secret && service ? { account, secret, service } : null;
}

export function otpReady(): boolean {
  return process.env.NODE_ENV !== "production" || !!twilioCredentials();
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

export async function sendOtp(tokenHash: string, channel: OtpChannel, to: string): Promise<string | undefined> {
  const credentials = twilioCredentials();
  if (credentials) {
    const result = await twilioRequest("Verifications", { To: to, Channel: channel === "mobile" ? "sms" : "email" });
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
  if (twilioCredentials()) {
    const result = await twilioRequest("VerificationCheck", { To: to, Code: code });
    return result.status === "approved";
  }
  if (process.env.NODE_ENV === "production" || !storedHash) return false;
  return safeEqualHex(codeHash(tokenHash, channel, code), storedHash);
}

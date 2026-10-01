import { createHash, randomInt, timingSafeEqual } from "node:crypto";

function resendCredentials() {
  const key = process.env.RESEND_KEY || process.env.RESEND_API_KEY || process.env.RESEND_API;
  const from = process.env.RESEND_FROM;
  return key && from ? { key, from } : null;
}

export function otpReady(): boolean {
  return process.env.NODE_ENV !== "production" || !!resendCredentials();
}

function codeHash(tokenHash: string, code: string): string {
  return createHash("sha256").update(`${tokenHash}:email:${code}`).digest("hex");
}

function safeEqualHex(left: string, right: string): boolean {
  const a = Buffer.from(left, "hex");
  const b = Buffer.from(right, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
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

export async function sendOtp(tokenHash: string, to: string): Promise<string> {
  if (process.env.NODE_ENV !== "production" && process.env.OTP_DEV_CODE) {
    const code = process.env.OTP_DEV_CODE;
    console.log(`[development OTP] email ${to}: ${code}`);
    return codeHash(tokenHash, code);
  }
  if (resendCredentials()) {
    const code = String(randomInt(100000, 1000000));
    await resendEmail(to, code);
    return codeHash(tokenHash, code);
  }
  if (process.env.NODE_ENV === "production") throw new Error("Email OTP provider is not configured.");
  const code = String(randomInt(100000, 1000000));
  console.log(`[development OTP] email ${to}: ${code}`);
  return codeHash(tokenHash, code);
}

export function checkOtp(tokenHash: string, code: unknown, storedHash?: string): boolean {
  return typeof code === "string" && /^\d{6}$/.test(code) && !!storedHash && safeEqualHex(codeHash(tokenHash, code), storedHash);
}

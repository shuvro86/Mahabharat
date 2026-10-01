import { createHash, randomBytes } from "node:crypto";
import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import { User } from "../models/User";
import { IVerificationChallenge, VerificationChallenge } from "../models/VerificationChallenge";
import { validateRegisterInput } from "../utils/validators";
import { checkOtp, otpReady, OtpChannel, sendOtp } from "../services/otp";
import { signToken } from "./authController";

const CHALLENGE_MS = 15 * 60 * 1000;
const RESEND_WAIT_MS = 60 * 1000;
const MAX_SENDS = 3;
const MAX_FAILED_CHECKS = 10;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function makeToken(): string {
  return randomBytes(32).toString("base64url");
}

function publicUser(user: any) {
  return {
    id: user._id,
    username: user.username,
    fullName: user.fullName || "",
    email: user.email || "",
    mobile: user.mobile || "",
    emailVerified: !!user.emailVerifiedAt,
    mobileVerified: !!user.mobileVerifiedAt,
    role: user.role,
    streak: user.streak,
  };
}

function issueSession(res: Response, user: any, status: number, message: string): void {
  const token = signToken(user._id.toString(), user.role);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(status).json({ message, token, user: publicUser(user) });
}

async function lookupChallenge(rawToken: unknown, purpose: "signup" | "reset"): Promise<IVerificationChallenge | null> {
  if (typeof rawToken !== "string" || rawToken.length < 40 || rawToken.length > 100) return null;
  const challenge = await VerificationChallenge.findOne({ tokenHash: hashToken(rawToken), purpose });
  if (!challenge || challenge.expiresAt.getTime() < Date.now()) return null;
  return challenge;
}

async function deliver(challenge: IVerificationChallenge, channel: OtpChannel): Promise<void> {
  const to = channel === "email" ? challenge.email : challenge.mobile;
  const codeHash = await sendOtp(challenge.tokenHash, channel, to);
  const now = new Date();
  if (channel === "email") {
    challenge.emailCodeHash = codeHash;
    challenge.emailSentAt = now;
    challenge.emailSendCount += 1;
  } else {
    challenge.mobileCodeHash = codeHash;
    challenge.mobileSentAt = now;
    challenge.mobileSendCount += 1;
  }
  await challenge.save();
}

async function verifyCodes(challenge: IVerificationChallenge, emailCode: unknown, mobileCode: unknown): Promise<string | null> {
  if (challenge.failedChecks >= MAX_FAILED_CHECKS) return "Too many incorrect codes. Start again.";
  if (!challenge.emailVerified) {
    if (typeof emailCode !== "string" || !(await checkOtp(challenge.tokenHash, "email", challenge.email, emailCode, challenge.emailCodeHash))) {
      challenge.failedChecks += 1;
      await challenge.save();
      return "The email code is incorrect or expired.";
    }
    challenge.emailVerified = true;
    challenge.emailCodeHash = undefined;
    await challenge.save();
  }
  if (!challenge.mobileVerified) {
    if (typeof mobileCode !== "string" || !(await checkOtp(challenge.tokenHash, "mobile", challenge.mobile, mobileCode, challenge.mobileCodeHash))) {
      challenge.failedChecks += 1;
      await challenge.save();
      return "The mobile code is incorrect or expired.";
    }
    challenge.mobileVerified = true;
    challenge.mobileCodeHash = undefined;
    await challenge.save();
  }
  return null;
}

export async function startRegistration(req: Request, res: Response): Promise<void> {
  try {
    const validationError = validateRegisterInput(req.body);
    if (validationError) { res.status(400).json({ error: validationError }); return; }
    if (!otpReady()) { res.status(503).json({ error: "Verification delivery is not configured." }); return; }

    const username = req.body.username.trim();
    const usernameKey = username.toLowerCase();
    const email = req.body.email.trim().toLowerCase();
    const mobile = req.body.mobile.trim();
    const existing = await User.findOne({ $or: [
      { usernameKey },
      { username: new RegExp(`^${username}$`, "i") },
      { email },
      { mobile },
    ] });
    if (existing) { res.status(409).json({ error: "Username, email, or mobile is already registered." }); return; }
    const active = await VerificationChallenge.findOne({
      purpose: "signup", expiresAt: { $gt: new Date() },
      $or: [{ usernameKey }, { email }, { mobile }],
    });
    if (active) { res.status(429).json({ error: "A verification is already in progress for these details. Please finish it or wait 15 minutes." }); return; }

    const token = makeToken();
    const challenge = await VerificationChallenge.create({
      tokenHash: hashToken(token), purpose: "signup", username, usernameKey,
      fullName: req.body.fullName.trim(), passwordHash: await bcryptjs.hash(req.body.password, 12),
      email, mobile, emailVerified: false, mobileVerified: false,
      emailSendCount: 0, mobileSendCount: 0, failedChecks: 0,
      expiresAt: new Date(Date.now() + CHALLENGE_MS),
    });
    try {
      await deliver(challenge, "email");
      await deliver(challenge, "mobile");
    } catch (error) {
      await VerificationChallenge.deleteMany({ tokenHash: challenge.tokenHash });
      throw error;
    }
    res.status(202).json({ message: "Verification codes sent to your email and mobile.", challengeToken: token, expiresInSeconds: CHALLENGE_MS / 1000 });
  } catch (error) {
    console.error("Registration start failed:", error);
    res.status(503).json({ error: "Could not start verification. Please try again shortly." });
  }
}

export async function completeRegistration(req: Request, res: Response): Promise<void> {
  try {
    const challenge = await lookupChallenge(req.body?.challengeToken, "signup");
    if (!challenge) { res.status(400).json({ error: "Signup expired. Please start again." }); return; }
    const error = await verifyCodes(challenge, req.body.emailCode, req.body.mobileCode);
    if (error) { res.status(challenge.failedChecks >= MAX_FAILED_CHECKS ? 429 : 400).json({ error, emailVerified: challenge.emailVerified, mobileVerified: challenge.mobileVerified }); return; }
    const user = await User.create({
      username: challenge.username, usernameKey: challenge.usernameKey,
      fullName: challenge.fullName, password: challenge.passwordHash,
      email: challenge.email, mobile: challenge.mobile,
      emailVerifiedAt: new Date(), mobileVerifiedAt: new Date(),
      role: "student", streak: 1,
    });
    await VerificationChallenge.deleteMany({ tokenHash: challenge.tokenHash });
    issueSession(res, user, 201, "Account created and both contacts verified.");
  } catch (error: any) {
    if (error?.code === 11000) { res.status(409).json({ error: "Username, email, or mobile is already registered." }); return; }
    console.error("Registration verification failed:", error);
    res.status(503).json({ error: "Could not complete verification. Please try again." });
  }
}

export async function resendCode(req: Request, res: Response): Promise<void> {
  try {
    const purpose = req.body?.purpose === "reset" ? "reset" : "signup";
    const channel: OtpChannel = req.body?.channel;
    if (channel !== "email" && channel !== "mobile") { res.status(400).json({ error: "Choose email or mobile." }); return; }
    const challenge = await lookupChallenge(req.body?.challengeToken, purpose);
    if (!challenge) { res.status(400).json({ error: "Verification expired. Please start again." }); return; }
    if (purpose === "reset" && !challenge.userId) { res.status(200).json({ message: "If this account is eligible, a code has been sent." }); return; }
    const count = channel === "email" ? challenge.emailSendCount : challenge.mobileSendCount;
    const sentAt = channel === "email" ? challenge.emailSentAt : challenge.mobileSentAt;
    const verified = channel === "email" ? challenge.emailVerified : challenge.mobileVerified;
    if (verified) { res.status(200).json({ message: "This contact is already verified." }); return; }
    if (count >= MAX_SENDS) { res.status(429).json({ error: "Code send limit reached. Start again after this attempt expires." }); return; }
    if (sentAt && Date.now() - sentAt.getTime() < RESEND_WAIT_MS) { res.status(429).json({ error: "Please wait one minute before requesting another code." }); return; }
    await deliver(challenge, channel);
    res.status(200).json({ message: "A new code has been sent." });
  } catch (error) {
    console.error("Code resend failed:", error);
    res.status(503).json({ error: "Could not resend the code. Please try again." });
  }
}

export async function startPasswordReset(req: Request, res: Response): Promise<void> {
  try {
    const identifier = typeof req.body?.identifier === "string" ? req.body.identifier.trim() : "";
    if (identifier.length < 3 || identifier.length > 254) { res.status(400).json({ error: "Enter your username or email." }); return; }
    if (!otpReady()) { res.status(503).json({ error: "Verification delivery is not configured." }); return; }
    const key = identifier.toLowerCase();
    const escapedIdentifier = identifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const user = await User.findOne({ $or: [{ usernameKey: key }, { email: key }, { username: new RegExp(`^${escapedIdentifier}$`, "i") }] });
    const eligible = user && user.role !== "guest" && user.email && user.mobile && user.emailVerifiedAt && user.mobileVerifiedAt;
    if (eligible) {
      const active = await VerificationChallenge.findOne({ purpose: "reset", userId: user._id, expiresAt: { $gt: new Date() } });
      if (active) { res.status(429).json({ error: "A reset is already in progress. Please finish it or wait 15 minutes." }); return; }
    }
    const token = makeToken();
    const challenge = await VerificationChallenge.create({
      tokenHash: hashToken(token), purpose: "reset", username: user?.username || identifier,
      usernameKey: user?.usernameKey || key, userId: eligible ? user!._id : undefined,
      email: eligible ? user!.email : "unavailable@example.invalid",
      mobile: eligible ? user!.mobile : "+10000000000",
      emailVerified: false, mobileVerified: false,
      emailSendCount: 0, mobileSendCount: 0, failedChecks: 0,
      expiresAt: new Date(Date.now() + CHALLENGE_MS),
    });
    if (eligible) {
      try { await deliver(challenge, "email"); await deliver(challenge, "mobile"); }
      catch (error) { await VerificationChallenge.deleteMany({ tokenHash: challenge.tokenHash }); throw error; }
    }
    res.status(202).json({ message: "If this account has verified contacts, codes have been sent.", challengeToken: token, expiresInSeconds: CHALLENGE_MS / 1000 });
  } catch (error) {
    console.error("Password reset start failed:", error);
    res.status(503).json({ error: "Could not start password reset. Please try again." });
  }
}

export async function completePasswordReset(req: Request, res: Response): Promise<void> {
  try {
    const { challengeToken, emailCode, mobileCode, newPassword, confirmPassword } = req.body || {};
    if (typeof newPassword !== "string" || newPassword.length < 10 || !/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword) || newPassword !== confirmPassword) {
      res.status(400).json({ error: "New passwords must match and contain at least 10 characters, a letter, and a number." }); return;
    }
    const challenge = await lookupChallenge(challengeToken, "reset");
    if (!challenge || !challenge.userId) { res.status(400).json({ error: "Invalid or expired reset request." }); return; }
    const error = await verifyCodes(challenge, emailCode, mobileCode);
    if (error) { res.status(challenge.failedChecks >= MAX_FAILED_CHECKS ? 429 : 400).json({ error, emailVerified: challenge.emailVerified, mobileVerified: challenge.mobileVerified }); return; }
    const user = await User.findById(challenge.userId);
    if (!user) { res.status(400).json({ error: "Invalid or expired reset request." }); return; }
    user.password = await bcryptjs.hash(newPassword, 12);
    await user.save();
    await VerificationChallenge.deleteMany({ tokenHash: challenge.tokenHash });
    res.status(200).json({ message: "Password updated. You can sign in now." });
  } catch (error) {
    console.error("Password reset verification failed:", error);
    res.status(503).json({ error: "Could not complete password reset. Please try again." });
  }
}

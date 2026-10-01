import { Document, Schema, model } from "mongoose";

export interface IVerificationChallenge extends Document {
  tokenHash: string;
  purpose: "signup" | "reset";
  username: string;
  usernameKey: string;
  fullName?: string;
  passwordHash?: string;
  userId?: Schema.Types.ObjectId;
  email: string;
  mobile: string;
  emailVerified: boolean;
  mobileVerified: boolean;
  emailCodeHash?: string;
  mobileCodeHash?: string;
  emailSentAt?: Date;
  mobileSentAt?: Date;
  emailSendCount: number;
  mobileSendCount: number;
  failedChecks: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationChallengeSchema = new Schema<IVerificationChallenge>({
  tokenHash: { type: String, required: true, unique: true },
  purpose: { type: String, enum: ["signup", "reset"], required: true },
  username: { type: String, required: true },
  usernameKey: { type: String, required: true },
  fullName: String,
  passwordHash: String,
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  mobileVerified: { type: Boolean, default: false },
  emailCodeHash: String,
  mobileCodeHash: String,
  emailSentAt: Date,
  mobileSentAt: Date,
  emailSendCount: { type: Number, default: 0 },
  mobileSendCount: { type: Number, default: 0 },
  failedChecks: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

VerificationChallengeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const VerificationChallenge = model<IVerificationChallenge>("VerificationChallenge", VerificationChallengeSchema);

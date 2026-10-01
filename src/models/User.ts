import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  password?: string; // Optional for guests
  fullName?: string; // User's full name
  usernameKey?: string;
  email?: string;
  mobile?: string;
  emailVerifiedAt?: Date;
  mobileVerifiedAt?: Date;
  role: "admin" | "student" | "guest";
  streak: number;
  lastActive?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    usernameKey: { type: String, lowercase: true, trim: true, unique: true, sparse: true },
    email: { type: String, lowercase: true, trim: true, unique: true, sparse: true },
    mobile: { type: String, trim: true, unique: true, sparse: true },
    emailVerifiedAt: Date,
    mobileVerifiedAt: Date,
    role: {
      type: String,
      enum: ["admin", "student", "guest"],
      default: "student",
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>("User", UserSchema);

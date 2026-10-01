import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { validateLoginInput } from "../utils/validators";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

const jwtSecret = () => process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET ||
  (process.env.NODE_ENV === "production" ? "" : "mahabharat-secret-key-108");

// Helper to sign JWT
export const signToken = (userId: string, role: string) => {
  const secret = jwtSecret();
  if (!secret) throw new Error("JWT_SECRET must be configured in production.");
  return jwt.sign({ id: userId, role }, secret, {
    expiresIn: (process.env.JWT_ACCESS_EXPIRY || "1d") as any,
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errorMsg = validateLoginInput(req.body);
    if (errorMsg) {
      res.status(400).json({ error: errorMsg });
      return;
    }

    const { username, password } = req.body;
    const cleanUsername = (username || "").trim();

    // Existing local accounts may not have usernameKey yet.
    const user = await User.findOne({
      $or: [
        { usernameKey: cleanUsername.toLowerCase() },
        { email: cleanUsername.toLowerCase() },
        { mobile: cleanUsername },
        { username: cleanUsername },
        { username: new RegExp(`^${cleanUsername.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i") },
        { fullName: new RegExp(`^${cleanUsername.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i") }
      ]
    });

    if (!user || !user.password) {
      res.status(401).json({ error: "Invalid username or password." });
      return;
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid password for this account. Please try again or use password reset." });
      return;
    }

    // Update streak if active on a new day
    const lastActive = user.lastActive || new Date();
    const today = new Date();
    const isNewDay = today.toDateString() !== lastActive.toDateString();
    
    if (isNewDay) {
      const diffTime = Math.abs(today.getTime() - lastActive.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        user.streak = (user.streak || 0) + 1;
      } else if (diffDays > 1) {
        user.streak = 1; // reset
      }
    } else if (!user.streak || user.streak === 0) {
      user.streak = 1;
    }
    user.lastActive = today;
    await user.save();

    const token = signToken(user._id.toString(), user.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName || "",
        email: user.email || "",
        mobile: user.mobile || "",
        emailVerified: !!user.emailVerifiedAt,
        mobileVerified: !!user.mobileVerifiedAt,
        role: user.role,
        streak: user.streak,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: "Login failed: " + err.message });
  }
};

export const loginGuest = async (req: Request, res: Response): Promise<void> => {
  try {
    const guestUsername = `guest_${Math.random().toString(36).substring(2, 9)}`;
    const guestUser = await User.create({
      username: guestUsername,
      role: "guest",
      streak: 0,
    });

    const token = signToken(guestUser._id.toString(), guestUser.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Guest session started",
      token,
      user: {
        id: guestUser._id,
        username: guestUser.username,
        fullName: "Guest Pilgrim",
        role: guestUser.role,
        streak: guestUser.streak,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: "Guest login failed: " + err.message });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName || "",
        email: user.email || "",
        mobile: user.mobile || "",
        emailVerified: !!user.emailVerifiedAt,
        mobileVerified: !!user.mobileVerifiedAt,
        role: user.role,
        streak: user.streak,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to retrieve user: " + err.message });
  }
};

import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { validateRegisterInput, validateLoginInput } from "../utils/validators";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET ||
  (process.env.NODE_ENV === "production" ? "" : "mahabharat-secret-key-108");

// Helper to sign JWT
const signToken = (userId: string, role: string) => {
  if (!JWT_SECRET) throw new Error("JWT_SECRET must be configured in production.");
  return jwt.sign({ id: userId, role }, JWT_SECRET, {
    expiresIn: (process.env.JWT_ACCESS_EXPIRY || "1d") as any,
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errorMsg = validateRegisterInput(req.body);
    if (errorMsg) {
      res.status(400).json({ error: errorMsg });
      return;
    }

    const { username, password, fullName } = req.body;
    const cleanUsername = (username || "").trim();
    const cleanFullName = (fullName || "").trim();

    const existingUser = await User.findOne({
      $or: [
        { username: cleanUsername },
        { username: new RegExp(`^${cleanUsername.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i") }
      ]
    });
    if (existingUser) {
      res.status(400).json({ error: "Username is already taken. Please choose another username or sign in." });
      return;
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = await User.create({
      username: cleanUsername,
      password: hashedPassword,
      fullName: cleanFullName,
      role: "student",
      streak: 1,
    });

    const token = signToken(newUser._id.toString(), newUser.role);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        fullName: newUser.fullName || "",
        role: newUser.role,
        streak: newUser.streak,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: "Registration failed: " + err.message });
  }
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

    // Check by exact or case-insensitive username or full name
    const user = await User.findOne({
      $or: [
        { username: cleanUsername },
        { username: new RegExp(`^${cleanUsername.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i") },
        { fullName: new RegExp(`^${cleanUsername.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i") }
      ]
    });

    if (!user || !user.password) {
      res.status(401).json({ 
        error: `Invalid username or password. If you don't have an account yet, click Sign Up or use one of the 1-click demo logins below.` 
      });
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
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName || "",
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

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, newPassword, confirmPassword } = req.body;

    if (!username || !username.trim()) {
      res.status(400).json({ error: "Username is required." });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({ error: "New password must be at least 6 characters long." });
      return;
    }

    if (newPassword !== confirmPassword) {
      res.status(400).json({ error: "Passwords do not match." });
      return;
    }

    const user = await User.findOne({ username: username.trim() });
    if (!user || user.role === "guest") {
      res.status(404).json({ error: "No registered account found with that username." });
      return;
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password reset successfully! You can now log in with your new password."
    });
  } catch (err: any) {
    res.status(500).json({ error: "Password reset failed: " + err.message });
  }
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
        role: user.role,
        streak: user.streak,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to retrieve user: " + err.message });
  }
};

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

import { jwtSecret } from "../utils/authSecret";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authenticateJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const secret = jwtSecret();
  if (!secret) {
    res.status(503).json({ error: "Authentication is not configured." });
    return;
  }
  let token = "";

  // Check Auth Header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // Check manual cookie parsing if headers didn't have it
  if (!token && req.headers.cookie) {
    try {
      const cookies = req.headers.cookie.split(";").reduce((acc: any, cookie) => {
        const [key, value] = cookie.split("=").map((c) => c.trim());
        acc[key] = value;
        return acc;
      }, {});
      token = cookies.token;
    } catch (e) {
      // Ignore cookie parsing error
    }
  }

  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret, { algorithms: ["HS256"] });
    if (typeof decoded === "string" || typeof decoded.id !== "string" || !/^[a-f0-9]{24}$/i.test(decoded.id)) {
      res.status(401).json({ error: "Invalid or expired session." }); return;
    }
    const user = await User.findById(decoded.id);
    if (!user || (decoded.sessionVersion ?? 0) !== (user.sessionVersion || 0)) {
      res.status(401).json({ error: "Invalid or expired session." }); return;
    }
    // Authorization uses the current database role, never a stale JWT role.
    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
};

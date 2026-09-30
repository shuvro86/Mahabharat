import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET ||
  (process.env.NODE_ENV === "production" ? "" : "mahabharat-secret-key-108");

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!JWT_SECRET) {
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
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
};

import { Request, Response, NextFunction } from "express";

const ipRequests = new Map<string, { count: number; lastReset: number }>();
const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 100;    // max 100 requests per minute per IP

export const rateLimiter = (req: Request, res: Response, next: NextFunction): void => {
  const ip = (req.ip || req.headers["x-forwarded-for"] || "unknown") as string;
  const now = Date.now();
  // Bound process memory even when callers cycle through many addresses.
  for (const [key, entry] of ipRequests) {
    if (now - entry.lastReset > WINDOW_MS) ipRequests.delete(key);
  }
  if (!ipRequests.has(ip) && ipRequests.size >= 10000) {
    res.status(429).json({ error: "Too many requests. Please try again later." });
    return;
  }
  
  let record = ipRequests.get(ip);
  if (!record) {
    record = { count: 1, lastReset: now };
    ipRequests.set(ip, record);
    next();
    return;
  }
  
  if (now - record.lastReset > WINDOW_MS) {
    record.count = 1;
    record.lastReset = now;
    next();
    return;
  }
  
  record.count++;
  if (record.count > MAX_REQUESTS) {
    res.status(429).json({ error: "Too many requests. Please try again after a minute." });
    return;
  }
  
  next();
};

import { randomBytes } from "node:crypto";

// Development sessions use a process-specific secret instead of a public default.
const developmentSecret = randomBytes(32).toString("hex");
export const jwtSecret = () => process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET ||
  (process.env.NODE_ENV === "production" ? "" : developmentSecret);

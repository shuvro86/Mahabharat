import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error("Global Error Handler caught an error:", err);
  
  const status = err.status || err.statusCode || 500;
  const message = status >= 500 ? "An unexpected internal server error occurred." : "Invalid request.";
  
  res.status(status).json({
    error: message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
};

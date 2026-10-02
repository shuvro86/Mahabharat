import mongoose from "mongoose";
import { seedDatabase } from "../utils/seeder";
import { patchAllModels } from "./inMemoryDb";

export const dbStatus = {
  isConnected: false,
  isFallback: false,
};

let connectionPromise: Promise<void> | null = null;
let memoryPatched = false;

async function connect(): Promise<void> {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri || uri === "123") {
    if (process.env.NODE_ENV === "production") {
      throw new Error("MONGODB_URI is required in production.");
    }
    if (!memoryPatched) {
      patchAllModels();
      memoryPatched = true;
    }
    dbStatus.isFallback = true;
    console.warn("Using process-local data for development. Configure MONGODB_URI for persistence.");
    await seedDatabase();
    dbStatus.isConnected = true;
    return;
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000, maxPoolSize: 10 });
  dbStatus.isFallback = false;
  console.log("MongoDB connected.");
  await seedDatabase();
  dbStatus.isConnected = true;
}

export function connectDB(): Promise<void> {
  if (dbStatus.isConnected && (dbStatus.isFallback || mongoose.connection.readyState === 1)) return Promise.resolve();
  if (mongoose.connection.readyState !== 1) dbStatus.isConnected = false;
  if (!connectionPromise) {
    connectionPromise = connect().catch((error) => {
      dbStatus.isConnected = false;
      connectionPromise = null;
      throw error;
    });
  }
  return connectionPromise;
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  connectionPromise = null;
  dbStatus.isConnected = false;
}

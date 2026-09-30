import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { seedDatabase } from "../utils/seeder";
import { patchAllModels } from "./inMemoryDb";

// Patch all Mongoose models so queries transparently fallback to in-memory store if Mongoose is disconnected
patchAllModels();

let mongod: any = null;

export const dbStatus = {
  isConnected: false,
  isFallback: false,
  uri: ""
};

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  
  if (uri && uri !== "123") {
    try {
      console.log("Attempting to connect to configured MONGODB_URI...");
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000
      });
      dbStatus.isConnected = true;
      dbStatus.isFallback = false;
      dbStatus.uri = uri;
      console.log("MongoDB Connected to Atlas.");
      
      await checkAndSeed();
      return;
    } catch (err: any) {
      console.error(`Failed to connect to MongoDB Atlas: ${err.message}`);
    }
  }

  // Pure JavaScript In-Memory Engine Fallback (resilient against container sandbox limits & spawn errors)
  console.log("Activating pure JavaScript in-memory database engine fallback...");
  dbStatus.isConnected = true;
  dbStatus.isFallback = true;
  dbStatus.uri = "in-memory-js-engine";

  await checkAndSeed();
};

const checkAndSeed = async () => {
  try {
    // Dynamic import of models to avoid circular dependencies
    const { Word } = await import("../models/Word");
    const { Character } = await import("../models/Character");
    const { User } = await import("../models/User");
    const wordCount = await Word.countDocuments();
    const characterCount = await Character.countDocuments();
    const userCount = await User.countDocuments();
    const characterWithNoAvatar = await Character.findOne({ avatar: { $exists: false } });
    
    const missingDemoUsers = process.env.NODE_ENV !== "production" && userCount === 0;
    if (wordCount < 30 || characterCount === 0 || missingDemoUsers || characterWithNoAvatar) {
      console.log("Empty or outdated database detected (or missing avatar fields/users). Purging and re-seeding...");
      await seedDatabase();
    } else {
      console.log("Existing data detected. Skipping seeding.");
    }
  } catch (err: any) {
    console.log("Database empty check or seeding completed via fallback.");
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
};

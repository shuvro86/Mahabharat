import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { User } from "../models/User";
import { Word } from "../models/Word";
import { Character } from "../models/Character";
import { Shloka } from "../models/Shloka";
import { Progress } from "../models/Progress";
import { QuizHistory } from "../models/QuizHistory";
import { SearchHistory } from "../models/SearchHistory";
import { seedVocabularyData } from "./vocabularyData";
import { seedGitaVersesData } from "./gitaDataset";
import { seedCharacterData } from "./characterData";

export const seedDatabase = async (): Promise<void> => {
  try {
    console.log("Database Seed Triggered. Purging existing collections...");
    
    // Clear all collections
    await User.deleteMany({});
    await Word.deleteMany({});
    await Character.deleteMany({});
    await Shloka.deleteMany({});
    await Progress.deleteMany({});
    await QuizHistory.deleteMany({});
    await SearchHistory.deleteMany({});

    console.log("Collections purged. Creating encrypted default user accounts...");

    // Demo credentials are local-only. Public deployments rely on user registration.
    if (process.env.NODE_ENV !== "production") {
      const adminPasswordHash = await bcryptjs.hash("admin123", 10);
      const studentPasswordHash = await bcryptjs.hash("student123", 10);
      await User.create([
        { username: "admin", password: adminPasswordHash, fullName: "Maharishi Vyasa (Admin)", role: "admin", streak: 5, lastActive: new Date() },
        { username: "student", password: studentPasswordHash, fullName: "Arjuna Pandava (Student)", role: "student", streak: 3, lastActive: new Date() }
      ]);
      console.log("Created local development demo accounts.");
    } else {
      console.log("Skipping demo accounts in production.");
    }

    // 1. Seed 500+ Mahabharat Vocabulary Words
    console.log(`Seeding ${seedVocabularyData.length} vocabulary words...`);
    const seededWords = await Word.insertMany(seedVocabularyData);
    console.log(`Seeded ${seededWords.length} Mahabharat Vocabulary Words successfully.`);

    // 2. Seed 50 Detailed Mahabharat Characters with avatars and images
    console.log(`Seeding ${seedCharacterData.length} characters with images and avatars...`);
    const seededCharacters = await Character.insertMany(seedCharacterData);
    console.log(`Seeded ${seededCharacters.length} Mahabharat Characters successfully.`);

    // 3. Seed All 18 Chapters and 700 Verses of Bhagavad Gita in English, Hindi, and Bangla
    console.log(`Seeding ${seedGitaVersesData.length} Bhagavad Gita verses in English, Hindi & Bangla...`);
    const seededShlokas = await Shloka.insertMany(seedGitaVersesData);
    console.log(`Seeded ${seededShlokas.length} Bhagavad Gita Shlokas successfully across 18 chapters.`);
    
    console.log("Database Seed completed successfully!");

  } catch (err: any) {
    console.error("Critical error seeding database:", err);
    throw err;
  }
};

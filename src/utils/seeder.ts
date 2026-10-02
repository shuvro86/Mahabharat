import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import { User } from "../models/User";
import { Word } from "../models/Word";
import { Character } from "../models/Character";
import { Shloka } from "../models/Shloka";
import { seedVocabularyData } from "./vocabularyData";
import { seedGitaVersesData } from "./gitaDataset";
import { seedCharacterData } from "./characterData";

// Seed reference collections only when empty. Never delete accounts or study history.
export async function seedDatabase(): Promise<void> {
  const durable = mongoose.connection.readyState === 1;
  if ((await Word.countDocuments()) === 0) {
    if (durable) {
      await Word.init();
      await Word.bulkWrite(seedVocabularyData.map((item) => ({ updateOne: {
        filter: { transliteration: item.transliteration, meaning: item.meaning },
        update: { $setOnInsert: item }, upsert: true,
      } })), { ordered: false });
    } else {
      await Word.insertMany(seedVocabularyData);
    }
    console.log(`Seeded ${seedVocabularyData.length} vocabulary words.`);
  }
  if ((await Character.countDocuments()) === 0) {
    if (durable) {
      await Character.init();
      await Character.bulkWrite(seedCharacterData.map((item) => ({ updateOne: {
        filter: { name: item.name }, update: { $setOnInsert: item }, upsert: true,
      } })), { ordered: false });
    } else {
      await Character.insertMany(seedCharacterData);
    }
    console.log(`Seeded ${seedCharacterData.length} epic characters.`);
  }
  if ((await Shloka.countDocuments()) === 0) {
    if (durable) {
      await Shloka.init();
      await Shloka.bulkWrite(seedGitaVersesData.map((item) => ({ updateOne: {
        filter: { chapter: item.chapter, verse: item.verse }, update: { $setOnInsert: item }, upsert: true,
      } })), { ordered: false });
    } else {
      await Shloka.insertMany(seedGitaVersesData);
    }
    console.log(`Seeded ${seedGitaVersesData.length} Gita verses.`);
  }

  if (process.env.NODE_ENV !== "production" && (await User.countDocuments()) === 0) {
    const adminPasswordHash = await bcryptjs.hash("admin123", 10);
    const studentPasswordHash = await bcryptjs.hash("student123", 10);
    await User.create([
      { username: "admin", password: adminPasswordHash, fullName: "Maharishi Vyasa (Admin)", role: "admin", streak: 5, lastActive: new Date() },
      { username: "student", password: studentPasswordHash, fullName: "Arjuna Pandava (Student)", role: "student", streak: 3, lastActive: new Date() },
    ]);
    console.log("Created development demo accounts.");
  }
}

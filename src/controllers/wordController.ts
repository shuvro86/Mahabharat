import { Request, Response } from "express";
import { Word } from "../models/Word";

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const getAllWords = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 15;
    const search = req.query.search as string;
    const difficulty = req.query.difficulty as string;

    const query: any = {};

    if (search) {
      const escapedSearch = escapeRegExp(search);
      query.$or = [
        { arabic: { $regex: escapedSearch, $options: "i" } },
        { transliteration: { $regex: escapedSearch, $options: "i" } },
        { translation: { $regex: escapedSearch, $options: "i" } },
        { rootWord: { $regex: escapedSearch, $options: "i" } },
        { meaning: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    if (difficulty && ["easy", "medium", "hard"].includes(difficulty)) {
      query.difficulty = difficulty;
    }

    const skip = (page - 1) * limit;
    const total = await Word.countDocuments(query);
    const words = await Word.find(query).skip(skip).limit(limit);

    res.status(200).json({
      words,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to get words: " + err.message });
  }
};

export const getWordById = async (req: Request, res: Response): Promise<void> => {
  try {
    const word = await Word.findById(req.params.id);
    if (!word) {
      res.status(404).json({ error: "Word not found" });
      return;
    }
    res.status(200).json(word);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to get word: " + err.message });
  }
};

// Admin actions
export const createWord = async (req: Request, res: Response): Promise<void> => {
  try {
    const newWord = await Word.create(req.body);
    res.status(201).json(newWord);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to create word: " + err.message });
  }
};

export const updateWord = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedWord = await Word.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedWord) {
      res.status(404).json({ error: "Word not found" });
      return;
    }
    res.status(200).json(updatedWord);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to update word: " + err.message });
  }
};

export const deleteWord = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedWord = await Word.findByIdAndDelete(req.params.id);
    if (!deletedWord) {
      res.status(404).json({ error: "Word not found" });
      return;
    }
    res.status(200).json({ message: "Word deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete word: " + err.message });
  }
};

import { Request, Response } from "express";
import { Shloka } from "../models/Shloka";

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const getAllShlokas = async (req: Request, res: Response): Promise<void> => {
  try {
    const chapter = parseInt(req.query.chapter as string);
    const search = req.query.search as string;
    const query: any = {};

    if (chapter) {
      query.chapter = chapter;
    }

    if (search) {
      const escaped = escapeRegExp(search);
      query.$or = [
        { sanskrit: { $regex: escaped, $options: "i" } },
        { transliteration: { $regex: escaped, $options: "i" } },
        { translation: { $regex: escaped, $options: "i" } },
        { translationHindi: { $regex: escaped, $options: "i" } },
        { translationBengali: { $regex: escaped, $options: "i" } },
        { explanation: { $regex: escaped, $options: "i" } },
        { explanationHindi: { $regex: escaped, $options: "i" } },
        { explanationBengali: { $regex: escaped, $options: "i" } },
        { chapterName: { $regex: escaped, $options: "i" } }
      ];
    }

    const shlokas = await Shloka.find(query);
    res.status(200).json(shlokas);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch shlokas: " + err.message });
  }
};

export const getShlokaById = async (req: Request, res: Response): Promise<void> => {
  try {
    const shloka = await Shloka.findById(req.params.id);
    if (!shloka) {
      res.status(404).json({ error: "Shloka not found" });
      return;
    }
    res.status(200).json(shloka);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch shloka: " + err.message });
  }
};

export const createShloka = async (req: Request, res: Response): Promise<void> => {
  try {
    const newShloka = await Shloka.create(req.body);
    res.status(201).json(newShloka);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to create shloka: " + err.message });
  }
};

export const updateShloka = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Shloka.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ error: "Shloka not found" });
      return;
    }
    res.status(200).json(updated);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to update shloka: " + err.message });
  }
};

export const deleteShloka = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Shloka.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: "Shloka not found" });
      return;
    }
    res.status(200).json({ message: "Shloka deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete shloka: " + err.message });
  }
};

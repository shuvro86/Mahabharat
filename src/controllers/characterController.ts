import { Request, Response } from "express";
import { Character } from "../models/Character";
import { generateCharacterAvatarSVG } from "../utils/characterAvatar";

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const getAllCharacters = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search as string;
    const alliance = req.query.alliance as string;
    const query: any = {};

    if (search) {
      const escaped = escapeRegExp(search);
      query.$or = [
        { name: { $regex: escaped, $options: "i" } },
        { role: { $regex: escaped, $options: "i" } },
        { description: { $regex: escaped, $options: "i" } }
      ];
    }

    if (alliance) {
      const escaped = escapeRegExp(alliance);
      query.alliance = { $regex: escaped, $options: "i" };
    }

    const characters = await Character.find(query).lean();
    const processed = characters.map((c: any) => {
      const img = c.image;
      if (!img || img.includes("unsplash.com") || img.startsWith("http://") || img.startsWith("https://")) {
        c.image = generateCharacterAvatarSVG({
          name: c.name,
          alliance: c.alliance,
          role: c.role,
          avatar: c.avatar
        });
      }
      return c;
    });

    res.status(200).json(processed);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch characters: " + err.message });
  }
};

export const getCharacterById = async (req: Request, res: Response): Promise<void> => {
  try {
    const char: any = await Character.findById(req.params.id).lean();
    if (!char) {
      res.status(404).json({ error: "Character not found" });
      return;
    }
    if (!char.image || char.image.includes("unsplash.com") || char.image.startsWith("http://") || char.image.startsWith("https://")) {
      char.image = generateCharacterAvatarSVG({
        name: char.name,
        alliance: char.alliance,
        role: char.role,
        avatar: char.avatar
      });
    }
    res.status(200).json(char);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch character: " + err.message });
  }
};

export const createCharacter = async (req: Request, res: Response): Promise<void> => {
  try {
    const newChar = await Character.create(req.body);
    res.status(201).json(newChar);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to create character: " + err.message });
  }
};

export const updateCharacter = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Character.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ error: "Character not found" });
      return;
    }
    res.status(200).json(updated);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to update character: " + err.message });
  }
};

export const deleteCharacter = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Character.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: "Character not found" });
      return;
    }
    res.status(200).json({ message: "Character deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete character: " + err.message });
  }
};

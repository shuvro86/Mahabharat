import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { SearchHistory } from "../models/SearchHistory";

export const getSearchHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const history = await SearchHistory.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.status(200).json(history);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch search history." });
  }
};

export const saveSearchQuery = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { query } = req.body;
    if (!query || typeof query !== "string" || !query.trim() || query.length > 200) {
      res.status(400).json({ error: "Search query is required." });
      return;
    }

    // Save search query, only if it is different from the last saved query to avoid duplicates
    const lastHistory = await SearchHistory.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
    if (!lastHistory || lastHistory.query.toLowerCase() !== query.trim().toLowerCase()) {
      await SearchHistory.create({
        userId: req.user.id,
        query: query.trim()
      });
    }

    res.status(201).json({ message: "Search history saved successfully." });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to save search." });
  }
};

export const clearSearchHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    await SearchHistory.deleteMany({ userId: req.user.id });
    res.status(200).json({ message: "Search history cleared successfully." });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to clear search history." });
  }
};

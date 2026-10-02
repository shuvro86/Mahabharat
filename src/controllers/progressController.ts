import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { Progress } from "../models/Progress";
import { Word } from "../models/Word";

export const getProgress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const progressList = await Progress.find({ userId: req.user.id }).populate("wordId");
    res.status(200).json(progressList);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch progress." });
  }
};

export const getReviewQueue = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const now = new Date();
    // Fetch user's progress records where nextReviewDate <= now
    const reviews = await Progress.find({
      userId: req.user.id,
      nextReviewDate: { $lte: now }
    }).populate("wordId");

    // Also get any words the user has NOT reviewed yet
    const reviewedWordIds = await Progress.distinct("wordId", { userId: req.user.id });
    const unreviewedWords = await Word.find({ _id: { $nin: reviewedWordIds } });

    res.status(200).json({
      dueReviews: reviews,
      unreviewedWords
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch review queue." });
  }
};

export const submitReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { wordId, rating } = req.body; // rating from 0 to 5
    if (typeof wordId !== "string" || !/^[a-f0-9]{24}$/i.test(wordId) || !Number.isInteger(rating) || rating < 0 || rating > 5) {
      res.status(400).json({ error: "Invalid rating. Must be between 0 and 5." });
      return;
    }

    let progress = await Progress.findOne({ userId: req.user.id, wordId });

    if (!progress) {
      progress = new Progress({
        userId: req.user.id,
        wordId,
        interval: 1,
        repetition: 0,
        easeFactor: 2.5
      });
    }

    // SM-2 Algorithm implementation
    const q = rating;
    let { interval, repetition, easeFactor } = progress;

    if (q < 3) {
      repetition = 0;
      interval = 1;
    } else {
      if (repetition === 0) {
        interval = 1;
      } else if (repetition === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetition += 1;
    }

    // Calculate new Ease Factor
    easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (easeFactor < 1.3) {
      easeFactor = 1.3;
    }

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);

    progress.interval = interval;
    progress.repetition = repetition;
    progress.easeFactor = easeFactor;
    progress.nextReviewDate = nextReviewDate;

    await progress.save();

    res.status(200).json({
      message: "Review submitted successfully",
      progress: {
        id: progress._id,
        interval,
        repetition,
        easeFactor,
        nextReviewDate
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to submit review." });
  }
};

export const getReviewStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const now = new Date();
    const userId = req.user.id;

    const totalWords = await Word.countDocuments();
    const progressList = await Progress.find({ userId });
    
    const reviewedCount = progressList.length;
    const dueReviewsCount = await Progress.countDocuments({
      userId,
      nextReviewDate: { $lte: now }
    });

    // Mastered words are those with repetition >= 4
    const masteredCount = progressList.filter(p => p.repetition >= 4).length;
    const learningCount = reviewedCount - masteredCount;

    res.status(200).json({
      totalWords,
      reviewedCount,
      dueReviewsCount,
      masteredCount,
      learningCount,
      unreviewedCount: Math.max(0, totalWords - reviewedCount)
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch stats." });
  }
};

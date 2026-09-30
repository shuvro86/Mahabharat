import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { Word } from "../models/Word";
import { QuizHistory } from "../models/QuizHistory";

export const generateQuiz = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Fetch 5 random words for questions
    const questions = await Word.aggregate([{ $sample: { size: 5 } }]);
    
    if (questions.length < 4) {
      res.status(400).json({ error: "Not enough vocabulary words to generate a quiz. Add more words first." });
      return;
    }

    // Fetch 15 random words to use as distractors
    const distractorWords = await Word.aggregate([{ $sample: { size: 15 } }]);

    const quizQuestions = questions.map((word) => {
      // Find 3 distractors that do not match the current word's translation
      const wrongs = distractorWords
        .filter((dw) => dw.translation !== word.translation)
        .map((dw) => dw.translation);

      // Unique wrong choices
      const uniqueWrongs = Array.from(new Set(wrongs)).slice(0, 3);

      // Shuffled choices
      const choices = [word.translation, ...uniqueWrongs].sort(() => Math.random() - 0.5);

      return {
        wordId: word._id,
        word: word.arabic, // sanskrit virtual mapped
        transliteration: word.transliteration,
        correctAnswer: word.translation,
        choices,
      };
    });

    res.status(200).json({ questions: quizQuestions });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to generate quiz: " + err.message });
  }
};

export const submitQuiz = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { answers } = req.body; // array of { wordId, answer }
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      res.status(400).json({ error: "Answers are required and must be an array." });
      return;
    }

    const questionDetails: any[] = [];
    let score = 0;

    for (const ans of answers) {
      const word = await Word.findById(ans.wordId);
      if (!word) continue;

      const isCorrect = word.translation.trim().toLowerCase() === ans.answer.trim().toLowerCase();
      if (isCorrect) {
        score++;
      }

      questionDetails.push({
        wordId: word._id,
        word: word.arabic,
        userAnswer: ans.answer,
        correctAnswer: word.translation,
        isCorrect,
      });
    }

    const history = await QuizHistory.create({
      userId: req.user.id,
      score,
      totalQuestions: questionDetails.length,
      questions: questionDetails,
    });

    res.status(200).json({
      message: "Quiz submitted successfully",
      quizHistoryId: history._id,
      score,
      totalQuestions: questionDetails.length,
      details: questionDetails,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to submit quiz: " + err.message });
  }
};

export const getQuizHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const history = await QuizHistory.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);
      
    res.status(200).json(history);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch quiz history: " + err.message });
  }
};

import { Router } from "express";
import { generateQuiz, submitQuiz, getQuizHistory } from "../controllers/quizController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();

router.get("/generate", generateQuiz);
router.post("/submit", authenticateJWT, submitQuiz);
router.get("/history", authenticateJWT, getQuizHistory);

export default router;

import { Router } from "express";
import { getProgress, getReviewQueue, submitReview, getReviewStats } from "../controllers/progressController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();

router.use(authenticateJWT);

router.get("/", getProgress);
router.get("/queue", getReviewQueue);
router.post("/review", submitReview);
router.get("/stats", getReviewStats);

export default router;

import { Router } from "express";
import { getSearchHistory, saveSearchQuery, clearSearchHistory } from "../controllers/searchHistoryController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();

router.use(authenticateJWT);

router.get("/", getSearchHistory);
router.post("/", saveSearchQuery);
router.delete("/", clearSearchHistory);

export default router;

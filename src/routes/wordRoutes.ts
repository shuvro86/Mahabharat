import { Router } from "express";
import { getAllWords, getWordById, createWord, updateWord, deleteWord } from "../controllers/wordController";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";

const router = Router();

router.get("/", getAllWords);
router.get("/:id", getWordById);

// Admin-only actions
router.post("/", authenticateJWT, requireRole(["admin"]), createWord);
router.put("/:id", authenticateJWT, requireRole(["admin"]), updateWord);
router.delete("/:id", authenticateJWT, requireRole(["admin"]), deleteWord);

export default router;

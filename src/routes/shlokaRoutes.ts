import { Router } from "express";
import { getAllShlokas, getShlokaById, createShloka, updateShloka, deleteShloka } from "../controllers/shlokaController";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";

const router = Router();

router.get("/", getAllShlokas);
router.get("/:id", getShlokaById);

// Admin-only actions
router.post("/", authenticateJWT, requireRole(["admin"]), createShloka);
router.put("/:id", authenticateJWT, requireRole(["admin"]), updateShloka);
router.delete("/:id", authenticateJWT, requireRole(["admin"]), deleteShloka);

export default router;

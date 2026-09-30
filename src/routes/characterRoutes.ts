import { Router } from "express";
import { getAllCharacters, getCharacterById, createCharacter, updateCharacter, deleteCharacter } from "../controllers/characterController";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";

const router = Router();

router.get("/", getAllCharacters);
router.get("/:id", getCharacterById);

// Admin-only actions
router.post("/", authenticateJWT, requireRole(["admin"]), createCharacter);
router.put("/:id", authenticateJWT, requireRole(["admin"]), updateCharacter);
router.delete("/:id", authenticateJWT, requireRole(["admin"]), deleteCharacter);

export default router;

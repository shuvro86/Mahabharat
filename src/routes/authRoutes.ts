import { Router } from "express";
import { register, login, loginGuest, logout, forgotPassword, getMe } from "../controllers/authController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/login-guest", loginGuest);
router.post("/logout", logout);
router.get("/me", authenticateJWT, getMe);

export default router;

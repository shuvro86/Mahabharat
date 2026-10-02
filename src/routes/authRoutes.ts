import { Router } from "express";
import { login, loginGuest, logout, getMe } from "../controllers/authController";
import { startRegistration, completeRegistration, resendCode, startPasswordReset, completePasswordReset } from "../controllers/verificationController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", startRegistration);
router.post("/register/verify", completeRegistration);
router.post("/otp/resend", resendCode);
router.post("/login", login);
router.post("/forgot-password", startPasswordReset);
router.post("/forgot-password/verify", completePasswordReset);
router.post("/login-guest", loginGuest);
router.post("/logout", logout);
router.get("/me", authenticateJWT, getMe);

export default router;

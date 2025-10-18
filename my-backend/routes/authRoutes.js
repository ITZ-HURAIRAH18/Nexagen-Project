import express from "express";
import { signup, login, googleSignup, googleLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// Separate routes for Google signup and Google login
router.post("/google-signup", googleSignup);
router.post("/google-login", googleLogin);

export default router;

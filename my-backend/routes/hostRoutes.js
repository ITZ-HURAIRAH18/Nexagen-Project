import express from "express";
import { verifyToken, isHost } from "../middleware/authMiddleware.js";
import { getHostDashboard } from "../controllers/hostController.js";

const router = express.Router();

router.get("/dashboard", verifyToken, isHost, getHostDashboard);

export default router;

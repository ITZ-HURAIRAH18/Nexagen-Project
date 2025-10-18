import express from "express";
import { verifyToken, isHost } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", verifyToken, isHost, (req, res) => {
  res.json({ message: "Welcome Host! You can manage your meetings." });
});

export default router;

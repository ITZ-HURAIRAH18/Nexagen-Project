import express from "express";
import { verifyToken, isUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/bookings", verifyToken, isUser, (req, res) => {
  res.json({ message: "Welcome User! You can view your bookings." });
});

export default router;

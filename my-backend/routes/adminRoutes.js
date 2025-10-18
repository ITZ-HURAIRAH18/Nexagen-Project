import express from "express";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", verifyToken, isAdmin, (req, res) => {
  res.json({ message: "Welcome Admin! You can view all platform stats." });
});

export default router;

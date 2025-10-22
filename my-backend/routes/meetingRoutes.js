
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getMeetingById } from "../controllers/meetingController.js";

const router = express.Router();

router.get("/:id", verifyToken, getMeetingById);

export default router;

// routes/meetingRoutes.js
import express from "express";
import { getMeetingByRoomId } from "../controllers/meetingController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:roomId", getMeetingByRoomId);

export default router;

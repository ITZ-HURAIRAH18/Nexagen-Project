import express from "express";
import { verifyToken, isUser } from "../middleware/authMiddleware.js";
import { getUserBookings } from "../controllers/userController.js";

const router = express.Router();

router.get("/bookings", verifyToken, isUser, getUserBookings);

export default router;

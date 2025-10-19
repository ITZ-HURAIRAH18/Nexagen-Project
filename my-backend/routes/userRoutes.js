import express from "express";
import { verifyToken, isUser } from "../middleware/authMiddleware.js";
import {
  getUserBookings,
  getAllHostsAvailability,
  createBooking,
  updateBooking,
  cancelBooking,
} from "../controllers/userController.js";

const router = express.Router();

// Get all bookings of logged-in user
router.get("/bookings", verifyToken, isUser, getUserBookings);

// Get all hosts availability (to show to user for booking)
router.get("/hosts/availability", verifyToken, isUser, getAllHostsAvailability);

// Create new booking
router.post("/bookings", verifyToken, isUser, createBooking);

// Update/reschedule booking
router.put("/bookings/:id", verifyToken, isUser, updateBooking);

// Cancel booking
router.delete("/bookings/:id", verifyToken, isUser, cancelBooking);

export default router;

import express from "express";
import { verifyToken, isHost } from "../middleware/authMiddleware.js";
import {
  getHostDashboard,
  getHostBookings,
  getMyAvailability,
  addAvailability,
  updateAvailabilityById,
  deleteAvailabilityById,
  updateHostSettings,
   getAvailabilityById,
   updateBookingStatus
} from "../controllers/hostController.js";

const router = express.Router();

// 📊 Dashboard Overview
router.get("/dashboard", verifyToken, isHost, getHostDashboard);

// 📅 All Bookings for this Host
router.get("/bookings", verifyToken, isHost, getHostBookings);

// ➕ Add Availability
router.post("/availability/add", verifyToken, isHost, addAvailability);

// 🕓 Get Host Availability
router.get("/availability/me", verifyToken, isHost, getMyAvailability);

// ✏️ Update Availability by ID
router.put("/availability/update/:id", verifyToken, isHost, updateAvailabilityById);

// ❌ Delete Availability by ID
router.delete("/availability/delete/:id", verifyToken, isHost, deleteAvailabilityById);

// ⚙️ Update Host Settings
router.put("/settings", verifyToken, isHost, updateHostSettings);


router.get("/availability/:id", verifyToken, isHost, getAvailabilityById);


// 📝 Update Booking Status
router.put("/bookings/update-status/:id", verifyToken, isHost, updateBookingStatus);

export default router;

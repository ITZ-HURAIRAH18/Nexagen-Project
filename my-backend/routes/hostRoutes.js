import express from "express";
import { verifyToken, isHost } from "../middleware/authMiddleware.js";
import {
  getHostDashboard,
  getHostBookings,
  getMyAvailability,
  addAvailability,
  updateAvailability,
  deleteAvailability,
  updateHostSettings,
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

// ✏️ Update Host Availability
router.put("/availability/update", verifyToken, isHost, updateAvailability);

// ❌ Delete Host Availability
router.delete("/availability/delete", verifyToken, isHost, deleteAvailability);

// ⚙️ Update Host Settings
router.put("/settings", verifyToken, isHost, updateHostSettings);

export default router;

// routes/adminRoutes.js
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  suspendUser,
  deleteUser,
  getStats,
   getDashboard
} from "../controllers/adminController.js";

const router = express.Router();

// GET all users
router.get("/users", verifyToken, isAdmin, getAllUsers);

// PATCH: suspend user
router.patch("/user/:id/suspend", verifyToken, isAdmin, suspendUser);

// DELETE user
router.delete("/user/:id", verifyToken, isAdmin, deleteUser);

// GET admin stats
router.get("/stats", verifyToken, isAdmin, getStats);
router.get("/dashboard", verifyToken, isAdmin, getDashboard);
export default router;

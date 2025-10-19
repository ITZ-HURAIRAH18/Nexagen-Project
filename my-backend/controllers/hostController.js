import Availability from "../models/Availability.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";

// 📊 Dashboard Overview
export const getHostDashboard = async (req, res) => {
  try {
     const hostId = req.user._id || req.user.id;

    const totalBookings = await Booking.countDocuments({ hostId });
    const upcomingBookings = await Booking.countDocuments({
      hostId,
      start: { $gte: new Date() },
      status: "confirmed",
    });
    const pendingBookings = await Booking.countDocuments({
      hostId,
      status: "pending",
    });
    const cancelledBookings = await Booking.countDocuments({
      hostId,
      status: "cancelled",
    });

    const recentBookings = await Booking.find({ hostId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("guest start end status duration createdAt");

    const availability = await Availability.findOne({ hostId });

    res.json({
      success: true,
      hostId,
      stats: {
        totalBookings,
        upcomingBookings,
        pendingBookings,
        cancelledBookings,
      },
      availability,
      recentBookings,
    });
  } catch (error) {
    console.error("Error fetching host dashboard:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📅 All Bookings for this Host
export const getHostBookings = async (req, res) => {
  try {
    const hostId = req.user._id || req.user.id;

    const bookings = await Booking.find({ hostId })
      .populate("guest", "name email")
      .sort({ start: 1 })
      .select("guest start end status notes");

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching host bookings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🕓 Get Host Availability
export const getMyAvailability = async (req, res) => {
  try {
    // ✅ Prefer token ID, but fallback to body or query if needed
    const hostId = req.user?._id || req.user?.id || req.body.hostId || req.query.hostId;

    if (!hostId) {
      return res.status(400).json({ success: false, message: "Host ID missing" });
    }

    // ✅ Fetch availability for this host
    const availability = await Availability.find({ hostId });

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: "No availability found for this host",
      });
    }

    res.json({ success: true, availability });
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// ➕ Add New Availability
export const addAvailability = async (req, res) => {
  try {
    // ✅ Try to get hostId from token first, otherwise use request body
    const hostId = req.user?._id || req.user?.id || req.body.hostId;

    if (!hostId) {
      return res.status(400).json({ success: false, message: "Host ID missing" });
    }

    const {
      weekly,
      bufferBefore,
      bufferAfter,
      durations,
      maxPerDay,
      blockedDates,
      timezone,
    } = req.body;

    const newAvailability = await Availability.create({
      hostId,
      weekly,
      bufferBefore,
      bufferAfter,
      durations,
      maxPerDay,
      blockedDates,
      timezone,
    });

    res.status(201).json({ success: true, availability: newAvailability });
  } catch (error) {
    console.error("Error adding availability:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// ✏️ Update Availability by ID
export const updateAvailabilityById = async (req, res) => {
  try {
    const { id } = req.params; // get availability _id
    const hostId = req.user?._id || req.user?.id || req.body.hostId || req.query.hostId;

    const {
      weekly,
      bufferBefore,
      bufferAfter,
      durations,
      maxPerDay,
      blockedDates,
      timezone,
    } = req.body;

    const updated = await Availability.findOneAndUpdate(
      { _id: id, hostId }, // ensure host owns this availability
      { weekly, bufferBefore, bufferAfter, durations, maxPerDay, blockedDates, timezone },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Availability not found or not authorized." });
    }

    res.json({ success: true, availability: updated });
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ❌ Delete Availability by ID
export const deleteAvailabilityById = async (req, res) => {
  try {
    const { id } = req.params; // get availability _id
   const hostId = req.user?._id || req.user?.id || req.body.hostId || req.query.hostId;

    const deleted = await Availability.findOneAndDelete({ _id: id, hostId });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Availability not found or not authorized." });
    }

    res.json({ success: true, message: "Availability deleted successfully." });
  } catch (error) {
    console.error("Error deleting availability:", error);
    res.status(500).json({ success: false, message: "Server error while deleting availability." });
  }
};

// ⚙️ Update Host Settings
export const updateHostSettings = async (req, res) => {
  try {
    const hostId = req.user._id;
    const { username, timezone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      hostId,
      { username, timezone },
      { new: true }
    );

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating host settings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

import Booking from "../models/Booking.js";
import Availability from "../models/Availability.js";
import User from "../models/User.js";


// 1️⃣ Get all bookings for the logged-in user
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ createdByUserId: req.user._id })
      .populate("hostId", "name email")
      .sort({ start: 1 });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// 2️⃣ Get all hosts availability for user to pick slot
export const getAllHostsAvailability = async (req, res) => {
  try {
    const availability = await Availability.find().populate("hostId", "name email");
    res.json({ availability });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch hosts availability" });
  }
};

// 3️⃣ User creates booking request (no meeting link yet)
export const createBooking = async (req, res) => {
  try {
    const { hostId, start, end, duration, guest } = req.body;

    // Check overlapping bookings for this host
    const overlapping = await Booking.findOne({
      hostId,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        { start: { $lt: new Date(end), $gte: new Date(start) } },
        { end: { $lte: new Date(end), $gt: new Date(start) } }
      ]
    });

    if (overlapping) {
      return res.status(400).json({ message: "Selected slot is not available" });
    }

    const booking = await Booking.create({
      hostId,
      guest,
      start,
      end,
      duration,
      status: "pending", // ❌ pending by default
      createdByUserId: req.user._id,
      meetingLink: "" // ❌ empty, will be added by admin later
    });

    res.json({ message: "Booking request submitted", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

import Booking from "../models/Booking.js";
import Availability from "../models/Availability.js";
import User from "../models/User.js";

// 1️⃣ Get all bookings created by the currently logged-in user
export const getUserBookings = async (req, res) => {
  try {
    // 🧩 Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized. Please log in again." });
    }

   

    // ✅ Find all bookings created by the logged-in user
    const bookings = await Booking.find({ createdByUserId: req.user._id })
      .populate("hostId", "fullName email") // populate host details
      .sort({ start: 1 }); // sort by date ascending

    // ✅ Respond with result
    res.status(200).json({
      message: "User bookings fetched successfully",
      count: bookings.length,
      bookings,
    });
  } catch (err) {
    console.error("❌ Error fetching user bookings:", err);
    res.status(500).json({ message: "Failed to fetch user bookings" });
  }
};

// 2️⃣ Get all hosts availability for user to pick slot
export const getAllHostsAvailability = async (req, res) => {
  try {
    const availability = await Availability.find().populate("hostId", "fullName email");
    res.json({ availability });
  } catch (err) {
    console.error("❌ Error fetching availability:", err);
    res.status(500).json({ message: "Failed to fetch hosts availability" });
  }
};

// 3️⃣ User creates a booking request (no meeting link yet)
export const createBooking = async (req, res) => {
  try {
    console.log("📩 Incoming booking request body:", req.body);

    const { hostId, start, end, duration, guest, availabilityId } = req.body; // ✅ include availabilityId

    // ✅ Ensure user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized. Please log in again." });
    }

    // ✅ Validation
    if (!hostId || !start || !end || !guest?.name || !guest?.email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (new Date(start) >= new Date(end)) {
      return res.status(400).json({ message: "Start time must be before end time" });
    }

    // ✅ Check for overlapping bookings for the same host
    const overlapping = await Booking.findOne({
      hostId,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        { start: { $lt: new Date(end) }, end: { $gt: new Date(start) } },
      ],
    });

    if (overlapping) {
      return res.status(400).json({ message: "Selected slot is not available" });
    }

    // ✅ Create booking with availabilityId
    const booking = await Booking.create({
      hostId,
      availabilityId, // ✅ save availability reference
      guest,
      start,
      end,
      duration,
      status: "pending",
      createdByUserId: req.user._id,
      meetingLink: "",
    });

    console.log("✅ Booking created successfully:", booking);

    res.status(201).json({
      message: "Booking request submitted successfully",
      booking,
    });
  } catch (err) {
    console.error("❌ Create booking error:", err);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

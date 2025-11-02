// // controllers/meetingController.js
// import Booking from "../models/Booking.js";

// export const getMeetingByRoomId = async (req, res) => {
//   try {
//     const { roomId } = req.params;
//     const booking = await Booking.findOne({ meetingRoom: roomId, status: "confirmed" });

//     if (!booking) return res.status(404).json({ message: "Meeting not found" });

//     res.json({
//       valid: true,
//       roomId: booking.meetingRoom,
//       bookingInfo: {
//         guest: booking.guest,
//         start: booking.start,
//         end: booking.end,
//         hostId: booking.hostId,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching meeting:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// controllers/meetingController.js
// controllers/meetingController.js
export const getMeetingByRoomId = async (req, res) => {
  try {
    const { roomId } = req.params;

    // Temporary mock response
    return res.json({
      valid: true,
      url: `https://localhost:5173/meeting/${roomId}`,
      bookingInfo: {
        guest: "Demo Guest",
        hostId: "Demo Host",
        start: new Date(),
        end: new Date(),
      },
    });
  } catch (error) {
    console.error("Error fetching meeting:", error);
    res.status(500).json({ message: "Server error" });
  }
};
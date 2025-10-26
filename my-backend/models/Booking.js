import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    hostId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    availabilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Availability", // ✅ link to the Availability collection
      required: true, // optional, but recommended
    },
    guest: {
      name: String,
      email: String,
      phone: String,
    },
    start: Date,
    end: Date,
    duration: Number,
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "rescheduled", "pending"],
      default: "pending",
    },
    createdByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
     meetingRoom: String, // ✅ renamed from meetingLink
    notes: {
      hostNote: String,
      guestNote: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);

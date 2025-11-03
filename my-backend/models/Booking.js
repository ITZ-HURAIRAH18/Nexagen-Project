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
    bufferBefore: { type: Number, default: 0 },
    bufferAfter: { type: Number, default: 0 },
    // Access window including buffers (computed on confirmation)
    accessStart: { type: Date, default: null },
    accessEnd: { type: Date, default: null },
    // Email reminder flags
    reminderSentToGuest: { type: Boolean, default: false },
    reminderSentToHost: { type: Boolean, default: false },
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

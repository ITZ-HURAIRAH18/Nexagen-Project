import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    hostId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    guestName: { type: String, required: true },
    guestEmail: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // e.g., "14:00"
    endTime: { type: String, required: true },   // e.g., "14:30"
    duration: { type: Number, required: true },  // in minutes
    status: { 
      type: String, 
      enum: ["confirmed", "pending", "cancelled"], 
      default: "pending" 
    },
    notes: { type: String },       // optional meeting notes
    videoLink: { type: String },   // Daily.co link for meeting
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);

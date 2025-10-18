import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    hostId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    weekly: [
      {
        day: String,
        start: String,
        end: String,
      },
    ],
    bufferBefore: Number,
    bufferAfter: Number,
    durations: [Number],
    maxPerDay: Number,
    blockedDates: [String],
    timezone: String,
  },
  { timestamps: true }
);

export default mongoose.model("Availability", availabilitySchema);

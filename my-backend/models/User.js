import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "host", "admin"],
    default: "user",
  },
   profilePicture: { type: String },
  isGoogleAccount: { type: Boolean, default: false },
  availability: { type: Object, default: {} },
  bufferTime: { type: Number, default: 0 },
  dailyLimit: { type: Number, default: 0 },
  bookingLink: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("User", userSchema);

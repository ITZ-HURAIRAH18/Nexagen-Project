import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import hostRoutes from "./routes/hostRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/host", hostRoutes);
app.use("/api/admin", adminRoutes);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // or your frontend URL (e.g. http://localhost:5173)
    methods: ["GET", "POST"],
  },
});
// ✅ WebSocket events
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  // Listen for custom event
  socket.on("send_message", (msg) => {
    console.log("📨 Message received:", msg);
    io.emit("receive_message", msg); // broadcast to all clients
  });
socket.on("join_host_room", (hostId) => {
  socket.join(hostId);
  console.log(`Host ${hostId} joined their room`);
});

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});
export { io };
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

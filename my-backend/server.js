import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import https from "https";
import fs from "fs";
import { Server } from "socket.io";
import connectDB from "./config/db.js";

// ✅ Import routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import hostRoutes from "./routes/hostRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect MongoDB
connectDB();

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/host", hostRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/meetings", meetingRoutes);

// ✅ Create server (prefer HTTPS with local certs; fallback to HTTP)
let server;
try {
  const keyPath = new URL("./localhost-key.pem", import.meta.url);
  const certPath = new URL("./localhost.pem", import.meta.url);
  const sslOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
  server = https.createServer(sslOptions, app);
  console.log("🔐 HTTPS enabled (localhost-key.pem, localhost.pem)");
} catch (err) {
  console.warn(
    "⚠️ HTTPS certificates not found/invalid. Falling back to HTTP:",
    err?.message
  );
  server = http.createServer(app);
}
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ['websocket', 'polling'], // Support both transports
  allowEIO3: true, // Backward compatibility
  pingTimeout: 60000, // 60 seconds
  pingInterval: 25000, // 25 seconds
  connectTimeout: 45000, // 45 seconds
});

// ✅ Track meeting rooms
const meetingRooms = {};

// ===============================
// 🌍 GLOBAL SOCKET (dashboard, host updates, chat)
// ===============================
io.on("connection", (socket) => {
  console.log("🟢 Dashboard/Global Client Connected:", socket.id);

  // Chat / broadcast messages
  socket.on("send_message", (msg) => {
    console.log("💬 Global Message:", msg);
    io.emit("receive_message", msg);
  });

  // Host joins private room for dashboard live updates
  socket.on("join_host_room", (hostId) => {
    socket.join(hostId);
    console.log(`🏠 Host ${hostId} joined private dashboard room`);
  });

  // ✅ Dashboard disconnect
  socket.on("disconnect", () => {
    console.log("🔴 Dashboard/Global Client Disconnected:", socket.id);
  });
});
// ===============================
// 🎥 MEETING SOCKET NAMESPACE
// ===============================
const meetingNamespace = io.of("/meeting");

meetingNamespace.on("connection", (socket) => {
  console.log("🎥 Meeting Client Connected:", socket.id);

  // Join specific meeting room
  socket.on("join_meeting_room", (roomId) => {
    if (!meetingRooms[roomId]) meetingRooms[roomId] = [];
    meetingRooms[roomId].push(socket.id);
    socket.join(roomId);
    console.log(`👥 ${socket.id} joined meeting room ${roomId}`);

    const users = meetingRooms[roomId];

    // Assign roles for WebRTC
    if (users.length === 1) {
      socket.emit("meeting_role", { initiator: false });
    } else if (users.length === 2) {
      socket.emit("meeting_role", { initiator: true });
      const [firstUser] = users;
      meetingNamespace.to(firstUser).emit("peer_ready");
    } else {
      socket.emit("room_full");
    }
  });

  // WebRTC signaling between peers
  socket.on("signal", ({ roomId, signal, sender }) => {
    socket.to(roomId).emit("signal", { signal, sender });
  });

  // ✅ MEETING disconnect (separate from global)
  socket.on("disconnect", () => {
    console.log("❌ Meeting Client Disconnected:", socket.id);

    for (const roomId in meetingRooms) {
      meetingRooms[roomId] = meetingRooms[roomId].filter(
        (id) => id !== socket.id
      );

      if (meetingRooms[roomId].length === 0) {
        delete meetingRooms[roomId];
        console.log(`🧹 Meeting room ${roomId} deleted (empty)`);
      }
    }
  });
});

export { io };
// ✅ Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0'; // Listen on all network interfaces
server.listen(PORT, HOST, () =>
  console.log(`✅ Server running on ${HOST}:${PORT}`)
);

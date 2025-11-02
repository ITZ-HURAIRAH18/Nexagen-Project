import express from "express";
import dotenv from "dotenv";
import cors from "cors";
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

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/host", hostRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/meetings", meetingRoutes);

// ✅ Root health check
app.get("/", (req, res) => {
  res.json({ status: "Backend running ✅" });
});

// ✅ Only create HTTPS + Socket.IO when running locally
let io = null;
if (process.env.VERCEL !== "1") {
  const sslOptions = {
    key: fs.readFileSync("localhost-key.pem"),
    cert: fs.readFileSync("localhost.pem"),
  };

  const server = https.createServer(sslOptions, app);

  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const meetingRooms = {};

  io.on("connection", (socket) => {
    console.log("🟢 Global socket connected:", socket.id);
    socket.on("send_message", (msg) => io.emit("receive_message", msg));
    socket.on("disconnect", () =>
      console.log("🔴 Socket disconnected:", socket.id)
    );
  });

  const meetingNamespace = io.of("/meeting");

  meetingNamespace.on("connection", (socket) => {
    console.log("🎥 Meeting Client Connected:", socket.id);

    socket.on("join_meeting_room", (roomId) => {
      if (!meetingRooms[roomId]) meetingRooms[roomId] = [];
      meetingRooms[roomId].push(socket.id);
      socket.join(roomId);

      const users = meetingRooms[roomId];
      if (users.length === 1) {
        socket.emit("meeting_role", { initiator: false });
      } else if (users.length === 2) {
        socket.emit("meeting_role", { initiator: true });
        meetingNamespace.to(users[0]).emit("peer_ready");
      } else {
        socket.emit("room_full");
      }
    });

    socket.on("signal", ({ roomId, signal, sender }) => {
      socket.to(roomId).emit("signal", { signal, sender });
    });

    socket.on("disconnect", () => {
      for (const roomId in meetingRooms) {
        meetingRooms[roomId] = meetingRooms[roomId].filter(
          (id) => id !== socket.id
        );
        if (meetingRooms[roomId].length === 0) delete meetingRooms[roomId];
      }
    });
  });

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () =>
    console.log(`✅ Local HTTPS server running on port ${PORT}`)
  );
}

// ✅ Export app (Vercel entry point)
export default app;

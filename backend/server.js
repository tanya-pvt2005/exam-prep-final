import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";

dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// ============== API ROUTES ==================
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/quizzes", quizRoutes);

// =============================================
const PORT = process.env.PORT || 5000;

// Start HTTP server
const server = app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

// ================= WEBSOCKET SERVER ==================
const wss = new WebSocketServer({ server });

console.log("WebSocket server attached to same Express server");

wss.on("connection", (ws) => {
  console.log("🔗 New WebSocket client connected");

  ws.on("message", (message) => {
    let parsedMsg;
    try {
      parsedMsg = JSON.parse(message);
    } catch (err) {
      console.log("❌ Invalid JSON:", message);
      return;
    }

    // Broadcast to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(parsedMsg));
      }
    });
  });

  ws.on("close", () => console.log("❌ Client disconnected"));
});

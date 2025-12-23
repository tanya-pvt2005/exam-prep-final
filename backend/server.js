
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

const wss = new WebSocketServer({ server });

// Track connections
let adminSocket = null;
const users = new Map(); // userId -> { ws, username }

wss.on("connection", (ws) => {
  console.log(" New client connected");

  ws.on("message", (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch {
      return;
    }

    // Register user/admin
    if (data.type === "register") {
      if (data.role === "admin") {
        adminSocket = ws;
        console.log("Admin registered");

        // Send current user list to admin
        const userList = Array.from(users.values()).map(u => ({
          userId: u.userId,
          username: u.username
        }));
        adminSocket.send(JSON.stringify({ type: "user-list", users: userList }));
      }

      if (data.role === "user") {
        users.set(data.userId, { ws, username: data.username, userId: data.userId });
        console.log(" User registered:", data.username);

        // Notify admin of new user
        if (adminSocket) {
          adminSocket.send(JSON.stringify({
            type: "user-list",
            users: Array.from(users.values()).map(u => ({
              userId: u.userId,
              username: u.username
            }))
          }));
        }
      }
      return;
    }

    // User sends message → admin
    if (data.type === "user-message") {
      if (adminSocket) {
        const user = users.get(data.userId);
        if (!user) return;
        adminSocket.send(JSON.stringify({
          type: "user-message",
          userId: data.userId,
          username: user.username,
          message: data.message
        }));
      }
    }

    // Admin replies → specific user
    if (data.type === "admin-reply") {
      const user = users.get(data.toUserId);
      if (user) {
        user.ws.send(JSON.stringify({
          type: "admin-reply",
          message: data.message,
          from: "Admin"
        }));
      }
    }
  });

  ws.on("close", () => {
    // Remove from users if user
    for (const [id, u] of users.entries()) {
      if (u.ws === ws) {
        users.delete(id);
        console.log(" User disconnected:", u.username);

        // Update admin
        if (adminSocket) {
          adminSocket.send(JSON.stringify({
            type: "user-list",
            users: Array.from(users.values()).map(u => ({
              userId: u.userId,
              username: u.username
            }))
          }));
        }
        break;
      }
    }

    // Remove admin
    if (ws === adminSocket) {
      adminSocket = null;
      console.log(" Admin disconnected");
    }
  });
});

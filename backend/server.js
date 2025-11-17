import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// MUST BE TOP — load .env BEFORE anything else
dotenv.config();
console.log("ENV KEY =>", process.env.GEMINI_API_KEY);

import authRoutes from "./routes/authRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/quizzes", quizRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

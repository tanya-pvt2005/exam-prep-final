import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const models = await genAI.listModels();
    console.log("Available Models:");
    models.models.forEach(m => console.log(" -", m.name));
  } catch (err) {
    console.error("ERROR:", err);
  }
}

listModels();

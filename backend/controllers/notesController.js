// import { PrismaClient } from "@prisma/client";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const prisma = new PrismaClient();
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // ====================== GET ALL NOTES ======================
// export const getAll = async (req, res) => {
//   const notes = await prisma.note.findMany();
//   res.json(notes);
// };

// // ====================== GET ONE NOTE ======================
// export const getOne = async (req, res) => {
//   const note = await prisma.note.findUnique({
//     where: { id: Number(req.params.id) }
//   });

//   if (!note) return res.status(404).json({ message: "Note not found" });

//   res.json(note);
// };

// // ====================== CREATE NOTE ======================
// export const create = async (req, res) => {
//   const { title, content } = req.body;

//   if (!title || !content)
//     return res.status(400).json({ message: "Missing fields" });

//   const note = await prisma.note.create({
//     data: {
//       title,
//       content,
//       createdBy: req.user?.id || null,
//     },
//   });

//   res.json(note);
// };

// // ====================== DELETE NOTE ======================
// export const remove = async (req, res) => {
//   try {
//     await prisma.note.delete({
//       where: { id: Number(req.params.id) }
//     });

//     res.json({ message: "Deleted" });
//   } catch {
//     return res.status(404).json({ message: "Note not found" });
//   }
// };

// // ====================== UPDATE NOTE ======================
// export const update = async (req, res) => {
//   const { title, content } = req.body;

//   if (!title || !content)
//     return res.status(400).json({ message: "Missing fields" });

//   const note = await prisma.note.update({
//     where: { id: Number(req.params.id) },
//     data: { title, content }
//   });

//   res.json(note);
// };

// // ====================== AI SUMMARY (Prisma) ======================
// export const generateSummary = async (req, res) => {
//   const note = await prisma.note.findUnique({
//     where: { id: Number(req.params.id) }
//   });

//   if (!note)
//     return res.status(404).json({ message: "Note not found" });

//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//     const prompt = `Summarize the following in simple words:\n\n${note.content}`;

//     const result = await model.generateContent(prompt);
//     const summary = result.response.text();

//     res.json({ summary });
//   } catch (err) {
//     console.error("Gemini Error:", err);
//     res.status(500).json({ message: "Summary failed" });
//   }
// };
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// GET ALL NOTES
export const getAll = async (req, res) => {
  const notes = await prisma.note.findMany();
  res.json(notes);
};

// GET ONE NOTE
export const getOne = async (req, res) => {
  const note = await prisma.note.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!note) return res.status(404).json({ message: "Note not found" });

  res.json(note);
};

// CREATE NOTE
export const create = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content)
    return res.status(400).json({ message: "Missing fields" });

  const note = await prisma.note.create({
    data: {
      title,
      content,
      createdBy: req.user?.id || null,
    },
  });

  res.json(note);
};

// UPDATE NOTE
export const update = async (req, res) => {
  const { title, content } = req.body;

  const note = await prisma.note.update({
    where: { id: Number(req.params.id) },
    data: { title, content },
  });

  res.json(note);
};

// DELETE NOTE
export const remove = async (req, res) => {
  await prisma.note.delete({
    where: { id: Number(req.params.id) },
  });

  res.json({ message: "Deleted" });
};

// AI SUMMARY
export const generateSummary = async (req, res) => {
  const note = await prisma.note.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!note) return res.status(404).json({ message: "Note not found" });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(
      `Summarize in simple words:\n${note.content}`
    );

    res.json({ summary: result.response.text() });
  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({ message: "Summary failed" });
  }
};

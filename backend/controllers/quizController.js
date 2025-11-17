// import { allQuizzes, findQuiz, createQuiz } from "../models/quizModel.js";

// export function list(req, res) {
//   const quizzes = allQuizzes();
//   res.json(quizzes);
// }

// export function get(req, res) {
//   const quiz = findQuiz(req.params.id);
//   if (!quiz) return res.status(404).json({ message: "Quiz not found" });
//   res.json(quiz);
// }

// export function submit(req, res) {
//   const { answers } = req.body; // expect array of {questionId, answer}
//   const quiz = findQuiz(req.params.id);

//   if (!quiz) return res.status(404).json({ message: "Quiz not found" });

//   let score = 0;
//   const total = quiz.questions ? quiz.questions.length : 0;

//   if (Array.isArray(answers)) {
//     answers.forEach((a) => {
//       const q = quiz.questions.find(
//         (q) => String(q.id) === String(a.questionId)
//       );
//       if (q && q.correct === a.answer) score++;
//     });
//   }

//   res.json({ score, total });
// }
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// LIST QUIZZES
export const list = async (req, res) => {
  const quizzes = await prisma.quiz.findMany({
    include: { questions: true },
  });
  res.json(quizzes);
};

// GET QUIZ
export const get = async (req, res) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: Number(req.params.id) },
    include: { questions: true },
  });

  if (!quiz) return res.status(404).json({ message: "Quiz not found" });
  res.json(quiz);
};

// SUBMIT QUIZ
export const submit = async (req, res) => {
  const { answers } = req.body;

  const quiz = await prisma.quiz.findUnique({
    where: { id: Number(req.params.id) },
    include: { questions: true },
  });

  if (!quiz) return res.status(404).json({ message: "Quiz not found" });

  let score = 0;
  const total = quiz.questions.length;

  answers.forEach((ans) => {
    const q = quiz.questions.find((q) => q.id === ans.questionId);
    if (q && q.correct === ans.answer) score++;
  });

  res.json({ score, total });
};

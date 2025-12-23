import { readJSON, writeJSON } from "../config/db.js";

const FILE = "quizzes.json";

export function allQuizzes() {
  return readJSON(FILE);
}

export function findQuiz(id) {
  return allQuizzes().find((q) => String(q.id) === String(id));
}

export function createQuiz(quiz) {
  const quizzes = allQuizzes();
  quizzes.push(quiz);
  writeJSON(FILE, quizzes);
  return quiz;
}

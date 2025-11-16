import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});

  // Sample quiz data
  const quiz = [
    {
      question: "What does HTTP stand for?",
      options: ["HyperText Transfer Protocol", "HyperText Transmission Protocol", "Hyperlink Transfer Protocol", "Hyper Terminal Text Protocol"],
      correct: "HyperText Transfer Protocol"
    },
    {
      question: "Which of the following is a NoSQL database?",
      options: ["MongoDB", "MySQL", "PostgreSQL", "SQLite"],
      correct: "MongoDB"
    },
    {
      question: "Default HTTPS port?",
      options: ["443", "80", "21", "22"],
      correct: "443"
    },
  ];

  const handleAnswer = (option) => setAnswers({ ...answers, [current]: option });

  const nextQuestion = () => {
    if (current < quiz.length - 1) setCurrent(current + 1);
  };

  const prevQuestion = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const finishQuiz = () => {
    navigate(`/quiz/${id}/result`, { state: { answers, quiz } });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 px-4 py-6 flex flex-col items-center gap-6">
      
      <Link to="/quizzes" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
        <FiArrowLeft className="text-xl" /> Back to Quizzes
      </Link>

      <div className="w-full max-w-3xl bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          📝 Quiz
        </h1>
        <p className="text-gray-300">Question {current + 1} of {quiz.length}</p>
      </div>

      <div className="w-full max-w-3xl bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md flex flex-col gap-4">
        <h2 className="text-2xl font-semibold mb-2 text-blue-400">{quiz[current].question}</h2>
        {quiz[current].options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(option)}
            className={`w-full text-left px-4 py-3 rounded-xl border border-gray-600 transition-all hover:bg-blue-500/50
                        ${answers[current] === option ? "bg-blue-500/60" : ""}`}
          >
            {option}
          </button>
        ))}

        <div className="flex justify-between mt-4">
          <button
            onClick={prevQuestion}
            disabled={current === 0}
            className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 disabled:opacity-50 transition-all"
          >
            Previous
          </button>
          {current < quiz.length - 1 ? (
            <button
              onClick={nextQuestion}
              className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-all"
            >
              Next
            </button>
          ) : (
            <button
              onClick={finishQuiz}
              className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 transition-all"
            >
              Finish Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

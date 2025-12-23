import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:5000/api/quizzes/${id}`)
      .then(res => setQuiz(res.data))
      .catch(() => alert("Quiz not found"));
  }, [id]);

  if (!quiz) return <p className="text-white">Loading quiz...</p>;

  const questions = quiz.questions;
  const q = questions[current];

  const handleAnswer = (option) =>
    setAnswers({ ...answers, [current]: option });

  const next = () => current < questions.length - 1 && setCurrent(current + 1);
  const prev = () => current > 0 && setCurrent(current - 1);

  const finish = () =>
    navigate(`/quiz/${id}/result`, {
      state: { answers, questions }
    });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 px-4 py-6 flex flex-col items-center gap-6">
      
      <Link to="/quiz" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
        <FiArrowLeft className="text-xl" /> Back to Quizzes
      </Link>

      <div className="w-full max-w-3xl bg-gray-800/40 border border-gray-700 rounded-2xl p-6 text-center">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          📝 {quiz.title}
        </h1>
        <p className="text-gray-300">
          Question {current + 1} of {questions.length}
        </p>
      </div>

      <div className="w-full max-w-3xl bg-gray-800/40 border border-gray-700 rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-blue-400">{q.text}</h2>

        {[q.optionA, q.optionB, q.optionC, q.optionD].map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(option)}
            className={`w-full mt-3 px-4 py-3 rounded-xl border border-gray-600 
              ${answers[current] === option ? "bg-blue-500/60" : "hover:bg-blue-500/40"}`}
          >
            {option}
          </button>
        ))}

        <div className="flex justify-between mt-6">
          <button onClick={prev} disabled={current === 0}
            className="px-4 py-2 bg-gray-700 rounded-xl disabled:opacity-40">
            Previous
          </button>

          {current < questions.length - 1 ? (
            <button onClick={next} className="px-4 py-2 bg-blue-500 rounded-xl">
              Next
            </button>
          ) : (
            <button onClick={finish} className="px-4 py-2 bg-green-500 rounded-xl">
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

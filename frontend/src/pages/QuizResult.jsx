import { useLocation, Link } from "react-router-dom";

export default function QuizResult() {
  const { state } = useLocation();
  const { answers, questions } = state || {};

  if (!questions) return <p className="text-white">No result available.</p>;

  const score = questions.reduce(
    (acc, q, idx) => acc + (answers[idx] === q.correct ? 1 : 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 px-4 py-6 flex flex-col items-center gap-6">

      <div className="w-full max-w-3xl bg-gray-800/40 p-6 text-center rounded-2xl">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
          🎉 Quiz Result
        </h1>
        <p className="text-gray-300">You scored {score} / {questions.length}</p>
      </div>

      <div className="w-full max-w-3xl flex flex-col gap-4">
        {questions.map((q, idx) => (
          <div key={idx} className="bg-gray-800/40 p-4 rounded-2xl border border-gray-700">
            <h2 className="text-lg text-blue-400">{q.text}</h2>
            <p className={`mt-1 ${answers[idx] === q.correct ? "text-green-400" : "text-red-400"}`}>
              Your answer: {answers[idx] || "Not answered"}
            </p>
            {answers[idx] !== q.correct && (
              <p className="text-gray-400">Correct answer: {q.correct}</p>
            )}
          </div>
        ))}
      </div>

      <Link
        to="/quiz"
        className="mt-6 px-6 py-3 bg-blue-500 rounded-xl text-white transition"
      >
        Back to Quizzes
      </Link>
    </div>
  );
}

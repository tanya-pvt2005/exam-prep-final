import { useLocation, Link } from "react-router-dom";

export default function QuizResult() {
  const { state } = useLocation();
  const { answers, quiz } = state || {};
  if (!quiz) return <p className="text-white">No quiz data found.</p>;

  const score = quiz.reduce((acc, q, idx) => acc + (answers[idx] === q.correct ? 1 : 0), 0);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 px-4 py-6 flex flex-col items-center gap-6">

      <div className="w-full max-w-3xl bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          🎉 Quiz Result
        </h1>
        <p className="text-gray-300">You scored {score} / {quiz.length}</p>
      </div>

      <div className="w-full max-w-3xl flex flex-col gap-4">
        {quiz.map((q, idx) => (
          <div key={idx} className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-2xl p-4 shadow-md">
            <h2 className="text-lg font-semibold text-blue-400">{q.question}</h2>
            <p className={`mt-1 ${answers[idx] === q.correct ? "text-green-400" : "text-red-400"}`}>
              Your answer: {answers[idx] || "Not answered"} {answers[idx] === q.correct ? "✔" : "✖"} 
            </p>
            {answers[idx] !== q.correct && (
              <p className="text-gray-300">Correct answer: {q.correct}</p>
            )}
          </div>
        ))}
      </div>

      <Link
        to="/quiz"
        className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-semibold transition-all"
      >
        Back to Quizzes
      </Link>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function QuizList() {
  const [query, setQuery] = useState("");
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/quizzes")
      .then(res => setQuizzes(res.data))
      .catch(err => console.error("Quiz fetch error:", err));
  }, []);

  const filtered = quizzes.filter(q =>
    q.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 px-4 py-6 flex flex-col items-center gap-6">

      <div className="w-full max-w-3xl bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          📝 Quiz Library
        </h1>
        <p className="text-gray-300">Select a quiz to test your knowledge</p>
      </div>

      <input
        type="text"
        placeholder="Search quizzes..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full max-w-xl px-4 py-3 bg-gray-800/40 text-white placeholder-gray-400 backdrop-blur-md border border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition-all"
      />

      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        {filtered.length === 0 && (
          <p className="text-gray-400 text-center col-span-full">No quizzes found</p>
        )}

        {filtered.map(q => (
          <Link
            key={q.id}
            to={`/quiz/${q.id}`}
            className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-2xl p-5 hover:bg-gray-800/50 hover:scale-[1.02] transition-all shadow-lg"
          >
            <h2 className="text-xl font-semibold text-white">{q.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

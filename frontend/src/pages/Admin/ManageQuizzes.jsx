import React from 'react'
import { useState } from "react";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

const ManageQuizzes = () => {
 const [quizzes, setQuizzes] = useState([
    { id: 1, title: "Networking Basics", desc: "OSI model, TCP/IP, routing." },
    { id: 2, title: "Database Fundamentals", desc: "Normalization, SQL basics." },
  ]);

  const [newQuiz, setNewQuiz] = useState({ title: "", desc: "" });
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => setNewQuiz({ ...newQuiz, [e.target.name]: e.target.value });

  const handleSave = () => {
    if (!newQuiz.title || !newQuiz.desc) return;

    if (editId) {
      setQuizzes(quizzes.map(q => (q.id === editId ? { ...q, ...newQuiz } : q)));
      setEditId(null);
    } else {
      setQuizzes([...quizzes, { id: Date.now(), ...newQuiz }]);
    }
    setNewQuiz({ title: "", desc: "" });
  };

  const handleEdit = (quiz) => {
    setNewQuiz({ title: quiz.title, desc: quiz.desc });
    setEditId(quiz.id);
  };

  const handleDelete = (id) => setQuizzes(quizzes.filter(q => q.id !== id));

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-6 flex flex-col gap-6">

      {/* Header */}
      <div className="w-full max-w-6xl mx-auto bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          🏆 Manage Quizzes
        </h1>
        <p className="text-gray-300">Create, edit, and delete quizzes</p>
      </div>

      {/* Quiz Form */}
      <div className="w-full max-w-6xl mx-auto bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md flex flex-col gap-4">
        <input
          type="text"
          name="title"
          placeholder="Quiz Title"
          value={newQuiz.title}
          onChange={handleChange}
          className="px-4 py-2 rounded-xl bg-gray-800/60 outline-none border border-gray-700 focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          name="desc"
          placeholder="Quiz Description"
          value={newQuiz.desc}
          onChange={handleChange}
          rows={3}
          className="px-4 py-2 rounded-xl bg-gray-800/60 outline-none border border-gray-700 focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold flex items-center gap-2 justify-center"
        >
          <FiPlus /> {editId ? "Update Quiz" : "Add Quiz"}
        </button>
      </div>

      {/* Quiz List */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
        {quizzes.map(quiz => (
          <div key={quiz.id} className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-2xl p-4 shadow-md flex flex-col gap-2">
            <h2 className="text-xl font-semibold">{quiz.title}</h2>
            <p className="text-gray-300">{quiz.desc}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(quiz)}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-yellow-500 hover:bg-yellow-600 rounded-xl"
              >
                <FiEdit /> Edit
              </button>
              <button
                onClick={() => handleDelete(quiz.id)}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-red-500 hover:bg-red-600 rounded-xl"
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default ManageQuizzes

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FiUser, FiBook, FiEdit, FiSettings } from "react-icons/fi";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // ⭐ Only admin can access
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") navigate("/"); 
  }, []);

  // ⭐ Real stats from backend
  const [stats, setStats] = useState({ users: 0, notes: 0, quizzes: 0 });

  useEffect(() => {
    async function loadStats() {
      try {
        const notesRes = await axios.get("/api/notes");
        const quizRes = await axios.get("/api/quizzes");

        setStats({
          users: 0, // add real users later
          notes: notesRes.data.length,
          quizzes: quizRes.data.length,
        });
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-6 flex flex-col gap-6">

      {/* Header */}
      <div className="w-full max-w-6xl mx-auto bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          🛠 Admin Dashboard
        </h1>
        <p className="text-gray-300">Manage users, notes, quizzes, and settings</p>
      </div>

      {/* Stats Cards */}
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-3 gap-6 mx-auto">
        <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md flex flex-col items-center">
          <FiUser className="text-blue-400 text-3xl mb-2" />
          <h2 className="text-2xl font-semibold">{stats.users}</h2>
          <p className="text-gray-300">Registered Users</p>
        </div>

        <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md flex flex-col items-center">
          <FiBook className="text-green-400 text-3xl mb-2" />
          <h2 className="text-2xl font-semibold">{stats.notes}</h2>
          <p className="text-gray-300">Total Notes</p>
        </div>

        <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md flex flex-col items-center">
          <FiEdit className="text-yellow-400 text-3xl mb-2" />
          <h2 className="text-2xl font-semibold">{stats.quizzes}</h2>
          <p className="text-gray-300">Quizzes Created</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <Link
          to="/admin/users"
          className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md flex flex-col items-center hover:bg-gray-800/50 transition cursor-pointer"
        >
          <FiUser className="text-blue-400 text-2xl mb-2" />
          <p>Manage Users</p>
        </Link>

        <Link
          to="/admin/manage-notes"
          className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md flex flex-col items-center hover:bg-gray-800/50 transition cursor-pointer"
        >
          <FiBook className="text-green-400 text-2xl mb-2" />
          <p>Manage Notes</p>
        </Link>

        <Link
          to="/admin/manage-quizzes"
          className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md flex flex-col items-center hover:bg-gray-800/50 transition cursor-pointer"
        >
          <FiEdit className="text-yellow-400 text-2xl mb-2" />
          <p>Manage Quizzes</p>
        </Link>

        <Link
          to="/admin/settings"
          className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md flex flex-col items-center hover:bg-gray-800/50 transition "
        >
          <FiSettings className="text-purple-400 text-2xl mb-2" />
          <p>Settings</p>
        </Link>

      </div>

    </div>
  );
}

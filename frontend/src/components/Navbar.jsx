import React from 'react'
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className=" backdrop-blur-md border-b text-white border-white/40 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-50">
          ExamPrep
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link className="hover:text-blue-600" to="/notes">Notes</Link>
          <Link className="hover:text-blue-600" to="/quiz">Quiz</Link>
          <Link className="hover:text-blue-600" to="/chat">Chat</Link>
          <Link className="hover:text-blue-600" to="/admin">Admin</Link>
          <Link
            to="/auth"
            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

import { useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

export default function NotesList() {
  const [query, setQuery] = useState("");

  // SAMPLE notes
  const sampleNotes = [
    { id: 1, title: "Introduction to Networking", desc: "Basics of OSI model, TCP/IP, packets & routing." },
    { id: 2, title: "Database Normalization", desc: "1NF, 2NF, 3NF and BCNF explained simply." },
    { id: 3, title: "Operating Systems", desc: "Processes, threads, scheduling algorithms." },
    { id: 4, title: "WebSockets", desc: "Real-time communication basics." },
  ];

  // Filter notes safely
  const filteredNotes = sampleNotes.filter((note) =>
    note.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-900 px-4 py-6 text-gray-100">

      {/* Glass Header */}
      <div className="w-full max-w-3xl bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-xl p-6 mb-6 shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          📘 Notes Library
        </h1>
        <p className="text-gray-300">Browse subject-wise notes</p>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-xl relative mb-8">
        <FiSearch className="absolute left-3 top-3 text-gray-300 text-xl" />
        <input
          type="text"
          placeholder="Search notes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-800/40 text-white placeholder-gray-400
                     backdrop-blur-md border border-gray-700 rounded-xl shadow-sm
                     focus:ring-2 focus:ring-blue-400 outline-none transition-all"
        />
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {filteredNotes.length === 0 && (
          <p className="text-gray-400 text-center col-span-full">No notes found</p>
        )}

        {filteredNotes.map((note) => (
          <Link
            key={note.id}
            to={`/notes/${note.id}`}
            className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-2xl p-5
                       hover:bg-gray-800/50 hover:scale-[1.02] transition-all duration-200
                       cursor-pointer shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-2 text-white">{note.title}</h2>
            <p className="text-gray-300 text-sm">{note.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

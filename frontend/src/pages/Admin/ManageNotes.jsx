import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

const ManageNotes = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [editId, setEditId] = useState(null);

  // Fetch notes from backend
  useEffect(() => {
    axios.get("/api/notes")
      .then(res => setNotes(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) =>
    setNewNote({ ...newNote, [e.target.name]: e.target.value });

  // Add or Update note
  const handleSave = async () => {
    if (!newNote.title || !newNote.content) return alert("All fields required");

    try {
      if (editId) {
        // Update existing note
        const res = await axios.put(`/api/notes/${editId}`, newNote);
        setNotes(notes.map(n => (n.id === editId ? res.data : n)));
        setEditId(null);
      } else {
        // Create new note
        const res = await axios.post("/api/notes", newNote);
        setNotes([...notes, res.data]);
      }

      setNewNote({ title: "", content: "" });
    } catch (err) {
      console.error(err);
      alert("Failed");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/notes/${id}`);
      setNotes(notes.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Edit
  const handleEdit = (note) => {
    setNewNote({ title: note.title, content: note.content });
    setEditId(note.id);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-6 flex flex-col gap-6">

      <div className="w-full max-w-6xl mx-auto bg-gray-800/40 backdrop-blur-md border 
        border-gray-700 rounded-2xl p-6 shadow-lg text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 
        to-pink-400 bg-clip-text text-transparent">
          📝 Manage Notes
        </h1>
      </div>

      {/* Form */}
      <div className="w-full max-w-6xl mx-auto bg-gray-800/40 backdrop-blur-md border 
        border-gray-700 rounded-2xl p-6 shadow-md flex flex-col gap-4">

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newNote.title}
          onChange={handleChange}
          className="px-4 py-2 rounded-xl bg-gray-800/60 outline-none border border-gray-700 
          focus:ring-2 focus:ring-blue-400"
        />

        <textarea
          name="content"
          placeholder="Content"
          value={newNote.content}
          onChange={handleChange}
          rows={3}
          className="px-4 py-2 rounded-xl bg-gray-800/60 outline-none border border-gray-700 
          focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold 
          flex items-center gap-2 justify-center"
        >
          <FiPlus /> {editId ? "Update Note" : "Add Note"}
        </button>
      </div>

      {/* Notes List */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
        {notes.map(note => (
          <div key={note.id}
            className="bg-gray-800/40 backdrop-blur-md border border-gray-700 
            rounded-2xl p-4 shadow-md flex flex-col gap-2">

            <h2 className="text-xl font-semibold">{note.title}</h2>
            <p className="text-gray-300">{note.content}</p>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(note)}
                className="flex-1 px-2 py-1 bg-yellow-500 hover:bg-yellow-600 rounded-xl flex 
                items-center justify-center gap-1"
              >
                <FiEdit /> Edit
              </button>

              <button
                onClick={() => handleDelete(note.id)}
                className="flex-1 px-2 py-1 bg-red-500 hover:bg-red-600 rounded-xl flex 
                items-center justify-center gap-1"
              >
                <FiTrash2 /> Delete
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default ManageNotes;

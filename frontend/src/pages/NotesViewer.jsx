import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiBookOpen, FiStar } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "axios";

export default function NotesViewer() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch note from backend
  useEffect(() => {
    async function fetchNote() {
      try {
        const res = await axios.get(`/api/notes/${id}`);
        setNote(res.data);
      } catch (err) {
        console.error("Error loading note:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNote();
  }, [id]);

  if (loading) return <p className="text-gray-400 p-6">Loading...</p>;
  if (!note) return <p className="text-gray-400 p-6">Note not found</p>;

  return (
    <div className="w-full min-h-screen p-6 bg-gray-900 text-gray-100 flex flex-col gap-6">

      {/* Back Button */}
      <Link
        to="/notes"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition cursor-pointer"
      >
        <FiArrowLeft className="text-xl" />
        Back to Notes
      </Link>

      {/* Title Section */}
      <div className="w-full bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md">
        <h1 className="text-3xl font-extrabold flex items-center gap-3 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          <FiBookOpen className="text-gray-300" />
          {note.title}
        </h1>
        <p className="text-gray-300 mt-2 text-sm">
          View your note & generate an AI summary
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Note Content */}
        <div className="lg:col-span-2 bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">📝 Full Note</h2>
          <div className="prose prose-lg text-gray-200 max-w-none whitespace-pre-line leading-relaxed">
            {note.content}
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4 text-yellow-400">
              <FiStar />
              AI Summary
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Get an instant AI-powered summary of this note with one click.
            </p>
          </div>
          <button
  onClick={async () => {
    try {
      const res = await axios.post(`/api/notes/${id}/summary`);
      alert("AI Summary:\n\n" + res.data.summary);
    } catch (err) {
      console.error(err);
      alert("Summary failed. Check console.");
    }
  }}
  className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
>
  Generate Summary ✨
</button>

        </div>

      </div>
    </div>
  );
}

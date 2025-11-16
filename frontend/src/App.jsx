import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ParticlesBg from 'particles-bg'
import MouseParticles from 'react-mouse-particles'

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Auth from "./pages/Auth";
import NotesList from "./pages/NotesList";
import NotesViewer from "./pages/NotesViewer";
import ChatRoom from "./pages/ChatRoom";

import QuizList from "./pages/QuizList";
import QuizPage from "./pages/QuizPage";
import QuizResult from "./pages/QuizResult";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageNotes from "./pages/Admin/ManageNotes";
import ManageQuizzes from "./pages/Admin/ManageQuizzes";

export default function App() {

  const cobwebConfig = {
    num: 80, // number of particles
    rps: 0.02, // rotation speed
    radius: [2, 3], // size of particles
    life: [2, 5],
    v: [0.3, 0.8], // speed
    tha: [-50, 50],
    alpha: [0.5, 0.1],
    color: ["#ffffff63", "#7b5fff", "#5fffb2", "#ffe75f"], // bright party colors
    cross: "dead",
    random: 15,
    g: 0,
    position: "all",
    onParticleUpdate: (ctx, particle) => {
      ctx.beginPath();
      ctx.arc(particle.p.x, particle.p.y, particle.radius, 0, 2 * Math.PI);
      // pick a random color from array
      const color = Array.isArray(particle.color)
        ? particle.color[Math.floor(Math.random() * particle.color.length)]
        : particle.color;
      ctx.fillStyle = color;
      ctx.fill();
      ctx.closePath();
    },
  };
  return (
    <div
      className="appWrapper min-h-screen flex flex-col bg-gray-900" style={{ position: "relative", width: "100%", height: "100vh" }}
    >
       <ParticlesBg config={cobwebConfig} type="custom" bg={true} />
        <MouseParticles g={10} v = {0.7} radius ={10} alpha = {0.4} color="random" cull="col,image-wrapper"/>
       
      <Navbar />


      <main className="flex-1 container mx-auto px-4 py-6">
        <Routes>
          <Route path="/auth" element={<Auth />} />

          <Route path="/notes" element={<NotesList />} />
          <Route path="/notes/:id" element={<NotesViewer />} />

          <Route path="/chat" element={<ChatRoom />} />

          <Route path="/quiz" element={<QuizList />} />
          <Route path="/quiz/:id" element={<QuizPage />} />
          <Route path="/quiz/:id/result" element={<QuizResult />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/notes" element={<ManageNotes />} />
          <Route path="/admin/quizzes" element={<ManageQuizzes />} />

          <Route path="*" element={<Auth />} />
        </Routes>
      </main>

      <Footer />
      <ToastContainer position="top-right" />
    </div>

  );
}

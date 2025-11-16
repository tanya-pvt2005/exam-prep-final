import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    adminKey: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "login") {
        await axios.post("/api/auth/login", {
          email: form.email,
          password: form.password,
        });
        toast.success("Logged in!");
        navigate("/notes");
      }

      if (mode === "register") {
        await axios.post("/api/auth/register", {
          name: form.name,
          email: form.email,
          password: form.password,
        });
        toast.success("Account created!");
        navigate("/notes");
      }

      if (mode === "admin") {
        await axios.post("/api/auth/admin", {
          email: form.email,
          password: form.password,
          adminKey: form.adminKey,
        });
        toast.success("Admin logged in!");
        navigate("/admin");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md p-8 rounded-3xl shadow-xl border border-white/20 bg-gray-800/40 backdrop-blur-2xl transition-all">

        {/* Title */}
        <h1 className="text-center text-4xl font-extrabold mb-6
                       bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400
                       bg-clip-text text-transparent drop-shadow-md">
          {mode === "login" && "Welcome Back"}
          {mode === "register" && "Create Account"}
          {mode === "admin" && "Admin Login"}
        </h1>

        {/* Tabs */}
        <div className="flex bg-gray-700/30 rounded-xl gap-5 p-1 shadow-inner mb-6">
          {["login", "register", "admin"].map((tab) => (
            <button
              key={tab}
              onClick={() => setMode(tab)}
              className={`flex-1 py-2 rounded-lg transition-all text-sm font-semibold cursor-pointer
                ${
                  mode === tab
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-700/50"
                }
              `}
            >
              {tab === "login" && "Login"}
              {tab === "register" && "Register"}
              {tab === "admin" && "Admin"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form className="space-y-4">
          {mode === "register" && (
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-white/30 rounded-xl
                         bg-gray-700/40 text-white placeholder-gray-300
                         backdrop-blur-md shadow-sm focus:ring-2 focus:ring-blue-400
                         outline-none transition-all"
            />
          )}

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-white/30 rounded-xl
                       bg-gray-700/40 text-white placeholder-gray-300
                       backdrop-blur-md shadow-sm focus:ring-2 focus:ring-blue-400
                       outline-none transition-all"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-white/30 rounded-xl
                       bg-gray-700/40 text-white placeholder-gray-300
                       backdrop-blur-md shadow-sm focus:ring-2 focus:ring-blue-400
                       outline-none transition-all"
          />

          {mode === "admin" && (
            <input
              name="adminKey"
              type="text"
              placeholder="Admin Secret Key"
              value={form.adminKey}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-white/30 rounded-xl
                         bg-gray-700/40 text-white placeholder-gray-300
                         backdrop-blur-md shadow-sm focus:ring-2 focus:ring-blue-400
                         outline-none transition-all"
            />
          )}

          {/* Submit Button */}
          <button
            onClick={submit}
            className="w-full mt-4 py-3 bg-blue-500 text-white font-semibold rounded-xl
                       shadow-md hover:bg-blue-600 hover:shadow-lg active:scale-95
                       transition-all cursor-pointer"
          >
            {mode === "login" && "Login"}
            {mode === "register" && "Create Account"}
            {mode === "admin" && "Login as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;

import { useState } from "react";

import api from "../api/axios";
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
      let res;

      // USER LOGIN
      if (mode === "login") {
        res = await api.post("/auth/login", {
          email: form.email,
          password: form.password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        toast.success("Logged in!");
        navigate("/notes");
      }

      // USER REGISTER
      if (mode === "register") {
        res = await api.post("/auth/register", {
          name: form.name,
          email: form.email,
          password: form.password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        toast.success("Account created!");
        navigate("/notes");
      }

      // ADMIN LOGIN
      if (mode === "admin") {
        res = await api.post("/auth/admin", {
          email: form.email,
          password: form.password,
          adminKey: form.adminKey,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role); 
        localStorage.setItem("user", JSON.stringify(res.data.user));

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

        <h1 className="text-center text-4xl font-extrabold mb-6
                       bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400
                       bg-clip-text text-transparent">
          {mode === "login" && "Welcome Back"}
          {mode === "register" && "Create Account"}
          {mode === "admin" && "Admin Login"}
        </h1>

        <div className="flex bg-gray-700/30 rounded-xl gap-5 p-1 shadow-inner mb-6">
          {["login", "register", "admin"].map((tab) => (
            <button
              key={tab}
              onClick={() => setMode(tab)}
              className={`flex-1 py-2 rounded-lg transition-all text-sm font-semibold
              ${mode === tab ? "bg-blue-500 text-white" : "text-gray-300 hover:bg-gray-700/50"}
            `}
            >
              {tab === "login" && "Login"}
              {tab === "register" && "Register"}
              {tab === "admin" && "Admin"}
            </button>
          ))}
        </div>

        <form className="space-y-4">
          {mode === "register" && (
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="input-box"
            />
          )}

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="input-box"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="input-box"
          />

          {mode === "admin" && (
            <input
              name="adminKey"
              type="text"
              placeholder="Admin Secret Key"
              value={form.adminKey}
              onChange={handleChange}
              className="input-box"
            />
          )}

          <button
            onClick={submit}
            className="btn-primary"
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

// src/services/auth.js
import API from "./api";

// USER SIGNUP
export function register(data) {
  return API.post("/auth/register", data);
}

// USER LOGIN
export function login(data) {
  return API.post("/auth/login", data);
}

// ADMIN LOGIN
export function adminLogin(data) {
  return API.post("/auth/admin", data);
}

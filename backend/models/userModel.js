import { readJSON, writeJSON } from "../config/db.js";

const FILE = "users.json";

export function allUsers() {
  return readJSON(FILE);
}

export function findByEmail(email) {
  return allUsers().find((u) => u.email === email);
}

export function findById(id) {
  return allUsers().find((u) => String(u.id) === String(id));
}

export function createUser(user) {
  const users = allUsers();
  users.push(user);
  writeJSON(FILE, users);
  return user;
}

export function updateUser(id, data) {
  const users = allUsers();
  const idx = users.findIndex((u) => String(u.id) === String(id));

  if (idx === -1) return null;

  users[idx] = { ...users[idx], ...data };
  writeJSON(FILE, users);

  return users[idx];
}

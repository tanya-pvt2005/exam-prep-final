// import { db } from "../config/db.js";

// // ====================== GET ALL NOTES ======================
// export async function allNotes() {
//   const [rows] = await db.query("SELECT * FROM notes ORDER BY id DESC");
//   return rows;
// }

// // ====================== FIND ONE NOTE ======================
// export async function findNote(id) {
//   const [rows] = await db.query("SELECT * FROM notes WHERE id = ?", [id]);
//   return rows[0] || null;
// }

// // ====================== CREATE NOTE ======================
// export async function createNote({ title, content, createdBy }) {
//   const [result] = await db.query(
//     "INSERT INTO notes (title, content, createdBy) VALUES (?, ?, ?)",
//     [title, content, createdBy]
//   );

//   return {
//     id: result.insertId,
//     title,
//     content,
//     createdBy,
//   };
// }

// // ====================== DELETE NOTE ======================
// export async function deleteNote(id) {
//   const [result] = await db.query("DELETE FROM notes WHERE id = ?", [id]);
//   return result.affectedRows > 0;
// }

// // ====================== UPDATE NOTE ======================
// export async function updateNote(id, { title, content }) {
//   const [result] = await db.query(
//     "UPDATE notes SET title = ?, content = ? WHERE id = ?",
//     [title, content, id]
//   );

//   return result.affectedRows > 0;
// }


import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ====================== GET ALL NOTES ======================
export async function allNotes() {
  return await prisma.note.findMany({
    orderBy: { id: "desc" }
  });
}

// ====================== FIND ONE NOTE ======================
export async function findNote(id) {
  return await prisma.note.findUnique({
    where: { id: Number(id) }
  });
}

// ====================== CREATE NOTE ======================
export async function createNote({ title, content, createdBy }) {
  return await prisma.note.create({
    data: {
      title,
      content,
      createdBy: createdBy ? Number(createdBy) : null
    }
  });
}

// ====================== DELETE NOTE ======================
export async function deleteNote(id) {
  await prisma.note.delete({
    where: { id: Number(id) }
  });
  return true;
}

// ====================== UPDATE NOTE ======================
export async function updateNote(id, { title, content }) {
  return await prisma.note.update({
    where: { id: Number(id) },
    data: { title, content }
  });
}

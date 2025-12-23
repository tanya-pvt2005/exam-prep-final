import express from "express";
// import auth from "../middleware/authMiddleware.js";
// import admin from "../middleware/adminMiddleware.js";

import {
  generateSummary,
  getAll,
  getOne,
  create,
  update,
  remove
} from "../controllers/notesController.js";

const router = express.Router();

// ⭐ AI Summary route MUST be before /:id
router.post("/:id/summary", generateSummary);

// Get all notes
router.get("/", getAll);

// Get one note
router.get("/:id", getOne);

// Admin: Create note

router.post("/",  create);

// Admin: Update note
router.put("/:id",  update);

// Admin: Delete note
router.delete("/:id",  remove);



export default router;

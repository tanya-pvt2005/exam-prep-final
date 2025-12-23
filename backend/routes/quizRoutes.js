import express from "express";
import { list, get, submit } from "../controllers/quizController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", list);
router.get("/:id", get);
router.post("/:id/submit", auth, submit);

export default router;

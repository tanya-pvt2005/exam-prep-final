import express from 'express';
import * as quizController from '../controller/quizController.js';

const router = express.Router();

// Create a new quiz
router.post('/', quizController.createQuiz);

// Get all quizzes for the user
router.get('/', quizController.getAllQuizzes);

// Get quiz results
router.get('/results', quizController.getQuizResults);

// Get a single quiz by ID
router.get('/:id', quizController.getQuizById);

// Submit quiz answers
router.post('/:id/submit', quizController.submitQuiz);

// Update a quiz by ID
router.put('/:id', quizController.updateQuiz);

// Delete a quiz by ID
router.delete('/:id', quizController.deleteQuiz);

export default router;
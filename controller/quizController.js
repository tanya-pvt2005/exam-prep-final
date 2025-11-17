import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new quiz
export const createQuiz = async (req, res) => {
    try {
        const { title, questions } = req.body;
        const userId = req.user.id;

        if (!title || !questions || questions.length === 0) {
            return res.status(400).json({ error: 'Title and questions are required' });
        }

        // Create quiz with questions
        const newQuiz = await prisma.quiz.create({
            data: {
                title,
                userId: parseInt(userId),
                questions: {
                    create: questions.map(q => ({
                        question: q.question,
                        optionA: q.optionA,
                        optionB: q.optionB,
                        optionC: q.optionC,
                        optionD: q.optionD,
                        correct: q.correct,
                    })),
                },
            },
            include: {
                questions: true,
            },
        });

        res.status(201).json(newQuiz);
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all quizzes for a specific user
export const getAllQuizzes = async (req, res) => {
    try {
        const userId = req.user.id;

        const quizzes = await prisma.quiz.findMany({
            where: {
                userId: parseInt(userId),
            },
            include: {
                questions: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.status(200).json(quizzes);
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get a single quiz by ID
export const getQuizById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const quiz = await prisma.quiz.findFirst({
            where: {
                id: parseInt(id),
                userId: parseInt(userId),
            },
            include: {
                questions: true,
            },
        });

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        res.status(200).json(quiz);
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a quiz
export const updateQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, questions } = req.body;
        const userId = req.user.id;

        // Verify ownership
        const quiz = await prisma.quiz.findFirst({
            where: {
                id: parseInt(id),
                userId: parseInt(userId),
            },
        });

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found or you do not have permission to update it' });
        }

        // Delete old questions and create new ones
        if (questions && questions.length > 0) {
            await prisma.question.deleteMany({
                where: { quizId: parseInt(id) },
            });
        }

        const updatedQuiz = await prisma.quiz.update({
            where: { id: parseInt(id) },
            data: {
                title,
                ...(questions && questions.length > 0 && {
                    questions: {
                        create: questions.map(q => ({
                            question: q.question,
                            optionA: q.optionA,
                            optionB: q.optionB,
                            optionC: q.optionC,
                            optionD: q.optionD,
                            correct: q.correct,
                        })),
                    },
                }),
            },
            include: {
                questions: true,
            },
        });

        res.status(200).json(updatedQuiz);
    } catch (error) {
        console.error('Error updating quiz:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a quiz
export const deleteQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Verify ownership
        const quiz = await prisma.quiz.findFirst({
            where: {
                id: parseInt(id),
                userId: parseInt(userId),
            },
        });

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found or you do not have permission to delete it' });
        }

        // Delete questions first (cascading)
        await prisma.question.deleteMany({
            where: { quizId: parseInt(id) },
        });

        // Delete quiz results
        await prisma.quizResult.deleteMany({
            where: { quizId: parseInt(id) },
        });

        // Delete quiz
        await prisma.quiz.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Submit quiz answers and get result
export const submitQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const { answers } = req.body; // answers should be an object { questionId: selectedAnswer }
        const userId = req.user.id;

        // Verify quiz exists and belongs to user
        const quiz = await prisma.quiz.findFirst({
            where: {
                id: parseInt(id),
            },
            include: {
                questions: true,
            },
        });

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        // Calculate score
        let score = 0;
        const totalQuestions = quiz.questions.length;

        quiz.questions.forEach(question => {
            if (answers[question.id] === question.correct) {
                score++;
            }
        });

        // Save quiz result
        const result = await prisma.quizResult.create({
            data: {
                userId: parseInt(userId),
                quizId: parseInt(id),
                score,
                totalQuestions,
                answers: JSON.stringify(answers),
            },
        });

        res.status(201).json({
            message: 'Quiz submitted successfully',
            score,
            totalQuestions,
            percentage: Math.round((score / totalQuestions) * 100),
            result,
        });
    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get quiz results for user
export const getQuizResults = async (req, res) => {
    try {
        const userId = req.user.id;
        const { quizId } = req.query;

        const results = await prisma.quizResult.findMany({
            where: {
                userId: parseInt(userId),
                ...(quizId && { quizId: parseInt(quizId) }),
            },
            include: {
                quiz: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching quiz results:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
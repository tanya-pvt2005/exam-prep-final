import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env before anything else
dotenv.config();
import { PrismaClient } from '@prisma/client';
import authRoute from './routes/authRoute.js';
import topicRoute from './routes/topicRoute.js';
import quizRoute from './routes/quizRoute.js';
import authMiddleware from './middleware/authMiddleware.js';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Simple request logger to help debug incoming requests (method, url, and body limited)
app.use((req, res, next) => {
    try {
        const safeBody = typeof req.body === 'object' ? JSON.stringify(req.body) : String(req.body);
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - body: ${safeBody}`);
    } catch (e) {
        console.log('Failed to log request body', e);
    }
    next();
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ message: 'ExamPrep App Backend is running!' });
});

// Routes
app.use('/api/auth', authRoute);
app.use('/api/topics', authMiddleware, topicRoute);
app.use('/api/quizzes', authMiddleware, quizRoute);

// Error handling middleware
// Better error handler: respect error status when available (e.g. body-parser JSON errors)
app.use((err, req, res, next) => {
    console.error(err);

    // If the error already has an HTTP status (body-parser sets 400 for JSON parse errors), use it.
    const status = err && err.status ? err.status : 500;

    // If the error is safe to expose (body-parser marks parse errors with expose=true), send the message.
    const message = err && err.expose ? (err.message || 'Bad request') : (status === 500 ? 'Internal server error' : (err.message || 'Error'));

    res.status(status).json({ error: message });
});

// Server start
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
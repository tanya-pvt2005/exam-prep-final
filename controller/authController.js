import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// User Registration
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(409).json({ error: 'User with this email already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        // Generate a JWT token
        const token = jwt.sign(
            { id: newUser.id },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully!',
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Something went wrong during registration.' });
    }
};

// User Login
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find the user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Compare the provided password with the stored hash
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Logged in successfully!',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Something went wrong during login.' });
    }
};

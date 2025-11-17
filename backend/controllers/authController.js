import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


const secret = process.env.JWT_SECRET || "4cf813c59d0108814c0596e9ef78033d5bb514d2642a64e66ca61a7b17344f3f";
const ADMIN_KEY = process.env.ADMIN_KEY || "admin123";

// ====================== REGISTER ======================
export const register = async (req, res) => {
  try {
    const { name, email, password, adminKey } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: adminKey === ADMIN_KEY ? "admin" : "user"
      }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: "7d" }
    );

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// ====================== USER LOGIN ======================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user in DB
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: "7d" }
    );

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

// ====================== ADMIN LOGIN ======================
export const adminLogin = async (req, res) => {
  try {
    const { email, password, adminKey } = req.body;

    if (adminKey !== ADMIN_KEY)
      return res.status(401).json({ message: "Invalid admin key" });

    // Find admin user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.role !== "admin")
      return res.status(400).json({ message: "Admin not found" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: "7d" }
    );

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (err) {
    console.error("Admin Login Error:", err);
    res.status(500).json({ message: "Admin login failed" });
  }
};

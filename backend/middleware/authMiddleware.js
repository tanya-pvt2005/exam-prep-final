import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "4cf813c59d0108814c0596e9ef78033d5bb514d2642a64e66ca61a7b17344f3f";

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

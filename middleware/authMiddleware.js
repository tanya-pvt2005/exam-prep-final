import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ error: 'Authentication failed: No token provided.' });
        }

        const token = authHeader.split(' ')[1]; // "Bearer TOKEN"
        if (!token) {
            return res.status(401).json({ error: 'Authentication failed: Invalid token format.' });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        req.user = { id: decodedToken.id };
        next();
    } catch (error) {
        console.error('Authentication Error:', error);
        res.status(401).json({ error: 'Authentication failed: Invalid token.' });
    }
};

export default authMiddleware;

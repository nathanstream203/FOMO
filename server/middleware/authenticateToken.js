import { verifyToken } from "../utils/auth.js";

export async function authenticateToken(req, res, next) {
    try {

        // Skips the login routes
        if(req.path === '/auth') {
            return next();
        } 
        if (req.method === "POST" && req.originalUrl === "/user") {
            return next();
        }

        const header = req.headers.authorization;
        if(!header) { return res.status(401).json({ error: "Not authorized" })};

        const token = header.split(" ")[1];
        const decoded = verifyToken(token);

        if (decoded.type !== "access") {
            return res.status(403).json({ error: "Invalid token type" });
        }

        req.user = decoded;

        next();
    } catch (err) {
        res.status(401).json({ error: "Token invalid or expired" });
    }
}
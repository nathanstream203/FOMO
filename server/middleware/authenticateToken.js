import { verifyToken } from "../utils/auth";

export async function authenticateToken(req, res, next) {
    try {
        const header = req.header.authorization;
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
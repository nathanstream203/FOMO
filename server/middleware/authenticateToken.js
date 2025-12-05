import { verifyToken } from "../utils/auth.js";

export async function authenticateToken(req, res, next) {
    try {

        // Skips the login routes
        if(req.path === '/auth') {
            return next();
        }

<<<<<<< HEAD
        const header = req.header.authorization;
        if(!header) { 
            console.log(header);
            return res.status(401).json({ error: "Not authorized" })};
=======
        const header = req.headers.authorization;
        if(!header) { return res.status(401).json({ error: "Not authorized" })};
>>>>>>> 7d83b44601b250d0caf4e859c01ad9320de52ad1

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
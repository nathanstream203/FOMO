import jwt from "jsonwebtoken";

export function createToken(firebase_id) {
    return jwt.sign(
        { firebase_id, type: "access" },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
    )
}

export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}
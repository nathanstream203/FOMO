import jwt from "jsonwebtoken";

export function createToken(firebase_id) {
    return jwt.sign(
        { firebase_id, type: "access" },
        process.env.JWT_SECRET,
        { expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION}s` } // 15 minutes default
    )
}

export function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}
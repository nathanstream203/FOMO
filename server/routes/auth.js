import express from "express";
import prisma from "../prisma_export.js";
import { createToken, verifyToken } from "../utils/auth.js";
import { verifyFirebaseToken } from "../utils/firebase.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { firebase_token } = req.body;
    if (!firebase_token) {
      return res.status(400).json({ error: "Token required" });
    }

    console.warn("Decoding Firebase Token"); // DEBUG
    const decoded = await verifyFirebaseToken(firebase_token);
    console.log("Decoded Firebase Token:", decoded); // DEBUG

    console.warn("Finding user in DB"); // DEBUG
    const user = await prisma.user.findUnique({
      where: { firebase_id: decoded.uid },
    });
    console.log("User found in DB:", user); // DEBUG

    console.warn("Creating JWT Token"); // DEBUG
    const token = createToken(user.firebase_id);
    console.log("Created JWT Token:", token); // DEBUG

    return res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({
        valid: false,
        error: "Not authorized",
      });
    }

    const token = header.split(" ")[1];
    const decoded = verifyToken(token); // If verification fails, it will throw an error and be caught below

    if (decoded.type !== "access") {
      return res.status(403).json({
        valid: false,
        error: "Invalid token",
      });
    }

    return res.json({
      valid: true,
      message: "Token is valid",
      firebase_id: decoded.firebase_id,
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        valid: false,
        error: "Token expired",
        expiredAt: err.expiredAt,
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        valid: false,
        error: "Token invalid",
      });
    }
  }
});

export default router;

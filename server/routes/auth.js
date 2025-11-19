import express from "express";
import prisma from "../prisma_export.js";
import { createToken, verifyToken } from "../utils/auth.js";
import { verifyFirebaseToken } from "../utils/firebase.js";

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        const { firebase_token } = req.body;
        if(!firebase_token) { 
            return res.status(400).json({ error: "Token required"});
        }

        const decoded = await verifyFirebaseToken(firebase_token);

        const user = await prisma.user.findUnique({
            where: { firebase_id: decoded.uid }
        });

        const token = createToken(user.firebase_id);

        return res.json({
            message: "Login successful",
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
})

export default router;
import express from "express";
import prisma from "../prisma.js";

const router = express.Router();

router.get('/', async (req, res) => {
    const users = await prisma.users.findMany();
    res.json(users);
});

router.post('/', async (req, res) => {
    const { role_id } = req.body;
    const user = await prisma.user.create({ data: { role_id } });
    res.status(201).json(user);
});

export default router;
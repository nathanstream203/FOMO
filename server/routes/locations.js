import express from 'express';
import prisma from "../prisma.js";

const router = express.Router();

router.get('/', async (req, res) => {
    const roles = await prisma.roles.findMany();
    res.json(roles);
});
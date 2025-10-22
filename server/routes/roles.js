import express from 'express';
import prisma from "../prisma.js";

const router = express.Router();

router.get('/', async (req, res) => {
    const roles = await prisma.roles.findMany();
    res.json(roles);
});

router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;
        if(!name) {
            res.json({'Error': 'Bad request'}).status(401);
            return;
        }
        const role = await prisma.roles.create({ data: { name, description } });
        res.json(role).status(201);
    } catch (error) {
        res.json({'Error': `${error}`});
    }
});

export default router;
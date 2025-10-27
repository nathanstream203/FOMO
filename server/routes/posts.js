import express from 'express';
import prisma from "../prisma.js";

const router = express.Router();

router.get('/', async (req, res) => {
    const roles = await prisma.posts.findMany();
    res.json(roles);
});

router.post('/', async (req, res) => {
    try {
         const { user_id, bar_id, content, timestamp } = req.body;
        if(!user_id || !bar_id || !content || !timestamp) {
            res.json({'Error': 'Bad request'}).status(401);
            return;
        }
        const user = await prisma.users.create({ data: { user_id, bar_id, content, timestamp} });
        res.json(user).status(201);
    } catch (error) {
        res.json({'Error': `${error}`});
    }
});

export default router;
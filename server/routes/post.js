import express from 'express';
import prisma from "../prisma_export.js";

const router = express.Router();

router.get('/', async (req, res) => {
    const posts = await prisma.post.findMany();
    res.json(posts);
});

router.get('/:bar_id', async (req, res) => {
    const post = await prisma.post.findMany({
        where: bar_id = Number(req.params.bar_id)
    })
});

router.post('/', async (req, res) => {
    try {
        const { user_id, bar_id, content, timestamp } = req.body;
        if(!user_id || !bar_id || !content || !timestamp) {
            res.json({'Error': 'Bad request'}).status(401);
            return;
        }
        const post = await prisma.post.create({ data: { user_id, bar_id, content, timestamp} });
        res.json(post).status(201);
    } catch (error) {
        res.json({'Error': `${error}`});
    }
});

export default router;
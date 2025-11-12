import express from 'express';
import prisma from "../prisma_export.js";

const router = express.Router()

router.get('/:id', async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            id: Number(req.params.id)
        }
    })
    res.json(user.points);
});

export default router;
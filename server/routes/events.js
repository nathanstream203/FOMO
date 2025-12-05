import express from 'express';
import prisma from "../prisma_export.js";

const router = express.Router();

router.get('/', async (requestAnimationFrame, res) => {
    const events = await prisma.event.findMany();
    res.json(events);
});

router.get('/:bar_id', async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            where: { bar_id: Number(req.params.bar_id)}
        });
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const {bar_id, title, description, event_date, start_time, end_time } = req.body;

        if (!bar_id || !title || !event_date || !start_time ||!end_time){
            return res.status(400).json({ Error: "Missing required fields" })
        }

        const newEvent = await prisma.event.create({
            data: { bar_id, title, description, event_date, start_time, end_time }
        });

        res.status(201).json(newEvent);
    } catch (error) {
        res.json({ Error: '${errlr}' });
    }
});

export default router;
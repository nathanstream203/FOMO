import express from 'express';
import prisma from "../prisma_export.js";

const router = express.Router();

router.get('/', async (req, res) => {
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
            console.log("Missing required fields : ", req.body);
            return res.status(400).json({ Error: "Missing required fields" })
        }

        console.log("Creating event with data:", {
            bar_id,
            title,
            description,
            event_date,
            start_time,
            end_time
        });

        const newEvent = await prisma.event.create({
            data: {
                bar_id,
                title,
                description,
                event_date,
                start_time: new Date(),
                end_time: new Date(),
            }
        });

        console.log("Event created:", newEvent);

        return res.status(201).json(newEvent);

    } catch (error) {
        console.error("Prisma error:", error);
        return res.status(500).json({ error: error.message });

    }
});

export default router;
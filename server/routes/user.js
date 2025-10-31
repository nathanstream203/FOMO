import express from "express";
import prisma from "../prisma_export.js";

const router = express.Router();

router.get('/', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

router.post('/', async (req, res) => {
    try {
         const { firebase_id, first_name, last_name, birth_date, role_id } = req.body;
        if(!firebase_id || !first_name || !last_name || !birth_date || !role_id) {
            res.json({'Error': 'Bad request'}).status(401);
            return;
        }
        const user = await prisma.user.create({ data: { firebase_id, first_name, last_name, birth_date, role_id } });
        res.json(user).status(201);
    } catch (error) {
        res.json({'Error': `${error}`});
    }
});

export default router;
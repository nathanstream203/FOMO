import express from 'express';
import prisma from "../prisma.js";

const router = express.Router();

router.get('/bars', async (req, res) => {
    try{
        const bars = await prisma.bar.findMany();
        res.json(bars).status(200);
    } catch(e){
        res.json({'Error': e}).status(500)
    }
});

router.get('/parties', async (req, res) => {
    try{
        const parties = await prisma.party.findMany();
        res.json(parties).status(200);
    }catch(e){
        res.json({'Error': e}).status(500);
    }
});

router.post('/bars', async (req, res) => {
    try{
        const data = req.body;
        if(!data.name || !data.address || !data.longitude || !data.latitude){
            res.json({'Error': 'Bad Input'}).status(400);
            return;
        }
        const newBar = await prisma.bar.create({
            data: {
                name: data.name,
                address: data.address,
                longitude: data.longitude,
                latitude: data.latitude
            }
        });
        res.json(newBar).status(200);
    }catch(e){
        res.json({'Error': e}).status(500)
    }
});

router.post('/parties', async (req, res) => {
    try{
        res.json({'Error': 'Route Incomplete'}).status(400);
    }catch(e){
        res.json({'Error': e}).status(500)
    }
});

export default router;
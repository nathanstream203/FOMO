import express from 'express';
import prisma from "../prisma_export.js";
import { Friend_Status } from '@prisma/client';

const router = express.Router();

// GET current friends of a user by id
router.get('/', async (req, res) => {
    try{
        const user = req.body;
        const friends = await prisma.friends.findMany({
            where: {
                status: Friend_Status.ACCEPTED,
                OR: [
                    {requestor_id: Number(user.id)},
                    {reciever_id: Number(user.id)}
                ]
            }
        });
        res.status(200).json(friends);
    }catch(e){
        res.status(500).json({'Error': e});
    }
});

// GET pending requests the user has recieved
// Expects:
// {id: (user id)}
router.get('/requests', async (req, res) => {
    try{
        const user = req.body;
        const friendRequests = await prisma.friends.findMany({
            where: {
                status: Friend_Status.PENDING,
                reciever_id: Number(user.id)
            }
        });
        res.json(friendRequests).status(200);
    }catch(e){
        res.json({'Error': e}).status(500);
    }
});

// create a friend request 
router.post('/new', async (req, res) => {
  try {
    const { requestor_id, reciever_id } = req.body;

    //validation
    if (!requestor_id || !reciever_id) {
      return res.status(400).json({ error: 'requestor_id and reciever_id required' });
    }

    // check for self-request
    if (requestor_id === reciever_id) {
      return res.status(400).json({ error: 'Friend request is made to self' });
    }

    const newFriendRequest = await prisma.friends.create({
      data: { requestor_id, reciever_id,},
    });
    return res.status(201).json(newFriendRequest);

  } catch (e) {
    // detect duplicates
    if (e.code === 'P2002') { //this can be changes based on prisma error codes
      return res.status(409).json({ error: 'Friend request already exists' });
    }

    console.error(e);
    return res.status(500).json({ error: 'Route error.' });
  }
});

export default router;
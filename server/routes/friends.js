import express from 'express';
import prisma from "../prisma_export.js";
import { friend_status } from '@prisma/client';

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

// accept a friend request
// ACCEPT a friend request using two user IDs
router.post('/accept', async (req, res) => {
  try {
    const { requestor_id, reciever_id } = req.body;

    if (!requestor_id || !reciever_id) {
      return res.status(400).json({ error: 'requestor_id and reciever_id are required.' });
    }

    // find the friendship in req/res or res/req direction
    const friendship = await prisma.friends.findFirst({
      where: {
        status: Friend_Status.PENDING,
        OR: [{ requestor_id, reciever_id}, { reciever_id, requestor_id }]
      }
    });

    if (!friendship) {
      return res.status(404).json({ error: 'Friend request does not exist' });
    }

    const updated = await prisma.friends.update({
      where: { id: friendship.id },
      data: { status: Friend_Status.ACCEPTED }
    });

    return res.status(200).json(updated);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error accepting friend request.' });
  }
});


// remove a friend or decline a request
router.delete('/remove', async (req, res) => {
  try {
    const { requestor_id, reciever_id } = req.body;

    if (!requestor_id || !reciever_id) {
      return res.status(400).json({ error: 'requestor_id and reciever_id are required.' });
    }

    // delete regardless of direction
    const deleted = await prisma.friends.deleteMany({
      where: {
        OR: [{ requestor_id, reciever_id }, { reciever_id, requestor_id }]
      }
    });

    if (deleted.count === 0) {
      return res.status(404).json({ error: 'No friendship found' });
    }

    return res.status(200).json({ message: 'Friendship removed' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error removing friendship' });
  }
});

export default router;
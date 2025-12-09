import express from "express";
import prisma from "../prisma_export.js";
import { friend_status } from "@prisma/client";

const router = express.Router();

// GET current friends of a user
// EXPECTS: Query parameter {id: (user id)} -> req.query.id


router.get('/', async (req, res) => {
    try{
        // CHANGE: Get 'id' from req.query instead of req.body
        const userId = req.query.id; 
        
        if (!userId) {
            return res.status(400).json({ 'Error': 'User ID is required' });
        }

        const friends = await prisma.friends.findMany({
            where: {
                status: Friend_Status.ACCEPTED,
                OR: [
                    {requestor_id: Number(userId)},
                    {reciever_id: Number(userId)}
                ]
            }
        });
        res.status(200).json(friends);
    }catch(e){
        console.error("Error fetching friends list:", e);
        res.status(500).json({'Error': e.message || e});
    }
});

// GET pending requests the user has recieved
// EXPECTS: Query parameter {id: (user id)} -> req.query.id
router.get('/requests', async (req, res) => {
    try{
        //CHANGE: Get 'id' from req.query instead of req.body
        const userId = req.query.id;

        if (!userId) {
            return res.status(400).json({ 'Error': 'User ID is required' });
        }

        const friendRequests = await prisma.friends.findMany({
            where: {
                status: Friend_Status.PENDING,
                reciever_id: Number(userId)
            }
        });
        res.status(200).json(friendRequests);
    }catch(e){
        console.error("Error fetching friend requests:", e);
        res.status(500).json({'Error': e.message || e});
    }
});


// create a friend request 
// EXPECTS: JSON body {requestor_id: number, reciever_id: number} -> req.body
router.post('/new', async (req, res) => {
    try {
        const data = req.body;
        // Basic check for existing/pending request
        const existing = await prisma.friends.findFirst({
             where: {
                OR: [
                    { requestor_id: data.requestor_id, reciever_id: data.reciever_id },
                    { requestor_id: data.reciever_id, reciever_id: data.requestor_id }
                ]
            }
        });

        if (existing) {
             // Added check for existing relationship/request
             return res.status(409).json({'Error': 'Friend request already exists or users are already friends.'});
        }


        const newFriendRequest = await prisma.friends.create({
            data: {
                requestor_id: Number(data.requestor_id),
                reciever_id: Number(data.reciever_id)
            }
        });
        res.status(200).json(newFriendRequest);
    }catch(e){
        // Log the error for debugging
        console.error("Error creating friend request:", e); 
        // Better error handling for database issues (like foreign key constraint violations)
        if (e.code === 'P2003') { // Prisma Foreign Key Constraint error code
            return res.status(404).json({'Error': 'One of the user IDs does not exist.'});
        }
        res.status(500).json({'Error': e.message || e});
    }

    const updated = await prisma.friends.update({
      where: { id: friendship.id },
      data: { status: Friend_Status.ACCEPTED },
    });

    return res.status(200).json(updated);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error accepting friend request' });
  }
});

// remove a friend or decline a request
router.delete("/remove", async (req, res) => {
  try {
    const { requestor_id, reciever_id } = req.body;

    if (!requestor_id || !reciever_id) {
      return res.status(400).json({ error: 'requestor_id and reciever_id are required' });
    }

    // delete either direction
    const deleted = await prisma.friends.deleteMany({
      where: {
        OR: [
          { requestor_id, reciever_id },
          { reciever_id, requestor_id },
        ],
      },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ error: "No friendship found" });
    }

    return res.status(200).json({ message: "Friendship removed" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error removing friendship" });
  }
});

export default router;

import express from "express";
import prisma from "../prisma_export.js";
import pkg from "@prisma/client";
const { Friend_Status } = pkg;
const router = express.Router();

// GET current friends of a user
// Expects:
// {id: (user id)}
router.get("/", async (req, res) => {
  try {
    const user = req.body;
    const friends = await prisma.friends.findMany({
      where: {
        status: Friend_Status.ACCEPTED,
        OR: [
          { requestor_id: Number(user.id) },
          { reciever_id: Number(user.id) },
        ],
      },
    });
    res.json(friends).status(200);
  } catch (e) {
    res.json({ Error: e }).status(500);
  }
});

// GET pending requests the user has recieved
// Expects:
// {id: (user id)}
router.get("/requests", async (req, res) => {
  try {
    const user = req.body;
    const friendRequests = await prisma.friends.findMany({
      where: {
        status: Friend_Status.PENDING,
        reciever_id: Number(user.id),
      },
    });
    res.json(friendRequests).status(200);
  } catch (e) {
    res.json({ Error: e }).status(500);
  }
});

// create a friend request
router.post("/new", async (req, res) => {
  try {
    const data = req.body;
    const newFriendRequest = await prisma.friends.create({
      data: {
        requestor_id: data.requestor_id,
        reciever_id: data.reciever_id,
      },
    });
    res.json(newFriendRequest).status(200);
  } catch (e) {
    res.json({ Error: e }).status(500);
  }
});

export default router;

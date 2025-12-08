import express from "express";
import prisma from "../prisma_export.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await prisma.post.findMany();
  res.json(posts);
});

// Get posts by bar
router.get("/:bar_id", async (req, res) => {
  const barPost = await prisma.post.findUnique({
    where: {
      bar_id: Number(req.params.bar_id),
    },
  });
  res.json(barPost);
});

// Get posts by party
router.get("/:party_id", async (req, res) => {
  const partyPost = await prisma.post.findUnique({
    where: {
      bar_id: Number(req.params.party_id),
    },
  });
  res.json(partyPost);
});

router.post("/", async (req, res) => {
  try {
    const { user_id, bar_id, party_id, content, timestamp } = req.body;

    if (!user_id || !content || !timestamp || (!bar_id && !party_id)) {
      res.status(400).json({ error: "Bad request: missing required fields" });
      return;
    }

    const post = await prisma.post.create({
      data: {
        user_id,
        content,
        timestamp,
        bar_id: bar_id ?? null, // only fill if present
        party_id: party_id ?? null, // only fill if present
      },
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("Failed to create post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

export default router;

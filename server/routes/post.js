import express from "express";
import prisma from "../prisma_export.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await prisma.post.findMany();
  res.json(posts);
});

router.get("/:bar_id", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        bar_id: Number(req.params.bar_id),
        party_id: null, // ← SUPER IMPORTANT
      },
      orderBy: { timestamp: "desc" },
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:party_id", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        party_id: Number(req.params.party_id),
        bar_id: null, // exclude bar posts
      },
      orderBy: { timestamp: "desc" },
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

import express from "express";
import prisma from "../prisma_export.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await prisma.post.findMany();
  res.json(posts);
});

// Get posts by bar
router.get("/:id", async (req, res) => {
  const barPost = await prisma.post.findUnique({
    where: {
      bar_id: Number(req.params.bar_id),
    },
  });
  res.json(barPost);
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

router.delete("/:id", async (req, res) => {
  try {
    const postId = Number(req.params.id);
    if (isNaN(postId))
      return res.status(400).json({ error: "Invalid post ID" });

    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ error: "Missing user_id" });

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.user_id !== user_id)
      return res.status(403).json({ error: "Not authorized" });

    await prisma.post.delete({ where: { id: postId } });
    res.json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

export default router;

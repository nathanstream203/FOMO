import express from "express";
import prisma from "../prisma_export.js";

const router = express.Router();

router.get("/bar", async (req, res) => {
  try {
    const bars = await prisma.bar.findMany();
    res.json(bars).status(200);
  } catch (e) {
    res.json({ Error: e }).status(500);
  }
});

router.get("/party", async (req, res) => {
  try {
    const parties = await prisma.party.findMany();
    res.json(parties).status(200);
  } catch (e) {
    res.json({ Error: e }).status(500);
  }
});

router.post("/bar", async (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.address || !data.longitude || !data.latitude) {
      res.json({ Error: "Bad Input" }).status(400);
      return;
    }
    const newBar = await prisma.bar.create({
      data: {
        name: data.name,
        address: data.address,
        longitude: data.longitude,
        latitude: data.latitude,
      },
    });
    res.json(newBar).status(200);
  } catch (e) {
    res.json({ Error: e }).status(500);
  }
});

router.post("/party", async (req, res) => {
  try {
    const data = req.body;

    // Validate required fields
    if (
      !data.name ||
      !data.description ||
      !data.address ||
      !data.start_time ||
      !data.end_time ||
      !data.user_id ||
      data.longitude === undefined ||
      data.latitude === undefined
    ) {
      res.status(400).json({ Error: "Bad Input - Missing required fields" });
      return;
    }

    // Create new party in database
    const newParty = await prisma.party.create({
      data: {
        name: data.name,
        description: data.description,
        address: data.address,
        start_time: data.start_time,
        end_time: data.end_time,
        user_id: data.user_id,
        longitude: data.longitude,
        latitude: data.latitude,
      },
    });

    res.status(200).json(newParty);
  } catch (e) {
    console.error("Error creating party:", e);
    res.status(500).json({ Error: e.message });
  }
});

export default router;

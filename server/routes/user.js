import express from "express";
import prisma from "../prisma_export.js";

const router = express.Router();

router.get('/', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

router.get('/:id', async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { 
            id: Number(req.params.id)
         }
    });
    res.json(user);
});


router.post('/', async (req, res) => {
    try {
        const { firebase_id, first_name, last_name, birth_date, points, role } = req.body;
        console.log("Received data:", { firebase_id, first_name, last_name, birth_date, points, role });
        if(!firebase_id || !first_name || !last_name || !birth_date) {
            res.status(401).json({'Error': 'Bad request. Missing required fields.'});
            return;
        }
        const user = await prisma.user.create({ data: { firebase_id, first_name, last_name, birth_date, points, role } });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({'Error': `${error}`});
    }
});

router.put('/', async (req, res) => {
  try {
    const { firebase_id, first_name, last_name, birth_date } = req.body;

    if (!firebase_id) {
      res.json({ Error: "firebase_id is required" }).status(400);
      return;
    }

    // using updateMany to handle update == 0 without throwing the error to catch
    const updatedUser = await prisma.user.updateMany({ 
      where: { firebase_id },
      data: {
        // Only include fields that are provided -> Partial updates accepted
        ...(first_name && { first_name }), 
        ...(last_name && { last_name }),
        ...(birth_date && { birth_date })
      }
    });

    // If no records were updated, the user was not found
    if (updatedUser.count === 0) {
      res.json({ Error: "User not found" }).status(404);
      return;
    }

    res.json({ message: "User updated successfully" });
    return;

  } catch (error) {
    console.error(error);
    return res.json({ Error: String(error) }).status(500);
  }
});

export default router;
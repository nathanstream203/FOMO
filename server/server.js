import cors from 'cors';
import express from "express";

import locationRouter from './routes/location.js';
import postRouter from './routes/post.js';
import userRouter from './routes/user.js';
import pointsRouter from './routes/points.js'
import authRouter from './routes/auth.js'

import { authenticateToken } from './middleware/authenticateToken.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', authenticateToken);
app.use('/user', userRouter);
app.use('/location', locationRouter);
app.use('/post', postRouter);
app.use('/points', pointsRouter);
app.use('/auth', authRouter);

// Default route
app.get('/', (req,res) => {
    res.json({'message': 'Hello from the backend!'});
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

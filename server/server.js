import cors from 'cors';
import express from "express";

import locationRouter from './routes/location.js';
import postRouter from './routes/post.js';
import roleRouter from './routes/role.js';
import userRouter from './routes/user.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/user', userRouter);
app.use('/role', roleRouter);
app.use('/location', locationRouter);
app.use('/post', postRouter);

// Default route
app.get('/', (req,res) => {
    res.json({'message': 'Hello from the backend!'});
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

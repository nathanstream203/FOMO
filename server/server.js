import cors from 'cors';
import express from "express";

import locationsRouter from './routes/locations.js';
import postsRouter from './routes/posts.js';
import rolesRouter from './routes/roles.js';
import usersRouter from './routes/users.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/users', usersRouter);
app.use('/roles', rolesRouter);
app.use('/locations', locationsRouter);
app.use('/posts', postsRouter);

// Default route
app.get('/', (req,res) => {
    res.json({'message': 'Hello from the backend!'});
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

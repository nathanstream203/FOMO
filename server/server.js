const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Default route
app.get('/', (req,res) => {
    res.json({'message': 'Hello from the backend!'});
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

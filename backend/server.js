// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(
    cors({
        origin: 'https://jessikajorharley.github.io',
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const projectRoutes = require('./routes/projects');
app.use('/api', projectRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

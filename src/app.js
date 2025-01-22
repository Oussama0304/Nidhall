const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/health');

const app = express();

// Middleware de base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes de santé
app.use('/api/health', healthRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
    });
});

module.exports = app;

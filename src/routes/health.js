const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const { dbConfig } = require('../config/database');

router.get('/', async (req, res) => {
    try {
        // Vérifier la connexion à la base de données
        const connection = await mysql.createConnection(dbConfig);
        await connection.ping();
        await connection.end();

        // Vérifier l'utilisation de la mémoire
        const memoryUsage = process.memoryUsage();
        const memoryThreshold = 1024 * 1024 * 1024; // 1GB

        if (memoryUsage.heapUsed > memoryThreshold) {
            throw new Error('Memory usage too high');
        }

        // Vérifier l'espace disque
        const fs = require('fs');
        const { statSync } = require('fs');
        const uploadStats = statSync('/app/uploads');
        const publicStats = statSync('/app/public');

        if (!uploadStats.isDirectory() || !publicStats.isDirectory()) {
            throw new Error('Required directories not accessible');
        }

        res.status(200).json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            memory: {
                heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
                heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
            },
            uptime: process.uptime() + ' seconds'
        });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(503).json({
            status: 'unhealthy',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;

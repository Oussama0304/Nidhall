const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.use(auth);

// Get reclamation trends (last 6 months)
router.get('/trends', async (req, res) => {
    try {
        const query = `
            SELECT 
                DATE_FORMAT(date_creation, '%Y-%m') as month,
                COUNT(*) as total,
                SUM(CASE WHEN etat = 'En cours' THEN 1 ELSE 0 END) as en_cours,
                SUM(CASE WHEN etat = 'Résolu' THEN 1 ELSE 0 END) as resolu
            FROM Reclamation
            WHERE date_creation >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY DATE_FORMAT(date_creation, '%Y-%m')
            ORDER BY month ASC
        `;
        
        const [results] = await db.execute(query);
        res.json(results);
    } catch (error) {
        console.error('Error getting trends:', error);
        res.status(500).json({ error: "Erreur lors de la récupération des tendances" });
    }
});

// Get performance metrics
router.get('/performance', async (req, res) => {
    try {
        const query = `
            SELECT 
                AVG(TIMESTAMPDIFF(HOUR, date_creation, date_resolution)) as avg_resolution_time,
                COUNT(*) as total_reclamations,
                SUM(CASE WHEN etat = 'Résolu' THEN 1 ELSE 0 END) as resolved_reclamations,
                (SUM(CASE WHEN etat = 'Résolu' THEN 1 ELSE 0 END) / COUNT(*)) * 100 as resolution_rate
            FROM Reclamation
            WHERE date_creation >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        `;
        
        const [results] = await db.execute(query);
        res.json(results[0]);
    } catch (error) {
        console.error('Error getting performance metrics:', error);
        res.status(500).json({ error: "Erreur lors de la récupération des métriques de performance" });
    }
});

// Get resolution times by category
router.get('/resolution-times', async (req, res) => {
    try {
        const query = `
            SELECT 
                type,
                AVG(TIMESTAMPDIFF(HOUR, date_creation, date_resolution)) as avg_resolution_time,
                COUNT(*) as total_reclamations
            FROM Reclamation
            WHERE date_creation >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY type
        `;
        
        const [results] = await db.execute(query);
        res.json(results);
    } catch (error) {
        console.error('Error getting resolution times:', error);
        res.status(500).json({ error: "Erreur lors de la récupération des temps de résolution" });
    }
});

module.exports = router;

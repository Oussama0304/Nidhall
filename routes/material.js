const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Get all materials
router.get('/', auth, async (req, res) => {
    try {
        const query = `
            SELECT m.*, s.nom as station_nom
            FROM Material m
            LEFT JOIN StationService s ON m.idStation = s.idStation
            ORDER BY m.Actif
        `;
        
        const [materials] = await db.query(query);
        res.json(materials);
    } catch (err) {
        console.error('Erreur lors de la récupération des matériels:', err);
        res.status(500).json({ error: "Erreur lors de la récupération des matériels", details: err.message });
    }
});

// Get materials by station
router.get('/station/:idStation', auth, async (req, res) => {
    try {
        const { idStation } = req.params;
        const query = `
            SELECT m.*, s.nom as station_nom
            FROM Material m
            LEFT JOIN StationService s ON m.idStation = s.idStation
            WHERE m.idStation = ?
            ORDER BY m.Actif
        `;
        
        const [materials] = await db.query(query, [idStation]);
        res.json(materials);
    } catch (err) {
        console.error('Erreur lors de la récupération des matériels de la station:', err);
        res.status(500).json({ error: "Erreur lors de la récupération des matériels", details: err.message });
    }
});

// Update material status
router.put('/status', auth, async (req, res) => {
    try {
        const { idStation, Actif, status } = req.body;

        if (!idStation || !Actif || !status) {
            return res.status(400).json({ error: "idStation, Actif et status sont requis" });
        }

        await db.execute(
            'UPDATE Material SET status = ? WHERE idStation = ? AND Actif = ?',
            [status, idStation, Actif]
        );

        res.json({ message: "Statut du matériel mis à jour avec succès" });
    } catch (err) {
        console.error('Erreur lors de la mise à jour du statut:', err);
        res.status(500).json({ error: "Erreur lors de la mise à jour du statut", details: err.message });
    }
});

// Add new material
router.post('/', auth, async (req, res) => {
    try {
        const { idStation, Actif, Description, Emplacement, status } = req.body;

        if (!idStation || !Actif) {
            return res.status(400).json({ error: "idStation et Actif sont requis" });
        }

        const query = `
            INSERT INTO Material (idStation, Actif, Description, Emplacement, status)
            VALUES (?, ?, ?, ?, ?)
        `;

        await db.execute(query, [idStation, Actif, Description || null, Emplacement || null, status || 'Actif']);
        res.status(201).json({ message: "Matériel ajouté avec succès" });
    } catch (err) {
        console.error('Erreur lors de l\'ajout du matériel:', err);
        res.status(500).json({ error: "Erreur lors de l\'ajout du matériel", details: err.message });
    }
});

module.exports = router;

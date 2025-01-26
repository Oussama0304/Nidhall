const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all stations
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT s.*, 
                   u.nom as nom_gerant, 
                   u.prenom as prenom_gerant
            FROM StationService s
            LEFT JOIN Utilisateur u ON s.idGerant = u.identifiant
            ORDER BY s.nom
        `;
        
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: "Erreur lors de la récupération des stations" });
    }
});

// Get stations by user
router.get('/user', async (req, res) => {
    try {
        const userId = req.user.userId;
        const userRole = req.user.role;

        let query = `
            SELECT s.*, 
                   u.nom as nom_gerant, 
                   u.prenom as prenom_gerant
            FROM StationService s
            LEFT JOIN Utilisateur u ON s.idGerant = u.identifiant
        `;

        if (userRole === 'GERANT') {
            query += ' WHERE s.idGerant = ?';
        } else if (userRole !== 'ADMIN') {
            return res.status(403).json({ error: "Accès non autorisé" });
        }

        query += ' ORDER BY s.nom';

        const [results] = await db.query(query, [userId]);
        res.json(results);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: "Erreur lors de la récupération des stations" });
    }
});

// Create new station
router.post('/', async (req, res) => {
    try {
        const { nom, adresse, ville, telephone, email, idGerant } = req.body;
        const userRole = req.user.role;

        if (userRole !== 'ADMIN') {
            return res.status(403).json({ error: "Seuls les administrateurs peuvent créer des stations" });
        }

        const query = `
            INSERT INTO StationService (nom, adresse, ville, telephone, email, idGerant)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(query, [nom, adresse, ville, telephone, email, idGerant]);

        // Récupérer la station créée
        const getStationQuery = `
            SELECT s.*, 
                   u.nom as nom_gerant, 
                   u.prenom as prenom_gerant
            FROM StationService s
            LEFT JOIN Utilisateur u ON s.idGerant = u.identifiant
            WHERE s.idStation = ?
        `;

        const [station] = await db.query(getStationQuery, [result.insertId]);

        res.status(201).json({
            message: "Station créée avec succès",
            station: station[0]
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: "Erreur lors de la création de la station" });
    }
});

// Get station by ID
router.get('/:id', async (req, res) => {
    try {
        const query = `
            SELECT s.*, 
                   u.nom as nom_gerant, 
                   u.prenom as prenom_gerant
            FROM StationService s
            LEFT JOIN Utilisateur u ON s.idGerant = u.identifiant
            WHERE s.idStation = ?
        `;

        const [results] = await db.query(query, [req.params.id]);

        if (results.length === 0) {
            return res.status(404).json({ error: "Station non trouvée" });
        }

        res.json(results[0]);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: "Erreur lors de la récupération de la station" });
    }
});

// Update station
router.put('/:id', async (req, res) => {
    try {
        const { nom, adresse, ville, telephone, email, idGerant } = req.body;
        const userRole = req.user.role;

        if (userRole !== 'ADMIN') {
            return res.status(403).json({ error: "Seuls les administrateurs peuvent modifier les stations" });
        }

        const query = `
            UPDATE StationService 
            SET nom = ?, 
                adresse = ?, 
                ville = ?, 
                telephone = ?, 
                email = ?, 
                idGerant = ?
            WHERE idStation = ?
        `;

        const [result] = await db.query(query, [
            nom, adresse, ville, telephone, 
            email, idGerant, req.params.id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Station non trouvée" });
        }

        // Récupérer la station mise à jour
        const getStationQuery = `
            SELECT s.*, 
                   u.nom as nom_gerant, 
                   u.prenom as prenom_gerant
            FROM StationService s
            LEFT JOIN Utilisateur u ON s.idGerant = u.identifiant
            WHERE s.idStation = ?
        `;

        const [station] = await db.query(getStationQuery, [req.params.id]);

        res.json({
            message: "Station mise à jour avec succès",
            station: station[0]
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: "Erreur lors de la mise à jour de la station" });
    }
});

// Delete station
router.delete('/:id', async (req, res) => {
    try {
        const userRole = req.user.role;

        if (userRole !== 'ADMIN') {
            return res.status(403).json({ error: "Seuls les administrateurs peuvent supprimer des stations" });
        }

        const query = 'DELETE FROM StationService WHERE idStation = ?';
        const [result] = await db.query(query, [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Station non trouvée" });
        }

        res.json({ message: "Station supprimée avec succès" });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: "Erreur lors de la suppression de la station" });
    }
});

module.exports = router;

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
            LEFT JOIN Gerant g ON s.idStation = g.idStation
            LEFT JOIN Utilisateur u ON g.idGerant = u.identifiant
            ORDER BY s.nom
        `;
        
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        console.error('Error executing query:', err);
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
            LEFT JOIN Gerant g ON s.idStation = g.idStation
            LEFT JOIN Utilisateur u ON g.idGerant = u.identifiant
        `;

        if (userRole === 'GERANT') {
            query += ' WHERE g.idGerant = ?';
        } else if (userRole !== 'ADMIN') {
            return res.status(403).json({ error: "Accès non autorisé" });
        }

        query += ' ORDER BY s.nom';

        const [stations] = await db.query(query, userRole === 'GERANT' ? [userId] : []);
        res.json(stations);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: "Erreur lors de la récupération des stations" });
    }
});

// Create new station
router.post('/', async (req, res) => {
    try {
        const { nom, adresse, ville, telephone, email } = req.body;
        const userRole = req.user.role;

        if (userRole !== 'ADMIN') {
            return res.status(403).json({ error: "Seul l'administrateur peut créer une station" });
        }

        const query = `
            INSERT INTO StationService (nom, adresse, ville, telephone, email)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(query, [nom, adresse, ville, telephone, email]);

        // Récupérer la station créée
        const getStationQuery = `
            SELECT s.*, 
                   u.nom as nom_gerant, 
                   u.prenom as prenom_gerant
            FROM StationService s
            LEFT JOIN Gerant g ON s.idStation = g.idStation
            LEFT JOIN Utilisateur u ON g.idGerant = u.identifiant
            WHERE s.idStation = ?
        `;

        const [station] = await db.query(getStationQuery, [result.insertId]);
        res.status(201).json(station[0]);
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
            LEFT JOIN Gerant g ON s.idStation = g.idStation
            LEFT JOIN Utilisateur u ON g.idGerant = u.identifiant
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
        const { nom, adresse, ville, telephone, email } = req.body;
        const userRole = req.user.role;

        if (userRole !== 'ADMIN') {
            return res.status(403).json({ error: "Seul l'administrateur peut modifier une station" });
        }

        const updateQuery = `
            UPDATE StationService 
            SET nom = ?, 
                adresse = ?, 
                ville = ?, 
                telephone = ?, 
                email = ?
            WHERE idStation = ?
        `;

        const [result] = await db.query(updateQuery, [
            nom, adresse, ville, telephone, 
            email, req.params.id
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
            LEFT JOIN Gerant g ON s.idStation = g.idStation
            LEFT JOIN Utilisateur u ON g.idGerant = u.identifiant
            WHERE s.idStation = ?
        `;

        const [station] = await db.query(getStationQuery, [req.params.id]);
        res.json(station[0]);
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
            return res.status(403).json({ error: "Seul l'administrateur peut supprimer une station" });
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

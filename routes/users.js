const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Get all users
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT identifiant, nom, prenom, telephone, mail, matricule, roles FROM Utilisateur';
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
    }
});

// Create new user
router.post('/', async (req, res) => {
    try {
        const { nom, prenom, telephone, mail, mot_de_passe, matricule, roles } = req.body;
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
        
        const query = 'INSERT INTO Utilisateur (nom, prenom, telephone, mail, mot_de_passe, matricule, roles) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const [result] = await db.query(query, [nom, prenom, telephone, mail, hashedPassword, matricule, roles]);
        
        res.status(201).json({
            message: "Utilisateur créé avec succès",
            id: result.insertId
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const query = 'SELECT identifiant, nom, prenom, telephone, mail, matricule, roles FROM Utilisateur WHERE identifiant = ?';
        const [results] = await db.query(query, [req.params.id]);
        
        if (results.length === 0) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }
        res.json(results[0]);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: "Erreur lors de la récupération de l'utilisateur" });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    try {
        const { nom, prenom, telephone, mail, matricule, roles } = req.body;
        const query = 'UPDATE Utilisateur SET nom = ?, prenom = ?, telephone = ?, mail = ?, matricule = ?, roles = ? WHERE identifiant = ?';
        const [result] = await db.query(query, [nom, prenom, telephone, mail, matricule, roles, req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }
        res.json({ message: "Utilisateur mis à jour avec succès" });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
    }
});

// Get users by role
router.get('/role/:role', async (req, res) => {
    try {
        const query = 'SELECT identifiant, nom, prenom, telephone, mail, matricule, roles FROM Utilisateur WHERE roles = ?';
        const [results] = await db.query(query, [req.params.role]);
        res.json(results);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
    }
});

// Get user profile (authenticated user)
router.get('/profile', async (req, res) => {
    try {
        // Récupérer l'ID de l'utilisateur depuis le token JWT
        const userId = req.user.id; // Assurez-vous que votre middleware d'authentification ajoute user à req

        const query = 'SELECT identifiant, nom, prenom, telephone, mail, matricule, roles FROM Utilisateur WHERE identifiant = ?';
        const [results] = await db.query(query, [userId]);
        
        if (results.length === 0) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }
        res.json(results[0]);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: "Erreur lors de la récupération du profil" });
    }
});

module.exports = router;

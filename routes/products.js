const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all products
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM Produit';
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: "Erreur lors de la récupération des produits" });
    }
});

// Create new product
router.post('/', async (req, res) => {
    try {
        const { nom, disponibilite, prix, CODPRD, LIBPRD, CODEMB, LIBEMB, TYPPRD } = req.body;
        const query = 'INSERT INTO Produit (nom, disponibilite, prix, CODPRD, LIBPRD, CODEMB, LIBEMB, TYPPRD) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        
        const [result] = await db.query(query, [nom, disponibilite, prix, CODPRD, LIBPRD, CODEMB, LIBEMB, TYPPRD]);
        
        res.status(201).json({
            message: "Produit créé avec succès",
            id: result.insertId
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: "Erreur lors de la création du produit" });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const query = 'SELECT * FROM Produit WHERE idProduit = ?';
        const [results] = await db.query(query, [req.params.id]);
        
        if (results.length === 0) {
            return res.status(404).json({ error: "Produit non trouvé" });
        }
        res.json(results[0]);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: "Erreur lors de la récupération du produit" });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    try {
        const { nom, disponibilite, prix, CODPRD, LIBPRD, CODEMB, LIBEMB, TYPPRD } = req.body;
        const query = `
            UPDATE Produit 
            SET nom = ?, disponibilite = ?, prix = ?, 
                CODPRD = ?, LIBPRD = ?, CODEMB = ?, 
                LIBEMB = ?, TYPPRD = ?
            WHERE idProduit = ?
        `;
        
        const [result] = await db.query(query, [
            nom, disponibilite, prix, 
            CODPRD, LIBPRD, CODEMB, 
            LIBEMB, TYPPRD, req.params.id
        ]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Produit non trouvé" });
        }
        res.json({ message: "Produit mis à jour avec succès" });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: "Erreur lors de la mise à jour du produit" });
    }
});

module.exports = router;

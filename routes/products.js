const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all products
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM Produit';
        const [results] = await db.execute(query);
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

        // Validation des données requises
        if (!nom || !prix) {
            return res.status(400).json({ 
                error: "Données manquantes", 
                details: "Le nom et le prix sont requis" 
            });
        }

        // Conversion du prix en nombre
        const prixNumber = parseFloat(prix);
        if (isNaN(prixNumber)) {
            return res.status(400).json({ 
                error: "Format invalide", 
                details: "Le prix doit être un nombre valide" 
            });
        }

        const query = `
            INSERT INTO Produit 
            (nom, disponibilite, prix, CODPRD, LIBPRD, CODEMB, LIBEMB, TYPPRD, quantite, seuil_alerte) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 10)
        `;
        
        const values = [
            nom,
            disponibilite || 'En stock',  // Valeur par défaut
            prixNumber,
            CODPRD || null,
            LIBPRD || null,
            CODEMB || null,
            LIBEMB || null,
            TYPPRD || null
        ];

        const [result] = await db.execute(query, values);
        
        // Récupérer le produit créé
        const [newProduct] = await db.execute(
            'SELECT * FROM Produit WHERE idProduit = ?', 
            [result.insertId]
        );
        
        res.status(201).json({
            message: "Produit créé avec succès",
            produit: newProduct[0]
        });
    } catch (err) {
        console.error('Erreur lors de la création du produit:', err);
        res.status(500).json({ 
            error: "Erreur lors de la création du produit", 
            details: err.message,
            sqlMessage: err.sqlMessage 
        });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const query = 'SELECT * FROM Produit WHERE idProduit = ?';
        const [results] = await db.execute(query, [req.params.id]);
        
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
        
        const [result] = await db.execute(query, [
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

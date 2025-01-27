const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.use(auth);

// Get all products
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                idProduit,
                CODPRD,
                LIBPRD,
                CODEMB,
                LIBEMB,
                TYPPRD,
                nom,
                prix,
                disponibilite,
                quantite,
                seuil_alerte,
                date_creation,
                date_modification
            FROM Produit 
            ORDER BY date_creation DESC
        `;
        const [results] = await db.execute(query);
        res.json(results);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ 
            error: "Erreur lors de la récupération des produits",
            details: err.message 
        });
    }
});

// Create new product
router.post('/', async (req, res) => {
    try {
        const { 
            nom, 
            disponibilite, 
            prix, 
            CODPRD, 
            LIBPRD, 
            CODEMB, 
            LIBEMB, 
            TYPPRD,
            quantite,
            seuil_alerte
        } = req.body;
        
        // Validation des données
        const errors = [];
        if (!nom) errors.push("Le nom est obligatoire");
        if (!prix) errors.push("Le prix est obligatoire");
        if (!CODPRD) errors.push("Le code produit est obligatoire");
        if (!TYPPRD) errors.push("Le type de produit est obligatoire");
        
        if (errors.length > 0) {
            return res.status(400).json({ 
                error: "Données invalides",
                details: errors
            });
        }

        // Vérifier si le code produit existe déjà
        const [existing] = await db.execute(
            'SELECT COUNT(*) as count FROM Produit WHERE CODPRD = ?',
            [CODPRD]
        );

        if (existing[0].count > 0) {
            return res.status(400).json({
                error: "Code produit déjà utilisé",
                details: ["Un produit avec ce code existe déjà"]
            });
        }

        const query = `
            INSERT INTO Produit (
                nom, 
                disponibilite, 
                prix, 
                CODPRD, 
                LIBPRD, 
                CODEMB, 
                LIBEMB, 
                TYPPRD,
                quantite,
                seuil_alerte,
                date_creation,
                date_modification
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;
        
        // Convertir les valeurs numériques
        const prixNumber = parseFloat(prix);
        if (isNaN(prixNumber)) {
            return res.status(400).json({
                error: "Prix invalide",
                details: ["Le prix doit être un nombre valide"]
            });
        }

        const quantiteNumber = parseInt(quantite || 0);
        const seuilNumber = parseInt(seuil_alerte || 0);
        
        const [result] = await db.execute(query, [
            nom.trim(), 
            disponibilite || 'Disponible', 
            prixNumber, 
            CODPRD.trim().toUpperCase(), 
            LIBPRD?.trim() || nom.trim(), 
            CODEMB?.trim()?.toUpperCase() || 'L', 
            LIBEMB?.trim() || 'Litre', 
            TYPPRD?.trim()?.toUpperCase() || 'CARBURANT',
            quantiteNumber,
            seuilNumber
        ]);
        
        // Récupérer le produit créé
        const [newProduct] = await db.execute(
            'SELECT * FROM Produit WHERE idProduit = ?', 
            [result.insertId]
        );
        
        if (!newProduct || newProduct.length === 0) {
            throw new Error("Le produit a été créé mais impossible de le récupérer");
        }
        
        res.status(201).json({
            message: "Produit créé avec succès",
            produit: newProduct[0]
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ 
            error: "Erreur lors de la création du produit",
            details: err.message 
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
        res.status(500).json({ 
            error: "Erreur lors de la récupération du produit",
            details: err.message 
        });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    try {
        const { 
            nom, 
            disponibilite, 
            prix, 
            CODPRD, 
            LIBPRD, 
            CODEMB, 
            LIBEMB, 
            TYPPRD,
            quantite,
            seuil_alerte
        } = req.body;
        
        // Vérifier si le produit existe
        const [existingProduct] = await db.execute(
            'SELECT * FROM Produit WHERE idProduit = ?', 
            [req.params.id]
        );
        
        if (existingProduct.length === 0) {
            return res.status(404).json({ error: "Produit non trouvé" });
        }

        const query = `
            UPDATE Produit 
            SET nom = ?, 
                disponibilite = ?, 
                prix = ?, 
                CODPRD = ?, 
                LIBPRD = ?, 
                CODEMB = ?, 
                LIBEMB = ?, 
                TYPPRD = ?,
                quantite = ?,
                seuil_alerte = ?,
                date_modification = NOW()
            WHERE idProduit = ?
        `;
        
        // Convertir les valeurs numériques
        const prixNumber = parseFloat(prix);
        if (isNaN(prixNumber)) {
            return res.status(400).json({
                error: "Prix invalide",
                details: ["Le prix doit être un nombre valide"]
            });
        }

        const quantiteNumber = parseInt(quantite || 0);
        const seuilNumber = parseInt(seuil_alerte || 0);
        
        await db.execute(query, [
            nom, 
            disponibilite, 
            prixNumber, 
            CODPRD, 
            LIBPRD || null, 
            CODEMB || null, 
            LIBEMB || null, 
            TYPPRD || null,
            quantiteNumber,
            seuilNumber,
            req.params.id
        ]);
        
        // Récupérer le produit mis à jour
        const [updatedProduct] = await db.execute(
            'SELECT * FROM Produit WHERE idProduit = ?', 
            [req.params.id]
        );
        
        res.json({
            message: "Produit mis à jour avec succès",
            produit: updatedProduct[0]
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ 
            error: "Erreur lors de la mise à jour du produit",
            details: err.message 
        });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        // Vérifier si le produit existe
        const [existingProduct] = await db.execute(
            'SELECT * FROM Produit WHERE idProduit = ?', 
            [req.params.id]
        );
        
        if (existingProduct.length === 0) {
            return res.status(404).json({ error: "Produit non trouvé" });
        }

        await db.execute('DELETE FROM Produit WHERE idProduit = ?', [req.params.id]);
        
        res.json({ message: "Produit supprimé avec succès" });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ 
            error: "Erreur lors de la suppression du produit",
            details: err.message 
        });
    }
});

module.exports = router;

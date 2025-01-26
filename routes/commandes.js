const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Appliquer l'authentification à toutes les routes
router.use(auth);

// Get all commandes
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT c.*, 
                   p.LIBPRD as nomProduit, 
                   p.prix 
            FROM Commande c 
            LEFT JOIN CommandeProduit cp ON c.idCommande = cp.idCommande
            LEFT JOIN Produit p ON cp.idProduit = p.idProduit
        `;
        
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        console.error('Erreur SQL GET all:', err);
        res.status(500).json({ error: "Erreur lors de la récupération des commandes" });
    }
});

// Get commandes for current user
router.get('/user', async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('User ID from token:', userId);
        
        const query = `
            SELECT c.*, 
                   p.LIBPRD as nomProduit, 
                   p.prix 
            FROM Commande c 
            LEFT JOIN CommandeProduit cp ON c.idCommande = cp.idCommande
            LEFT JOIN Produit p ON cp.idProduit = p.idProduit 
            WHERE c.idUtilisateur = ?
            ORDER BY c.date DESC
        `;
        
        const [results] = await db.query(query, [userId]);
        console.log('Commandes trouvées:', results.length);
        res.json(results);
    } catch (err) {
        console.error('Erreur SQL GET user commandes:', err);
        res.status(500).json({ error: "Erreur lors de la récupération des commandes de l'utilisateur" });
    }
});

// Create new commande
router.post('/', async (req, res) => {
    try {
        const { montant, etat, produits } = req.body;
        const userId = req.user.id;
        const RefCommande = 'CMD' + Date.now();

        console.log('POST /api/commandes', req.body);
        console.log('Creating commande for user:', userId);

        const insertCommandeQuery = `
            INSERT INTO Commande (montant, date, etat, RefCommande, idUtilisateur) 
            VALUES (?, NOW(), ?, ?, ?)
        `;
        
        const [result] = await db.query(insertCommandeQuery, [montant, etat, RefCommande, userId]);
        const idCommande = result.insertId;

        // Insérer les produits de la commande
        const insertProduitQuery = `
            INSERT INTO CommandeProduit (idCommande, idProduit, quantite, prix) 
            VALUES (?, ?, ?, ?)
        `;
        
        for (const produit of produits) {
            await db.query(insertProduitQuery, [idCommande, produit.idProduit, produit.quantite, produit.prix]);
        }

        // Update product stock
        for (const produit of produits) {
            const updateStockQuery = 'UPDATE Produit SET quantite = quantite - ? WHERE idProduit = ?';
            await db.query(updateStockQuery, [produit.quantite, produit.idProduit]);
        }

        // Émettre l'événement Socket.IO pour la nouvelle commande
        const io = req.app.get('io');
        io.emit('nouvelle-commande', {
            idCommande: idCommande,
            RefCommande: RefCommande,
            montant: montant,
            etat: etat,
            date: new Date()
        });

        res.status(201).json({ 
            message: "Commande créée avec succès",
            idCommande,
            RefCommande
        });
    } catch (err) {
        console.error('Erreur SQL Transaction:', err);
        res.status(500).json({ error: "Erreur lors de la création de la commande" });
    }
});

// Get commande by ID
router.get('/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const query = `
            SELECT c.*, 
                   p.LIBPRD as nomProduit, 
                   cp.quantite, 
                   cp.prix
            FROM Commande c
            LEFT JOIN CommandeProduit cp ON c.idCommande = cp.idCommande
            LEFT JOIN Produit p ON cp.idProduit = p.idProduit
            WHERE c.idCommande = ? AND (c.idUtilisateur = ? OR ? IN (SELECT identifiant FROM Utilisateur WHERE roles = 'ADMIN'))
        `;
        
        const [results] = await db.query(query, [req.params.id, userId, userId]);
        if (results.length === 0) {
            return res.status(404).json({ error: "Commande non trouvée" });
        }
        res.json(results[0]);
    } catch (err) {
        console.error('Erreur SQL GET by ID:', err);
        res.status(500).json({ error: "Erreur lors de la récupération de la commande" });
    }
});

// Update commande status
router.put('/:id/status', async (req, res) => {
    try {
        const { etat } = req.body;
        const userId = req.user.id;
        
        const checkQuery = `
            SELECT * FROM Commande c 
            WHERE c.idCommande = ? AND (c.idUtilisateur = ? OR ? IN (SELECT identifiant FROM Utilisateur WHERE roles = 'ADMIN'))
        `;
        
        const [results] = await db.query(checkQuery, [req.params.id, userId, userId]);
        if (results.length === 0) {
            return res.status(403).json({ error: "Non autorisé à modifier cette commande" });
        }
        
        const updateQuery = 'UPDATE Commande SET etat = ? WHERE idCommande = ?';
        await db.query(updateQuery, [etat, req.params.id]);
        res.json({ message: "Statut mis à jour avec succès" });
    } catch (err) {
        console.error('Erreur SQL UPDATE status:', err);
        res.status(500).json({ error: "Erreur lors de la mise à jour du statut" });
    }
});

// Assign commande to station (create livraison)
router.post('/:id/livraison', async (req, res) => {
    try {
        const { idStation } = req.body;
        const idCommande = req.params.id;
        const userId = req.user.id;

        console.log('Création livraison pour:', { idCommande, idStation, userId });

        // Vérifier d'abord les permissions avec le rôle DEPOT
        const checkQuery = `
            SELECT c.* FROM Commande c 
            WHERE c.idCommande = ? 
            AND (c.idUtilisateur = ? 
                 OR ? IN (SELECT identifiant FROM Utilisateur WHERE roles IN ('ADMIN', 'DEPOT')))
        `;
        
        const [results] = await db.query(checkQuery, [idCommande, userId, userId]);
        if (!results[0]) {
            throw new Error("Non autorisé à modifier cette commande");
        }

        // 1. Créer la livraison
        const createLivraisonQuery = `
            INSERT INTO livraison (idCommande, dateLivraison, numChauffeur, quantiteLv)
            VALUES (?, NOW(), 0, 0)
        `;
        
        await db.query(createLivraisonQuery, [idCommande]);

        // 2. Mettre à jour l'état de la commande
        const updateCommandeQuery = `
            UPDATE Commande SET etat = 'En cours'
            WHERE idCommande = ?
        `;

        await db.query(updateCommandeQuery, [idCommande]);

        res.status(201).json({ 
            message: "Livraison créée et commande mise à jour avec succès"
        });
    } catch (err) {
        console.error('Erreur lors de la création de la livraison:', err);
        res.status(500).json({ error: err.message || "Erreur lors de la création de la livraison" });
    }
});

// Get all products with stock levels
router.get('/products', async (req, res) => {
    try {
        const query = `
            SELECT p.idProduit, p.nom, p.prix, p.quantite
            FROM Produit p
            ORDER BY p.nom ASC
        `;
        
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        console.error('Erreur SQL GET products:', err);
        res.status(500).json({ error: "Erreur lors de la récupération des produits" });
    }
});

module.exports = router;

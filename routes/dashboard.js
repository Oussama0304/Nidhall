const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Get dashboard statistics
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.identifiant;
        const userRole = req.user.roles;

        // Récupérer les statistiques de base
        const [reclamationsCount] = await db.execute('SELECT COUNT(*) as count FROM Reclamation');
        const [commandesCount] = await db.execute('SELECT COUNT(*) as count FROM Commande');
        const [materielsCount] = await db.execute('SELECT COUNT(*) as count FROM Material');

        // Récupérer les réclamations récentes
        const recentReclamationsQuery = `
            SELECT r.*, 
                   u1.nom as nom_commercial, 
                   u1.prenom as prenom_commercial,
                   u2.nom as nom_gerant, 
                   u2.prenom as prenom_gerant
            FROM Reclamation r
            LEFT JOIN Utilisateur u1 ON r.idCommercial = u1.identifiant
            LEFT JOIN Utilisateur u2 ON r.idGerant = u2.identifiant
            ORDER BY r.date DESC
            LIMIT 5
        `;
        const [recentReclamations] = await db.execute(recentReclamationsQuery);

        // Récupérer les commandes récentes
        const recentCommandesQuery = `
            SELECT c.*, 
                   u.nom as nom_commercial, 
                   u.prenom as prenom_commercial
            FROM Commande c
            LEFT JOIN Utilisateur u ON c.idCommercial = u.identifiant
            ORDER BY c.date DESC
            LIMIT 5
        `;
        const [recentCommandes] = await db.execute(recentCommandesQuery);

        // Statistiques spécifiques au rôle
        let roleSpecificStats = {};
        if (userRole === 'COMMERCIAL') {
            const [commercialStats] = await db.execute(
                'SELECT COUNT(*) as count FROM Reclamation WHERE idCommercial = ?',
                [userId]
            );
            roleSpecificStats.reclamationsCount = commercialStats[0].count;
        } else if (userRole === 'GERANT') {
            const [gerantStats] = await db.execute(
                'SELECT COUNT(*) as count FROM Reclamation WHERE idGerant = ?',
                [userId]
            );
            roleSpecificStats.reclamationsCount = gerantStats[0].count;
        }

        res.json({
            statistics: {
                totalReclamations: reclamationsCount[0].count,
                totalCommandes: commandesCount[0].count,
                totalMateriels: materielsCount[0].count,
                ...roleSpecificStats
            },
            recentReclamations,
            recentCommandes
        });
    } catch (err) {
        console.error('Erreur lors de la récupération des statistiques:', err);
        res.status(500).json({ error: "Erreur lors de la récupération des statistiques", details: err.message });
    }
});

module.exports = router;

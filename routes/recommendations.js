const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/db');

// Get recommendations for a reclamation
router.get('/:reclamationId', auth, async (req, res) => {
    try {
        const reclamationId = req.params.reclamationId;

        // Récupérer la réclamation
        const [reclamations] = await db.execute(
            'SELECT * FROM Reclamation WHERE idReclamation = ?',
            [reclamationId]
        );

        if (!reclamations || reclamations.length === 0) {
            return res.status(404).json({ error: 'Réclamation non trouvée' });
        }

        const reclamation = reclamations[0];

        // Récupérer les réclamations similaires
        const [similarReclamations] = await db.execute(
            'SELECT * FROM Reclamation WHERE idReclamation != ? AND type = ? LIMIT 5',
            [reclamationId, reclamation.type]
        );

        // Récupérer les solutions précédentes
        const [previousSolutions] = await db.execute(
            'SELECT DISTINCT solution FROM Reclamation WHERE type = ? AND solution IS NOT NULL LIMIT 5',
            [reclamation.type]
        );

        // Générer des recommandations basées sur l'historique
        const recommendations = {
            similarCases: similarReclamations.map(rec => ({
                id: rec.idReclamation,
                description: rec.description,
                solution: rec.solution,
                status: rec.etat,
                resolutionTime: rec.dateResolution ? 
                    Math.floor((new Date(rec.dateResolution) - new Date(rec.dateCreation)) / (1000 * 60 * 60 * 24)) : 
                    null
            })),
            suggestedSolutions: previousSolutions.map(sol => sol.solution).filter(Boolean),
            estimatedResolutionTime: calculateEstimatedTime(similarReclamations),
            priority: determinePriority(reclamation, similarReclamations)
        };

        res.json(recommendations);
    } catch (error) {
        console.error('Erreur lors de la génération des recommandations:', error);
        res.status(500).json({ error: 'Erreur lors de la génération des recommandations' });
    }
});

// Fonction utilitaire pour calculer le temps estimé
function calculateEstimatedTime(similarCases) {
    const times = similarCases
        .filter(rec => rec.dateResolution && rec.dateCreation)
        .map(rec => new Date(rec.dateResolution) - new Date(rec.dateCreation));
    
    if (times.length === 0) return "Non disponible";
    
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    return Math.floor(avgTime / (1000 * 60 * 60 * 24)) + " jours";
}

// Fonction utilitaire pour déterminer la priorité
function determinePriority(reclamation, similarCases) {
    // Logique de base pour la priorité
    if (reclamation.type === 'URGENT' || reclamation.description.toLowerCase().includes('urgent')) {
        return 'HAUTE';
    }
    
    // Vérifier les cas similaires
    const urgentCases = similarCases.filter(rec => 
        rec.etat === 'URGENT' || 
        (rec.description && rec.description.toLowerCase().includes('urgent'))
    );
    
    if (urgentCases.length > similarCases.length / 2) {
        return 'HAUTE';
    }
    
    return 'NORMALE';
}

module.exports = router;

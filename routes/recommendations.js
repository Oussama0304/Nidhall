const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const recommendationService = require('../services/recommendation.service');

// Get recommendations for a reclamation
router.get('/:reclamationId', auth, async (req, res) => {
    try {
        const reclamationId = req.params.reclamationId;

        // Récupérer la réclamation
        const reclamation = await new Promise((resolve, reject) => {
            recommendationService.db.query(
                'SELECT * FROM Reclamation WHERE idReclamation = ?',
                [reclamationId],
                (err, results) => {
                    if (err) reject(err);
                    else resolve(results[0]);
                }
            );
        });

        if (!reclamation) {
            return res.status(404).json({ message: 'Réclamation non trouvée' });
        }

        // Obtenir les différentes recommandations
        const [similarCases, recommendedCommercial, preventiveActions] = await Promise.all([
            recommendationService.findSimilarCases(reclamation.description),
            recommendationService.recommendCommercial(reclamation.type),
            recommendationService.suggestPreventiveActions(reclamation.type)
        ]);

        // Formater les recommandations
        const recommendations = [];

        // Ajouter les cas similaires
        if (similarCases && similarCases.length > 0) {
            similarCases.forEach(caseItem => {
                recommendations.push({
                    type: 'SIMILAR_CASE',
                    description: `Cas similaire #${caseItem.idReclamation}: ${caseItem.description}`,
                    score: 0.8,
                    details: {
                        idReclamation: caseItem.idReclamation,
                        commercial: `${caseItem.nom_commercial} ${caseItem.prenom_commercial}`,
                        date: caseItem.date
                    }
                });
            });
        }

        // Ajouter le commercial recommandé
        if (recommendedCommercial) {
            recommendations.push({
                type: 'RECOMMENDED_COMMERCIAL',
                description: `Commercial recommandé: ${recommendedCommercial.nom} ${recommendedCommercial.prenom}`,
                score: recommendedCommercial.taux_resolution / 100,
                details: {
                    commercial: recommendedCommercial,
                    stats: {
                        totalReclamations: recommendedCommercial.total_reclamations,
                        reclamationsResolues: recommendedCommercial.reclamations_resolues,
                        tauxResolution: recommendedCommercial.taux_resolution
                    }
                }
            });
        }

        // Ajouter les actions préventives
        if (preventiveActions && Array.isArray(preventiveActions)) {
            preventiveActions.forEach((action, index) => {
                recommendations.push({
                    type: 'PREVENTIVE_ACTION',
                    description: action,
                    score: 0.9 - (index * 0.1),
                    details: {
                        priority: index === 0 ? 'HAUTE' : index === 1 ? 'MOYENNE' : 'FAIBLE'
                    }
                });
            });
        }

        res.json(recommendations);
    } catch (error) {
        console.error('Erreur lors de la génération des recommandations:', error);
        res.status(500).json({ message: 'Erreur lors de la génération des recommandations' });
    }
});

module.exports = router;

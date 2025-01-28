const express = require('express');
const router = express.Router();
const { analyzeImage } = require('../services/imageAnalysis');
const path = require('path');
const auth = require('../middleware/auth');
const db = require('../config/db');
const fs = require('fs');

// Route pour analyser une image de réclamation
router.post('/analyze', auth, async (req, res) => {
    try {
        const { imagePath, reclamationId } = req.body;

        if (!imagePath || !reclamationId) {
            return res.status(400).json({ error: 'Chemin de l\'image et ID de réclamation requis' });
        }

        // Vérifier si le fichier existe
        const absolutePath = path.resolve(imagePath);
        if (!fs.existsSync(absolutePath)) {
            return res.status(404).json({ error: 'Image non trouvée' });
        }

        // Analyser l'image
        const analysisResults = await analyzeImage(absolutePath);

        // Mettre à jour la réclamation avec les résultats d'analyse
        await db.execute(
            'UPDATE Reclamation SET image_analysis = ? WHERE idReclamation = ?',
            [JSON.stringify(analysisResults), reclamationId]
        );

        // Retourner les résultats
        res.json(analysisResults);
    } catch (error) {
        console.error('Erreur lors de l\'analyse de l\'image:', error);
        res.status(500).json({ error: 'Erreur lors de l\'analyse de l\'image' });
    }
});

// Route pour récupérer l'historique des analyses
router.get('/history', auth, async (req, res) => {
    try {
        const [results] = await db.execute(`
            SELECT r.idReclamation, r.description, r.image_url, r.image_analysis, r.date
            FROM Reclamation r
            WHERE r.image_analysis IS NOT NULL
            ORDER BY r.date DESC
        `);

        res.json(results);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' });
    }
});

module.exports = router;

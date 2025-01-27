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
        const { imagePath } = req.body;

        if (!imagePath) {
            return res.status(400).json({ error: 'Chemin de l\'image requis' });
        }

        // Vérifier si le fichier existe
        const absolutePath = path.resolve(imagePath);
        if (!fs.existsSync(absolutePath)) {
            return res.status(404).json({ error: 'Image non trouvée' });
        }

        // Analyser l'image
        const analysisResults = await analyzeImage(absolutePath);

        // Sauvegarder les résultats dans la base de données
        const [result] = await db.execute(
            'INSERT INTO ImageAnalysis (image_path, analysis_results, created_at) VALUES (?, ?, NOW())',
            [imagePath, JSON.stringify(analysisResults)]
        );

        // Retourner les résultats
        res.json({
            id: result.insertId,
            ...analysisResults
        });
    } catch (error) {
        console.error('Erreur lors de l\'analyse de l\'image:', error);
        res.status(500).json({ error: 'Erreur lors de l\'analyse de l\'image' });
    }
});

// Route pour récupérer l'historique des analyses
router.get('/history', auth, async (req, res) => {
    try {
        const [results] = await db.execute(
            'SELECT * FROM ImageAnalysis ORDER BY created_at DESC LIMIT 100'
        );

        res.json(results);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' });
    }
});

// Route pour récupérer une analyse spécifique
router.get('/:id', auth, async (req, res) => {
    try {
        const [results] = await db.execute(
            'SELECT * FROM ImageAnalysis WHERE id = ?',
            [req.params.id]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: 'Analyse non trouvée' });
        }

        res.json(results[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'analyse:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'analyse' });
    }
});

module.exports = router;

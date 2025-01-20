const express = require('express');
const router = express.Router();
const { analyzeImage } = require('../services/imageAnalysis');
const path = require('path');
const auth = require('../middleware/auth');
const pool = require('../config/db');
const fs = require('fs');

// Route pour analyser une image de réclamation
router.post('/analyze/:reclamationId', auth, async (req, res) => {
    try {
        const { reclamationId } = req.params;
        console.log('Analyse de la réclamation:', reclamationId);

        // Récupérer les détails de la réclamation depuis la base de données
        const query = 'SELECT image_url FROM reclamation WHERE idReclamation = ?';
        
        const connection = await pool.getConnection();
        try {
            const [results] = await connection.query(query, [reclamationId]);
            if (!results || results.length === 0) {
                console.log('Réclamation non trouvée:', reclamationId);
                return res.status(404).json({ error: 'Réclamation non trouvée' });
            }

            const { image_url } = results[0];
            if (!image_url) {
                console.log('Pas d\'image pour la réclamation:', reclamationId);
                return res.status(400).json({ error: 'Aucune image associée à cette réclamation' });
            }

            console.log('URL de l\'image trouvée:', image_url);

            // Nettoyer le chemin de l'image
            const cleanImageUrl = image_url.replace(/^\/?(uploads\/reclamations\/)?/, '');
            const imagePath = path.join(__dirname, '..', 'uploads', 'reclamations', cleanImageUrl);
            console.log('Chemin complet de l\'image:', imagePath);

            // Vérifier si le fichier existe
            if (!fs.existsSync(imagePath)) {
                console.error('Image non trouvée au chemin:', imagePath);
                // Essayer un chemin alternatif sans le dossier uploads
                const alternativePath = path.join(__dirname, '..', cleanImageUrl);
                if (!fs.existsSync(alternativePath)) {
                    console.error('Image également non trouvée au chemin alternatif:', alternativePath);
                    return res.status(404).json({ error: 'Image non trouvée sur le serveur' });
                }
                console.log('Image trouvée au chemin alternatif');
                imagePath = alternativePath;
            }

            // Analyser l'image
            const analysisResults = await analyzeImage(imagePath);
            console.log('Résultats de l\'analyse:', analysisResults);

            // Mettre à jour la réclamation avec les résultats
            const updateQuery = `
                UPDATE reclamation 
                SET 
                    analysis_results = ?,
                    last_analyzed = CURRENT_TIMESTAMP
                WHERE idReclamation = ?
            `;
            
            await connection.query(updateQuery, [JSON.stringify(analysisResults), reclamationId]);

            res.json(analysisResults);
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Erreur lors de l\'analyse:', error);
        res.status(500).json({ error: 'Erreur lors de l\'analyse de l\'image' });
    }
});

// Route pour récupérer l'historique des analyses
router.get('/history/:reclamationId', auth, async (req, res) => {
    try {
        const { reclamationId } = req.params;
        
        const query = `
            SELECT 
                id,
                type,
                description,
                image_url,
                analysis_results,
                last_analyzed
            FROM reclamation
            WHERE idReclamation = ? AND analysis_results IS NOT NULL
        `;

        const connection = await pool.getConnection();
        try {
            const [results] = await connection.query(query, [reclamationId]);
            if (!results || results.length === 0) {
                return res.status(404).json({ error: 'Aucune analyse trouvée' });
            }

            res.json(results[0]);
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' });
    }
});

module.exports = router;

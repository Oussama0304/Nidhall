const express = require('express');
const router = express.Router();
const { analyzeImage } = require('../services/imageAnalysis');
const path = require('path');
const auth = require('../middleware/auth');
const mysql = require('mysql2');
const fs = require('fs');

// Fonction pour créer une connexion à la base de données
function createConnection() {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    // Gérer la reconnexion
    connection.on('error', function(err) {
        console.error('Erreur de base de données:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Tentative de reconnexion à la base de données...');
            createConnection();
        } else {
            throw err;
        }
    });

    return connection;
}

// Créer la connexion initiale
let db = createConnection();

// Route pour analyser une image de réclamation
router.post('/analyze/:reclamationId', auth, async (req, res) => {
    try {
        const { reclamationId } = req.params;
        console.log('Analyse de la réclamation:', reclamationId);

        // Vérifier la connexion et reconnecter si nécessaire
        if (!db || db.state === 'disconnected') {
            console.log('Reconnexion à la base de données...');
            db = createConnection();
        }

        // Récupérer les détails de la réclamation depuis la base de données
        const query = 'SELECT image_url FROM reclamation WHERE idReclamation = ?';
        
        db.query(query, [reclamationId], async (err, results) => {
            if (err) {
                console.error('Erreur lors de la récupération de l\'image:', err);
                return res.status(500).json({ error: 'Erreur lors de l\'analyse de l\'image' });
            }

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
            
            db.query(updateQuery, [JSON.stringify(analysisResults), reclamationId], (updateErr) => {
                if (updateErr) {
                    console.error('Erreur lors de la mise à jour des résultats:', updateErr);
                    return res.status(500).json({ error: 'Erreur lors de la sauvegarde des résultats' });
                }

                res.json(analysisResults);
            });
        });
    } catch (error) {
        console.error('Erreur lors de l\'analyse:', error);
        res.status(500).json({ error: 'Erreur lors de l\'analyse de l\'image' });
    }
});

// Route pour récupérer l'historique des analyses
router.get('/history/:reclamationId', auth, (req, res) => {
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

    db.query(query, [reclamationId], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération de l\'historique:', err);
            return res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique' });
        }

        if (!results || results.length === 0) {
            return res.status(404).json({ error: 'Aucune analyse trouvée' });
        }

        res.json(results[0]);
    });
});

module.exports = router;

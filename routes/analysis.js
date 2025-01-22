const express = require('express');
const router = express.Router();
const analysisService = require('../services/analysisService');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const db = require('../config/db');

// Configuration de multer pour utiliser le même dossier que les réclamations
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/reclamations')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Seules les images (jpeg, jpg, png) sont autorisées!'));
    }
});

// Analyser une réclamation
router.post('/analyze-reclamation', auth, async (req, res) => {
    try {
        console.log('Début de l\'analyse de la réclamation:', req.body);
        const result = await analysisService.analyzeReclamation(req.body);
        res.json(result);
    } catch (error) {
        console.error('Erreur lors de l\'analyse de la réclamation:', error);
        res.status(500).json({ 
            message: 'Erreur lors de l\'analyse de la réclamation',
            error: error.message 
        });
    }
});

// Analyser une image
router.post('/image', auth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Aucune image fournie' });
        }

        const result = await analysisService.analyzeImage(req.file.path);
        res.json(result);
    } catch (error) {
        console.error('Erreur lors de l\'analyse de l\'image:', error);
        res.status(500).json({ 
            message: 'Erreur lors de l\'analyse de l\'image',
            error: error.message 
        });
    }
});

// Obtenir les métriques de performance
router.get('/performance-metrics', auth, async (req, res) => {
    try {
        const metrics = await analysisService.calculateMetrics();
        res.json(metrics);
    } catch (error) {
        console.error('Erreur lors de la récupération des métriques de performance:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des métriques de performance',
            error: error.message 
        });
    }
});

// Obtenir les prédictions pour une réclamation
router.get('/predictions/:id', auth, async (req, res) => {
    try {
        const reclamation = await analysisService.getPredictions(req.params.id);
        res.json(reclamation);
    } catch (error) {
        console.error('Erreur lors de la récupération des prédictions:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des prédictions',
            error: error.message 
        });
    }
});

// Obtenir l'historique des analyses
router.get('/history/:id', auth, async (req, res) => {
    try {
        const history = await analysisService.getAnalysisHistory(req.params.id);
        res.json(history);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération de l\'historique',
            error: error.message 
        });
    }
});

// Route pour les tendances des réclamations
router.get('/reclamations/trends', (req, res) => {
    const query = `
        SELECT 
            type,
            etat,
            priority,
            gravite,
            COUNT(*) as count,
            DATE_FORMAT(date, '%Y-%m') as month
        FROM Reclamation
        GROUP BY type, etat, priority, gravite, DATE_FORMAT(date, '%Y-%m')
        ORDER BY month DESC
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error in trends query:', err);
            return res.status(500).json({ message: 'Error fetching trends data' });
        }
        res.json(results);
    });
});

// Route pour les performances des utilisateurs
router.get('/performance/users', (req, res) => {
    const query = `
        SELECT 
            u.identifiant,
            u.nom,
            u.prenom,
            u.roles,
            COUNT(r.idReclamation) as total_reclamations,
            SUM(CASE WHEN r.etat = 'Validée' THEN 1 ELSE 0 END) as reclamations_resolues,
            AVG(CASE 
                WHEN r.satisfaction = 'TRES_SATISFAIT' THEN 5
                WHEN r.satisfaction = 'SATISFAIT' THEN 4
                WHEN r.satisfaction = 'NEUTRE' THEN 3
                WHEN r.satisfaction = 'PEU_SATISFAIT' THEN 2
                WHEN r.satisfaction = 'INSATISFAIT' THEN 1
            END) as satisfaction_moyenne
        FROM Utilisateur u
        LEFT JOIN Reclamation r ON (u.identifiant = r.idGerant OR u.identifiant = r.idCommercial)
        WHERE u.roles IN ('COMMERCIAL', 'GERANT')
        GROUP BY u.identifiant
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error in performance query:', err);
            return res.status(500).json({ error: "Erreur lors de l'analyse des performances" });
        }
        res.json(results);
    });
});

// Route pour les temps de résolution
router.get('/reclamations/resolution-times', (req, res) => {
    const query = `
        SELECT 
            type,
            priority,
            AVG(estimatedResolutionTime) as avg_estimated_time,
            AVG(actualResolutionTime) as avg_actual_time,
            AVG(predicted_resolution_time) as avg_predicted_time
        FROM Reclamation
        GROUP BY type, priority
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error in resolution times query:', err);
            return res.status(500).json({ error: "Erreur lors de l'analyse" });
        }
        res.json(results);
    });
});

module.exports = router;

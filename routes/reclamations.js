const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const natural = require('natural');
const Sentiment = require('sentiment');
const stopword = require('stopword');
const imageAnalysisService = require('../services/imageAnalysis.service');

// Configuration de Multer pour le stockage des images
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
  limits: {
    fileSize: 5 * 1024 * 1024 // limite à 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

// Configuration NLP
const classifier = new natural.BayesClassifier();

// Entraînement du classificateur
const technicalExamples = [
    "panne équipement",
    "problème technique",
    "dysfonctionnement",
    "maintenance",
    "réparation",
    "installation",
    "pièce défectueuse",
    "panne système",
    "problème matériel"
];

const commercialExamples = [
    "facture incorrecte",
    "service client",
    "délai livraison",
    "prix",
    "commande",
    "retard livraison",
    "qualité service",
    "remboursement",
    "erreur facturation"
];

technicalExamples.forEach(example => {
    classifier.addDocument(example, 'TECHNIQUE');
});

commercialExamples.forEach(example => {
    classifier.addDocument(example, 'COMMERCIALE');
});

classifier.train();

const sentiment = new Sentiment();

// Fonction d'analyse des réclamations
const analyzeReclamation = (description) => {
    const type = classifier.classify(description);
    const sentimentResult = sentiment.analyze(description);
    
    // Analyse détaillée du sentiment
    const sentimentScore = sentimentResult.score;
    const sentimentWords = sentimentResult.words;
    
    // Détermination de la priorité basée sur le sentiment et les mots-clés
    let priority = 'NORMAL';
    let satisfaction = 'NEUTRE';
    let gravite = 'FAIBLE';

    // Mots-clés d'urgence
    const urgentKeywords = ['urgent', 'immédiat', 'critique', 'grave', 'danger', 'panne', 'arrêt'];
    const hasUrgentKeywords = urgentKeywords.some(keyword => 
        description.toLowerCase().includes(keyword)
    );

    // Analyse de la satisfaction
    if (sentimentScore < -2) {
        satisfaction = 'INSATISFAIT';
        if (hasUrgentKeywords) {
            priority = 'URGENT';
            gravite = 'HAUTE';
        } else {
            priority = 'MOYEN';
            gravite = 'MOYENNE';
        }
    } else if (sentimentScore < 0) {
        satisfaction = 'PEU_SATISFAIT';
        priority = 'MOYEN';
        gravite = 'MOYENNE';
    } else if (sentimentScore > 2) {
        satisfaction = 'TRES_SATISFAIT';
        priority = 'NORMAL';
        gravite = 'FAIBLE';
    } else if (sentimentScore > 0) {
        satisfaction = 'SATISFAIT';
        priority = 'NORMAL';
        gravite = 'FAIBLE';
    }

    // Ajustement basé sur les mots-clés d'urgence
    if (hasUrgentKeywords && priority !== 'URGENT') {
        priority = 'MOYEN';
        if (gravite === 'FAIBLE') gravite = 'MOYENNE';
    }

    // Estimation du temps de résolution
    const baseTime = {
        TECHNIQUE: {
            URGENT: 24,
            MOYEN: 48,
            NORMAL: 72
        },
        COMMERCIALE: {
            URGENT: 12,
            MOYEN: 24,
            NORMAL: 48
        }
    };

    const estimatedResolutionTime = baseTime[type][priority];

    return {
        type,
        priority,
        estimatedResolutionTime,
        sentiment: {
            score: sentimentScore,
            satisfaction,
            gravite,
            keywords: sentimentWords
        }
    };
};

// Get all reclamations
router.get('/', auth, (req, res) => {
    console.log('Fetching all reclamations...');
    const query = `
        SELECT r.*, 
               u1.nom as nom_commercial, 
               u1.prenom as prenom_commercial,
               u2.nom as nom_gerant, 
               u2.prenom as prenom_gerant
        FROM Reclamation r
        LEFT JOIN Utilisateur u1 ON r.idCommercial = u1.identifiant
        LEFT JOIN Utilisateur u2 ON r.idGerant = u2.identifiant
        ORDER BY r.date DESC
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur SQL GET all:', err);
            return res.status(500).json({ error: "Erreur lors de la récupération des réclamations", details: err.message });
        }
        console.log(`Found ${results.length} reclamations`);
        res.json(results);
    });
});

// Get reclamations for current user
router.get('/user', auth, (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;
    console.log('User ID from token:', userId, 'Role:', userRole);
    
    let query = `
        SELECT r.*, 
               u1.nom as nom_gerant, 
               u1.prenom as prenom_gerant,
               u2.nom as nom_commercial, 
               u2.prenom as prenom_commercial
        FROM Reclamation r
        LEFT JOIN Utilisateur u1 ON r.idGerant = u1.identifiant
        LEFT JOIN Utilisateur u2 ON r.idCommercial = u2.identifiant
    `;
    
    const queryParams = [];
    
    // Adapter la requête en fonction du rôle
    if (userRole === 'GERANT') {
        query += ' WHERE r.idGerant = ?';
        queryParams.push(userId);
    } else if (userRole === 'COMMERCIAL') {
        query += ' WHERE r.idCommercial = ?';
        queryParams.push(userId);
    } else if (userRole === 'ADMIN') {
        // Pas de condition WHERE pour l'admin
    } else {
        return res.status(403).json({ error: "Rôle non autorisé" });
    }
    
    query += ' ORDER BY r.date DESC';
    
    console.log('Executing query:', query, 'with params:', queryParams);
    
    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Erreur SQL GET user reclamations:', err);
            return res.status(500).json({ error: "Erreur lors de la récupération des réclamations de l'utilisateur", details: err.message });
        }
        console.log('Réclamations trouvées:', results.length);
        res.json(results);
    });
});

// Create new reclamation
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        let imageAnalysis = null;
        let imageUrl = null;

        if (req.file) {
            imageUrl = `/uploads/reclamations/${req.file.filename}`;
            try {
                // Analyser l'image si elle est présente
                imageAnalysis = await imageAnalysisService.analyzeImage(req.file.path);
                console.log('Analyse de l\'image terminée:', imageAnalysis);
            } catch (error) {
                console.error('Erreur lors de l\'analyse de l\'image:', error);
            }
        }

        const { description, type, idGerant } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Analyse NLP
        const analysis = analyzeReclamation(description);

        // Utiliser le type recommandé par l'analyse d'image si disponible
        const finalType = imageAnalysis?.recommendedType || type;

        const query = `
            INSERT INTO Reclamation 
            (description, type, idGerant, idCommercial, date, etat, image_url, 
             priority, satisfaction, gravite, sentiment_score, estimatedResolutionTime, image_analysis)
            VALUES (?, ?, ?, ?, NOW(), 'En instance', ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            query,
            [
                description,
                finalType,
                idGerant,
                userRole === 'COMMERCIAL' ? userId : null,
                imageUrl,
                analysis.priority,
                analysis.sentiment.satisfaction,
                analysis.sentiment.gravite,
                analysis.sentiment.score,
                analysis.estimatedResolutionTime,
                imageAnalysis ? JSON.stringify(imageAnalysis) : null
            ],
            (err, result) => {
                if (err) {
                    console.error('Erreur SQL INSERT:', err);
                    return res.status(500).json({ error: "Erreur lors de la création de la réclamation" });
                }

                const getNewReclamationQuery = `
                    SELECT r.*, 
                           u1.nom as nom_gerant, u1.prenom as prenom_gerant,
                           u2.nom as nom_commercial, u2.prenom as prenom_commercial
                    FROM Reclamation r
                    LEFT JOIN Utilisateur u1 ON r.idGerant = u1.identifiant
                    LEFT JOIN Utilisateur u2 ON r.idCommercial = u2.identifiant
                    WHERE r.idReclamation = ?
                `;

                db.query(getNewReclamationQuery, [result.insertId], (err, reclamation) => {
                    if (err) {
                        console.error('Erreur lors de la récupération de la nouvelle réclamation:', err);
                        return res.status(201).json({
                            message: "Réclamation créée avec succès",
                            id: result.insertId,
                            imageAnalysis
                        });
                    }

                    res.status(201).json({
                        message: "Réclamation créée avec succès",
                        id: result.insertId,
                        reclamation: reclamation[0],
                        analysis,
                        imageAnalysis
                    });
                });
            }
        );
    } catch (error) {
        console.error('Erreur lors de la création de la réclamation:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get reclamation by ID
router.get('/:id', auth, (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    const query = `
        SELECT r.*, 
               u1.nom as nom_gerant, u1.prenom as prenom_gerant,
               u2.nom as nom_commercial, u2.prenom as prenom_commercial
        FROM Reclamation r
        LEFT JOIN Utilisateur u1 ON r.idGerant = u1.identifiant
        LEFT JOIN Utilisateur u2 ON r.idCommercial = u2.identifiant
        WHERE r.idReclamation = ? 
        AND (
            r.idGerant = ? 
            OR r.idCommercial = ? 
            OR ? IN (SELECT identifiant FROM Utilisateur WHERE roles = 'ADMIN')
        )
    `;
    
    db.query(query, [req.params.id, userId, userId, userId], (err, results) => {
        if (err) {
            console.error('Erreur SQL GET by ID:', err);
            return res.status(500).json({ error: "Erreur lors de la récupération de la réclamation" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Réclamation non trouvée ou accès non autorisé" });
        }
        res.json(results[0]);
    });
});

// Update reclamation status
router.put('/:id/status', auth, (req, res) => {
    const { etat } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Vérifier que l'état est valide
    const etatsValides = ['En instance', 'En cours', 'Validée'];
    if (!etatsValides.includes(etat)) {
        return res.status(400).json({ error: "État invalide" });
    }
    
    // Vérifier les permissions
    const checkQuery = `
        SELECT * FROM Reclamation 
        WHERE idReclamation = ? 
        AND (
            idGerant = ? 
            OR idCommercial = ?
            OR ? IN (SELECT identifiant FROM Utilisateur WHERE roles = 'ADMIN')
            OR ? IN (SELECT identifiant FROM Utilisateur WHERE roles = 'COMMERCIAL')
        )
    `;
    
    db.query(checkQuery, [req.params.id, userId, userId, userId, userId], (err, results) => {
        if (err) {
            console.error('Erreur SQL check permission:', err);
            return res.status(500).json({ error: "Erreur lors de la vérification des permissions" });
        }
        
        if (results.length === 0) {
            return res.status(403).json({ error: "Non autorisé à modifier cette réclamation" });
        }
        
        const updateQuery = 'UPDATE Reclamation SET etat = ? WHERE idReclamation = ?';
        db.query(updateQuery, [etat, req.params.id], (err, result) => {
            if (err) {
                console.error('Erreur SQL UPDATE status:', err);
                return res.status(500).json({ error: "Erreur lors de la mise à jour du statut" });
            }
            res.json({ message: "Statut mis à jour avec succès" });
        });
    });
});

module.exports = router;

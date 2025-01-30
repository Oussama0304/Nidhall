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
    "problème de facturation",
    "service client",
    "délai de livraison",
    "commande",
    "prix",
    "qualité service",
    "réclamation commerciale",
    "retard livraison",
    "erreur facturation"
];

technicalExamples.forEach(example => {
    classifier.addDocument(example, 'TECHNIQUE');
});

commercialExamples.forEach(example => {
    classifier.addDocument(example, 'COMMERCIALE');
});

classifier.train();

// Fonction d'analyse des réclamations
const analyzeReclamation = (description) => {
    const sentiment = new Sentiment();
    const words = description.toLowerCase().split(' ');
    const filteredWords = stopword.removeStopwords(words, stopword.fr);
    const sentimentScore = sentiment.analyze(filteredWords.join(' ')).score;

    // Déterminer la priorité et la gravité
    let priority = 'NORMAL';
    let gravite = 'FAIBLE';

    // Mots clés d'urgence
    const urgentKeywords = ['urgent', 'immédiat', 'critique', 'grave', 'danger', 'sécurité'];
    const isUrgent = urgentKeywords.some(keyword => description.toLowerCase().includes(keyword));

    if (isUrgent) {
        priority = 'URGENT';
        gravite = 'HAUTE';
    } else if (sentimentScore < -2) {
        priority = 'MOYEN';
        gravite = 'MOYENNE';
    }

    // Estimer le temps de résolution
    let estimatedResolutionTime = 24; // temps par défaut en heures
    if (priority === 'URGENT') {
        estimatedResolutionTime = 4;
    } else if (priority === 'MOYEN') {
        estimatedResolutionTime = 48;
    }

    return {
        type: classifier.classify(description),
        priority,
        gravite,
        estimatedResolutionTime,
        sentiment_score: sentimentScore
    };
};

router.use(auth);

// Get all reclamations
router.get('/', async (req, res) => {
    try {
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
        
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        console.error('Erreur SQL GET all:', err);
        res.status(500).json({ error: "Erreur lors de la récupération des réclamations", details: err.message });
    }
});

// Get reclamations for current user
router.get('/user', async (req, res) => {
    try {
        const userId = req.user.identifiant;
        const userRole = req.user.roles;
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
            query += ' WHERE r.idCommercial = ? OR r.type = "COMMERCIALE"';
            queryParams.push(userId);
        }
        
        query += ' ORDER BY r.date DESC';
        
        const [results] = await db.query(query, queryParams);
        res.json(results);
    } catch (err) {
        console.error('Erreur SQL GET user reclamations:', err);
        res.status(500).json({ error: "Erreur lors de la récupération des réclamations", details: err.message });
    }
});

// Create new reclamation
router.post('/', upload.single('image'), async (req, res) => {
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
        const userId = req.user.identifiant;
        const userRole = req.user.roles;

        // Analyse NLP
        const analysis = analyzeReclamation(description);

        // Utiliser le type recommandé par l'analyse d'image si disponible
        const finalType = imageAnalysis?.recommendedType || type;

        const query = `
            INSERT INTO Reclamation 
            (description, type, idGerant, idCommercial, date, etat, image_url, 
             priority, satisfaction, gravite, sentiment_score, estimatedResolutionTime, image_analysis)
            VALUES (?, ?, ?, ?, NOW(), 'En instance', ?, ?, ?, ?, ?, ?, 
            ${imageAnalysis ? 'CAST(? AS JSON)' : 'NULL'})
        `;

        const values = [
            description,
            finalType,
            idGerant,
            userRole === 'COMMERCIAL' ? userId : null,
            imageUrl,
            analysis.priority,
            analysis.sentiment.satisfaction,
            analysis.sentiment.gravite,
            analysis.sentiment.score,
            analysis.estimatedResolutionTime
        ];

        if (imageAnalysis) {
            values.push(JSON.stringify(imageAnalysis));
        }

        const [result] = await db.query(query, values);

        // Récupérer la réclamation créée avec les informations complètes
        const getNewReclamationQuery = `
            SELECT r.*, 
                   u1.nom as nom_gerant, u1.prenom as prenom_gerant,
                   u2.nom as nom_commercial, u2.prenom as prenom_commercial
            FROM Reclamation r
            LEFT JOIN Utilisateur u1 ON r.idGerant = u1.identifiant
            LEFT JOIN Utilisateur u2 ON r.idCommercial = u2.identifiant
            WHERE r.idReclamation = ?
        `;

        const [reclamation] = await db.query(getNewReclamationQuery, [result.insertId]);
        res.status(201).json({
            message: "Réclamation créée avec succès",
            id: result.insertId,
            reclamation: reclamation[0],
            analysis,
            imageAnalysis
        });
    } catch (error) {
        console.error('Erreur lors de la création de la réclamation:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get reclamation by ID
router.get('/:id', async (req, res) => {
    try {
        const userId = req.user.identifiant;
        const userRole = req.user.roles;
        
        const query = `
            SELECT r.*, 
                   u1.nom as nom_gerant, 
                   u1.prenom as prenom_gerant,
                   u2.nom as nom_commercial, 
                   u2.prenom as prenom_commercial
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
        
        const [results] = await db.query(query, [req.params.id, userId, userId, userId]);

        if (results.length === 0) {
            return res.status(404).json({ error: "Réclamation non trouvée ou accès non autorisé" });
        }

        res.json(results[0]);
    } catch (err) {
        console.error('Erreur SQL GET by ID:', err);
        res.status(500).json({ error: "Erreur lors de la récupération de la réclamation" });
    }
});

// Update reclamation status
router.put('/:id/status', async (req, res) => {
    try {
        const { etat } = req.body;
        const userId = req.user.identifiant;
        const userRole = req.user.roles;

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
        
        const [results] = await db.query(checkQuery, [req.params.id, userId, userId, userId, userId]);

        if (results.length === 0) {
            return res.status(403).json({ error: "Non autorisé à modifier cette réclamation" });
        }
        
        const updateQuery = 'UPDATE Reclamation SET etat = ? WHERE idReclamation = ?';
        const [result] = await db.query(updateQuery, [etat, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Réclamation non trouvée" });
        }

        res.json({ message: "Statut mis à jour avec succès" });
    } catch (err) {
        console.error('Erreur SQL UPDATE status:', err);
        res.status(500).json({ error: "Erreur lors de la mise à jour du statut" });
    }
});

module.exports = router;

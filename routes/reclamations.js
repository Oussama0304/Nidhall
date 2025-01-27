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

router.use(auth);

// Get all reclamations
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT r.*, 
                   u1.nom as nom_commercial, 
                   u1.prenom as prenom_commercial,
                   u2.nom as nom_gerant, 
                   u2.prenom as prenom_gerant,
                   s.nom as nom_station
            FROM Reclamation r
            LEFT JOIN Utilisateur u1 ON r.idCommercial = u1.identifiant
            LEFT JOIN Utilisateur u2 ON r.idGerant = u2.identifiant
            LEFT JOIN StationService s ON r.idStation = s.idStation
            ORDER BY r.date_creation DESC
        `;
        
        const [results] = await db.execute(query);
        res.json(results);
    } catch (err) {
        console.error('Erreur SQL GET all:', err);
        res.status(500).json({ error: "Erreur lors de la récupération des réclamations", details: err.message });
    }
});

// Get reclamations for current user
router.get('/user', async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.roles; // Changed from role to roles to match auth middleware
        console.log('User ID from token:', userId, 'Role:', userRole);
        
        let query = `
            SELECT r.*, 
                   u1.nom as nom_commercial, 
                   u1.prenom as prenom_commercial,
                   u2.nom as nom_gerant, 
                   u2.prenom as prenom_gerant,
                   s.nom as nom_station
            FROM Reclamation r
            LEFT JOIN Utilisateur u1 ON r.idCommercial = u1.identifiant
            LEFT JOIN Utilisateur u2 ON r.idGerant = u2.identifiant
            LEFT JOIN StationService s ON r.idStation = s.idStation
            WHERE 1=1
        `;
        
        const queryParams = [];
        
        // Adapter la requête en fonction du rôle
        if (userRole === 'GERANT') {
            query += ' AND r.idGerant = ?';
            queryParams.push(userId);
        } else if (userRole === 'COMMERCIAL') {
            query += ' AND r.idCommercial = ?';
            queryParams.push(userId);
        }
        
        query += ' ORDER BY r.date_creation DESC';
        
        const [results] = await db.execute(query, queryParams);
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

        const { description, type, idGerant, idStation } = req.body;
        const userId = req.user.id;
        const userRole = req.user.roles;

        // Validation des données requises
        if (!description || !type) {
            return res.status(400).json({ 
                error: "La description et le type sont obligatoires" 
            });
        }

        if (req.file) {
            imageUrl = `/uploads/reclamations/${req.file.filename}`;
            try {
                imageAnalysis = await imageAnalysisService.analyzeImage(req.file.path);
                console.log('Analyse de l\'image terminée:', imageAnalysis);
            } catch (error) {
                console.error('Erreur lors de l\'analyse de l\'image:', error);
                // On continue même si l'analyse d'image échoue
            }
        }

        // Analyse NLP
        const analysis = analyzeReclamation(description);

        const query = `
            INSERT INTO Reclamation 
            (description, type, idGerant, idCommercial, idStation, date_creation, etat, image_url, 
             priority, satisfaction, gravite, sentiment_score)
            VALUES (?, ?, ?, ?, ?, NOW(), 'En instance', ?, ?, ?, ?, ?)
        `;

        const values = [
            description,
            type,
            idGerant,
            userRole === 'COMMERCIAL' ? userId : null,
            idStation || null,
            imageUrl,
            analysis.priority || 'NORMAL',
            analysis.sentiment?.satisfaction || 0,
            analysis.sentiment?.gravite || 0,
            analysis.sentiment?.score || 0
        ];

        const [result] = await db.execute(query, values);

        // Récupérer la réclamation créée avec les informations complètes
        const getNewReclamationQuery = `
            SELECT r.*, 
                   u1.nom as nom_gerant, u1.prenom as prenom_gerant,
                   u2.nom as nom_commercial, u2.prenom as prenom_commercial,
                   s.nom as nom_station
            FROM Reclamation r
            LEFT JOIN Utilisateur u1 ON r.idGerant = u1.identifiant
            LEFT JOIN Utilisateur u2 ON r.idCommercial = u2.identifiant
            LEFT JOIN StationService s ON r.idStation = s.idStation
            WHERE r.idReclamation = ?
        `;

        const [reclamation] = await db.execute(getNewReclamationQuery, [result.insertId]);

        if (!reclamation || reclamation.length === 0) {
            throw new Error("La réclamation a été créée mais impossible de la récupérer");
        }

        res.status(201).json({
            message: "Réclamation créée avec succès",
            reclamation: reclamation[0]
        });
    } catch (error) {
        console.error('Erreur lors de la création de la réclamation:', error);
        res.status(500).json({ 
            error: "Erreur lors de la création de la réclamation",
            details: error.message 
        });
    }
});

// Get reclamation by ID
router.get('/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.roles;
        
        const query = `
            SELECT r.*, 
                   u1.nom as nom_gerant, 
                   u1.prenom as prenom_gerant,
                   u2.nom as nom_commercial, 
                   u2.prenom as prenom_commercial,
                   s.nom as nom_station
            FROM Reclamation r
            LEFT JOIN Utilisateur u1 ON r.idGerant = u1.identifiant
            LEFT JOIN Utilisateur u2 ON r.idCommercial = u2.identifiant
            LEFT JOIN StationService s ON r.idStation = s.idStation
            WHERE r.idReclamation = ? 
            AND (
                r.idGerant = ? 
                OR r.idCommercial = ? 
                OR ? IN (SELECT identifiant FROM Utilisateur WHERE roles = 'ADMIN')
            )
        `;
        
        const [results] = await db.execute(query, [req.params.id, userId, userId, userId]);

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
        const userId = req.user.id;
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
        
        const [results] = await db.execute(checkQuery, [req.params.id, userId, userId, userId, userId]);

        if (results.length === 0) {
            return res.status(403).json({ error: "Non autorisé à modifier cette réclamation" });
        }
        
        const updateQuery = 'UPDATE Reclamation SET etat = ? WHERE idReclamation = ?';
        const [result] = await db.execute(updateQuery, [etat, req.params.id]);

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

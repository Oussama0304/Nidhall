const { HfInference } = require('@huggingface/inference');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');

// Vérifier la présence du token Hugging Face
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
if (!HUGGINGFACE_API_KEY) {
    console.error('Token Hugging Face manquant dans le fichier .env');
    throw new Error('Configuration Hugging Face manquante');
}

// Initialiser le client Hugging Face
console.log('Initialisation du client Hugging Face...');
const hf = new HfInference(HUGGINGFACE_API_KEY);

// Base de données de connaissances pour les pannes courantes
const faultDatabase = {
    'pompe_defectueuse': {
        keywords: ['pump', 'hydraulic', 'water', 'flow'],
        pieces: ['Pompe hydraulique', 'Joint d\'étanchéité', 'Roulement'],
        solution: 'Remplacer la pompe défectueuse et vérifier le circuit hydraulique',
        gravite: 'haute',
        maintenance: {
            estimatedTime: 120,
            requiredExpertise: 'Technicien hydraulique',
            priority: 'URGENT'
        }
    },
    'fuite_huile': {
        keywords: ['leak', 'oil', 'fluid', 'drip'],
        pieces: ['Joint torique', 'Tuyau hydraulique', 'Raccord'],
        solution: 'Localiser la fuite, remplacer les joints et vérifier la pression',
        gravite: 'moyenne',
        maintenance: {
            estimatedTime: 60,
            requiredExpertise: 'Technicien maintenance',
            priority: 'MOYEN'
        }
    },
    'usure_mecanique': {
        keywords: ['wear', 'rust', 'mechanical', 'broken', 'metal'],
        pieces: ['Roulement', 'Courroie', 'Engrenage'],
        solution: 'Remplacer les pièces usées et effectuer un alignement',
        gravite: 'moyenne',
        maintenance: {
            estimatedTime: 90,
            requiredExpertise: 'Mécanicien',
            priority: 'MOYEN'
        }
    },
    'probleme_electrique': {
        keywords: ['electric', 'wire', 'circuit', 'power', 'connection'],
        pieces: ['Capteur', 'Câblage', 'Relais'],
        solution: 'Vérifier le circuit électrique et remplacer les composants défectueux',
        gravite: 'haute',
        maintenance: {
            estimatedTime: 45,
            requiredExpertise: 'Électricien',
            priority: 'URGENT'
        }
    },
    'probleme_systeme': {
        keywords: ['system', 'software', 'control', 'display', 'screen'],
        pieces: ['Carte électronique', 'Écran', 'Processeur'],
        solution: 'Redémarrer le système et mettre à jour le logiciel si nécessaire',
        gravite: 'moyenne',
        maintenance: {
            estimatedTime: 30,
            requiredExpertise: 'Technicien système',
            priority: 'NORMAL'
        }
    }
};

// Fonction pour analyser une image
const analyzeImage = async (imagePath) => {
    try {
        console.log('Analyse de l\'image:', imagePath);
        
        // Vérifier si le fichier existe
        if (!fs.existsSync(imagePath)) {
            console.error('Image non trouvée:', imagePath);
            throw new Error('Image non trouvée');
        }

        // Lire l'image en tant que Buffer
        const imageBuffer = fs.readFileSync(imagePath);
        console.log('Image lue avec succès, taille:', imageBuffer.length);

        let results = {
            objectDetection: null,
            classification: null,
            faultAnalysis: null
        };

        try {
            // Analyser l'image avec le modèle de détection d'objets
            console.log('Démarrage de la détection d\'objets...');
            results.objectDetection = await hf.objectDetection({
                data: imageBuffer,
                model: 'facebook/detr-resnet-50'
            });
            console.log('Résultats de la détection d\'objets:', results.objectDetection);
        } catch (error) {
            console.error('Erreur lors de la détection d\'objets:', error);
            results.objectDetection = { error: error.message };
        }

        try {
            // Analyser l'image avec le modèle de classification
            console.log('Démarrage de la classification...');
            results.classification = await hf.imageClassification({
                data: imageBuffer,
                model: 'google/vit-base-patch16-224'
            });
            console.log('Résultats de la classification:', results.classification);
        } catch (error) {
            console.error('Erreur lors de la classification:', error);
            results.classification = { error: error.message };
        }

        try {
            // Analyser l'image pour les défauts spécifiques
            console.log('Démarrage de l\'analyse des défauts...');
            results.faultAnalysis = await hf.imageClassification({
                data: imageBuffer,
                model: 'microsoft/resnet-50'
            });
            console.log('Résultats de l\'analyse des défauts:', results.faultAnalysis);
        } catch (error) {
            console.error('Erreur lors de l\'analyse des défauts:', error);
            results.faultAnalysis = { error: error.message };
        }

        // Interpréter les résultats même si certaines analyses ont échoué
        const interpretedResults = interpretResults(
            results.objectDetection || [],
            results.classification || [],
            results.faultAnalysis || []
        );

        return {
            ...interpretedResults,
            raw: results
        };
    } catch (error) {
        console.error('Erreur détaillée lors de l\'analyse de l\'image:', error);
        throw error;
    }
};

// Fonction pour interpréter les résultats
const interpretResults = (objectDetection, classification, imageAnalysis) => {
    // S'assurer que tous les paramètres sont des tableaux
    const detectedObjects = Array.isArray(objectDetection) ? objectDetection : [];
    const classificationResults = Array.isArray(classification) ? classification : [];
    const analysisResults = Array.isArray(imageAnalysis) ? imageAnalysis : [];

    // Extraire les mots-clés pertinents
    const keywords = [
        ...detectedObjects.map(obj => (obj.label || '').toLowerCase()),
        ...classificationResults.map(cls => (cls.label || '').toLowerCase()),
        ...analysisResults.map(ana => (ana.label || '').toLowerCase())
    ].filter(keyword => keyword); // Filtrer les valeurs vides

    console.log('Mots-clés extraits:', keywords);

    // Identifier le type de panne
    const faultType = identifyFaultType(keywords);
    console.log('Type de panne identifié:', faultType);

    // Calculer le score de confiance moyen
    const confidenceScores = [
        ...detectedObjects.map(obj => obj.score || 0),
        ...classificationResults.map(cls => cls.score || 0),
        ...analysisResults.map(ana => ana.score || 0)
    ];
    const averageConfidence = confidenceScores.length > 0
        ? confidenceScores.reduce((acc, score) => acc + score, 0) / confidenceScores.length
        : 0;

    // Retourner les résultats structurés
    return {
        detectedObjects: detectedObjects.map(obj => ({
            label: obj.label || 'Inconnu',
            confidence: obj.score || 0,
            box: obj.box || null
        })),
        classification: classificationResults.map(cls => ({
            label: cls.label || 'Inconnu',
            confidence: cls.score || 0
        })),
        faultAnalysis: {
            type: faultType,
            ...faultDatabase[faultType],
            confidence: averageConfidence
        }
    };
};

// Fonction pour identifier le type de panne
const identifyFaultType = (keywords) => {
    const keywordMapping = {};
    
    // Construire le mapping des mots-clés à partir de la base de données
    Object.entries(faultDatabase).forEach(([type, data]) => {
        keywordMapping[type] = data.keywords;
    });

    // Trouver le type de panne qui correspond le mieux aux mots-clés détectés
    let bestMatch = { type: 'inconnu', score: 0 };
    
    for (const [type, typeKeywords] of Object.entries(keywordMapping)) {
        const score = typeKeywords.filter(k => keywords.some(w => w.includes(k))).length;
        if (score > bestMatch.score) {
            bestMatch = { type, score };
        }
    }

    return bestMatch.type;
};

module.exports = {
    analyzeImage
};

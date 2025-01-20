import axios from 'axios';

// Analyse du sentiment du texte
const analyzeSentiment = (text) => {
  // Simulation d'analyse de sentiment
  const words = text.toLowerCase().split(' ');
  const negativeWords = ['problème', 'défaut', 'mauvais', 'cassé', 'insatisfait'];
  const positiveWords = ['bien', 'satisfait', 'merci', 'excellent', 'parfait'];
  
  let score = 50; // Score neutre par défaut
  words.forEach(word => {
    if (negativeWords.includes(word)) score -= 10;
    if (positiveWords.includes(word)) score += 10;
  });
  
  return {
    score: Math.max(0, Math.min(100, score)),
    label: score < 50 ? 'Négatif' : score > 70 ? 'Positif' : 'Neutre'
  };
};

// Détermination de l'urgence
const determineUrgency = (text) => {
  const urgentWords = ['urgent', 'immédiat', 'critique', 'important'];
  const hasUrgentWords = urgentWords.some(word => 
    text.toLowerCase().includes(word)
  );
  return hasUrgentWords ? 'HAUTE' : 'NORMALE';
};

// Extraction des mots-clés
const extractKeywords = (text) => {
  const words = text.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .split(/\s+/);
  
  const stopWords = ['le', 'la', 'les', 'un', 'une', 'des', 'et', 'ou', 'mais'];
  const keywords = words.filter(word => 
    word.length > 3 && !stopWords.includes(word)
  );
  
  return [...new Set(keywords)].slice(0, 5); // Retourne les 5 premiers mots-clés uniques
};

// Analyse d'image
const analyzeImage = async (imageUrl) => {
  try {
    // Simulation d'appel API pour l'analyse d'image
    return {
      damages: ['Emballage endommagé', 'Produit rayé'],
      objects: ['Produit', 'Emballage']
    };
  } catch (error) {
    console.error('Erreur lors de l\'analyse d\'image:', error);
    throw error;
  }
};

// Analyse de l'historique
const analyzeHistory = async (reclamation) => {
  try {
    // Simulation d'appel API pour l'historique
    return {
      similarCount: Math.floor(Math.random() * 10),
      previousSolutions: [
        'Remplacement produit',
        'Remboursement partiel',
        'Réparation',
        'Compensation commerciale'
      ].sort(() => Math.random() - 0.5).slice(0, 2)
    };
  } catch (error) {
    console.error('Erreur lors de l\'analyse historique:', error);
    throw error;
  }
};

// Calcul de l'impact
const calculateImpact = (reclamation, textAnalysis, historicalAnalysis) => {
  const baseImpact = 100;
  let financialImpact = baseImpact;
  
  // Ajustement basé sur le sentiment
  if (textAnalysis.sentiment.score < 30) financialImpact *= 1.5;
  
  // Ajustement basé sur l'urgence
  if (textAnalysis.urgency === 'HAUTE') financialImpact *= 1.3;
  
  // Ajustement basé sur l'historique
  financialImpact *= (1 + (historicalAnalysis.similarCount * 0.1));
  
  return {
    financialImpact: Math.round(financialImpact),
    estimatedResolutionTime: Math.ceil(financialImpact / 100),
    priority: financialImpact > 200 ? 'HAUTE' : 'NORMALE'
  };
};

// Export de la fonction principale d'analyse
export const analyzeReclamation = async (reclamation) => {
  try {
    // Analyse du texte
    const textAnalysis = {
      sentiment: analyzeSentiment(reclamation.description),
      urgency: determineUrgency(reclamation.description),
      keywords: extractKeywords(reclamation.description)
    };

    // Analyse d'image
    let imageAnalysis = null;
    if (reclamation.imageUrl) {
      imageAnalysis = await analyzeImage(reclamation.imageUrl);
    }

    // Analyse historique
    const historicalAnalysis = await analyzeHistory(reclamation);

    // Analyse d'impact
    const impactAnalysis = calculateImpact(reclamation, textAnalysis, historicalAnalysis);

    return {
      textAnalysis,
      imageAnalysis,
      historicalAnalysis,
      impactAnalysis
    };
  } catch (error) {
    console.error('Erreur lors de l\'analyse complète:', error);
    throw error;
  }
};

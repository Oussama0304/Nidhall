const natural = require('natural');
const OpenAI = require('openai');
const db = require('../config/db');
const path = require('path');
const imageAnalysisService = require('./imageAnalysis.service');

class AnalysisService {
    constructor() {
        this.classifier = new natural.BayesClassifier();
        // Utiliser 'English' comme langue par défaut car le français n'est pas supporté nativement
        this.sentiment = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
        this.tokenizer = new natural.WordTokenizer();
        this.openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
        this.initializeClassifier();

        // Dictionnaire de mots positifs/négatifs en français
        this.frenchSentimentWords = {
            positif: ['excellent', 'parfait', 'super', 'génial', 'satisfait', 'content', 'heureux', 'efficace', 'rapide', 'bien'],
            negatif: ['mauvais', 'terrible', 'horrible', 'insatisfait', 'mécontent', 'lent', 'défectueux', 'problème', 'panne', 'erreur']
        };
    }

    async initializeClassifier() {
        const technicalExamples = [
            "panne équipement",
            "problème technique",
            "dysfonctionnement",
            "maintenance",
            "réparation",
            "moteur",
            "pompe",
            "fuite",
            "électrique",
            "mécanique"
        ];

        const commercialExamples = [
            "problème de paiement",
            "retard livraison",
            "commande incorrecte",
            "service client",
            "facturation",
            "prix",
            "remboursement",
            "délai",
            "commercial",
            "contrat"
        ];

        technicalExamples.forEach(ex => this.classifier.addDocument(ex, 'TECHNIQUE'));
        commercialExamples.forEach(ex => this.classifier.addDocument(ex, 'COMMERCIALE'));
        this.classifier.train();
    }

    async analyzeReclamation(reclamationData) {
        try {
            console.log('Début de l\'analyse de la réclamation:', reclamationData.idReclamation);
            
            // Analyse de texte
            const textAnalysis = {
                sentiment_score: await this.analyzeFrenchSentiment(reclamationData.description),
                category: this.classifier.classify(reclamationData.description),
                keywords: this.extractKeywords(reclamationData.description),
                urgency: this.determineUrgency(reclamationData.description)
            };
            console.log('Analyse de texte terminée:', textAnalysis);

            // Analyse d'image si présente
            let imageAnalysis = null;
            if (reclamationData.image_url) {
                imageAnalysis = await imageAnalysisService.analyzeImage(reclamationData.image_url);
                console.log('Analyse d\'image terminée:', imageAnalysis);
            }

            // Générer des prédictions
            const predictions = {
                estimatedTime: reclamationData.estimatedResolutionTime || 72,
                suggestedPriority: this.determinePriority(textAnalysis),
                aiSuggestions: await this.generateSuggestions(reclamationData),
                confidence: 0.85
            };
            console.log('Prédictions générées:', predictions);

            // Sauvegarder l'analyse
            await this.saveAnalysis(reclamationData.idReclamation, {
                text_analysis: textAnalysis,
                image_analysis: imageAnalysis,
                predictions: predictions
            });
            console.log('Analyse sauvegardée avec succès');

            // Retourner les résultats structurés
            return {
                text_analysis: textAnalysis,
                image_analysis: imageAnalysis,
                predictions: predictions
            };
        } catch (error) {
            console.error('Erreur lors de l\'analyse:', error);
            throw error;
        }
    }

    async performTextAnalysis(text) {
        if (!text) return {
            sentiment_score: 0,
            category: 'INDÉTERMINÉ',
            keywords: [],
            urgency: 'NORMAL'
        };

        // Analyse de sentiment personnalisée pour le français
        const sentimentScore = this.analyzeFrenchSentiment(text.toLowerCase());
        const category = this.classifier.classify(text);
        const keywords = this.extractKeywords(text);
        const urgency = this.determineUrgency(text);
        
        return {
            sentiment_score: sentimentScore,
            category,
            keywords,
            urgency
        };
    }

    analyzeFrenchSentiment(text) {
        let score = 0;
        const words = text.split(/\s+/);
        
        words.forEach(word => {
            if (this.frenchSentimentWords.positif.includes(word)) score += 1;
            if (this.frenchSentimentWords.negatif.includes(word)) score -= 1;
        });

        // Normaliser le score entre -1 et 1
        return score === 0 ? 0 : score / Math.max(Math.abs(score), 1);
    }

    async generatePredictions(reclamation) {
        try {
            let aiSuggestions = [];
            
            if (this.openai) {
                const completion = await this.openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "Vous êtes un expert en analyse de réclamations techniques et commerciales."
                        },
                        {
                            role: "user",
                            content: `Analyser cette réclamation et proposer des solutions (en français): ${reclamation.description}`
                        }
                    ]
                });
                aiSuggestions = completion.choices[0].message.content.split('\n');
            } else {
                aiSuggestions = this.getDefaultSuggestions(reclamation.type);
            }

            return {
                estimatedTime: this.calculateEstimatedTime(reclamation),
                suggestedPriority: this.determinePriority(reclamation),
                aiSuggestions,
                confidence: 0.85
            };
        } catch (error) {
            console.error('Erreur lors de la génération des prédictions:', error);
            return {
                estimatedTime: 48,
                suggestedPriority: 'MOYEN',
                aiSuggestions: this.getDefaultSuggestions(reclamation.type),
                confidence: 0.7
            };
        }
    }

    async generateSuggestions(reclamationData) {
        try {
            let aiSuggestions = [];
            
            if (this.openai) {
                const completion = await this.openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "Vous êtes un expert en analyse de réclamations techniques et commerciales."
                        },
                        {
                            role: "user",
                            content: `Analyser cette réclamation et proposer des solutions (en français): ${reclamationData.description}`
                        }
                    ]
                });
                aiSuggestions = completion.choices[0].message.content.split('\n');
            } else {
                aiSuggestions = this.getDefaultSuggestions(reclamationData.type);
            }

            return aiSuggestions;
        } catch (error) {
            console.error('Erreur lors de la génération des suggestions:', error);
            return this.getDefaultSuggestions(reclamationData.type);
        }
    }

    getDefaultSuggestions(type) {
        const suggestions = {
            TECHNIQUE: [
                "Effectuer un diagnostic technique approfondi",
                "Vérifier les composants matériels",
                "Planifier une intervention de maintenance",
                "Documenter les problèmes techniques rencontrés"
            ],
            COMMERCIALE: [
                "Examiner l'historique des transactions",
                "Vérifier les paramètres de paiement",
                "Contacter le service client",
                "Proposer une solution commerciale adaptée"
            ]
        };
        return suggestions[type] || suggestions.TECHNIQUE;
    }

    async saveAnalysis(reclamationId, analysisData) {
        try {
            const query = `
                INSERT INTO RECLAMATIONANALYTICS 
                (idReclamation, text_analysis, image_analysis, predictions, metadata)
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                text_analysis = VALUES(text_analysis),
                image_analysis = VALUES(image_analysis),
                predictions = VALUES(predictions),
                metadata = VALUES(metadata)
            `;
            
            await db.query(query, [
                reclamationId,
                JSON.stringify(analysisData.text_analysis),
                JSON.stringify(analysisData.image_analysis),
                JSON.stringify(analysisData.predictions),
                JSON.stringify({ analyzed_at: new Date().toISOString(), reclamation_id: reclamationId })
            ]);

            // Mettre à jour la réclamation avec les nouvelles informations
            const updateQuery = `
                UPDATE RECLAMATION
                SET 
                    sentiment_score = ?,
                    priority = ?,
                    estimatedResolutionTime = ?,
                    categories = ?,
                    keywords = ?
                WHERE idReclamation = ?
            `;

            await db.query(updateQuery, [
                analysisData.text_analysis.sentiment_score,
                analysisData.predictions.suggestedPriority,
                analysisData.predictions.estimatedTime,
                JSON.stringify(analysisData.text_analysis.category),
                JSON.stringify(analysisData.text_analysis.keywords),
                reclamationId
            ]);

            return true;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'analyse:', error);
            throw error;
        }
    }

    extractKeywords(text) {
        if (!text) return [];
        const tokens = this.tokenizer.tokenize(text.toLowerCase());
        return tokens.filter(token => token.length > 3);
    }

    determineUrgency(text) {
        if (!text) return 'NORMAL';
        const urgentWords = ['urgent', 'immédiat', 'critique', 'grave'];
        const tokens = this.tokenizer.tokenize(text.toLowerCase());
        const urgencyScore = tokens.filter(token => urgentWords.includes(token)).length;
        return urgencyScore > 0 ? 'URGENT' : 'NORMAL';
    }

    calculateEstimatedTime(reclamation) {
        const baseTime = {
            TECHNIQUE: 72,
            COMMERCIALE: 48
        };
        return baseTime[reclamation.type] || 48;
    }

    determinePriority(reclamation) {
        if (reclamation.type === 'TECHNIQUE') {
            return 'HAUTE';
        }
        return 'MOYEN';
    }
}

module.exports = new AnalysisService();

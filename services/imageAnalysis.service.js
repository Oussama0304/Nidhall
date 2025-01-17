const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

class ImageAnalysisService {
    constructor() {
        this.panneCategories = {
            POMPE: {
                keywords: ['pompe', 'pump', 'nozzle', 'dispenser'],
                issues: [
                    'Fuite au niveau de la pompe',
                    'Problème de débit',
                    'Affichage digital défectueux',
                    'Problème de compteur',
                    'Usure des joints'
                ]
            },
            RESERVOIR: {
                keywords: ['reservoir', 'tank', 'storage'],
                issues: [
                    'Fuite potentielle',
                    'Problème de jauge',
                    'Contamination possible',
                    'Problème de ventilation'
                ]
            },
            TUYAUTERIE: {
                keywords: ['tuyau', 'pipe', 'hose', 'line'],
                issues: [
                    'Fuite dans la tuyauterie',
                    'Usure des conduites',
                    'Problème de joint',
                    'Corrosion visible'
                ]
            },
            ELECTRONIQUE: {
                keywords: ['electronic', 'display', 'screen', 'circuit'],
                issues: [
                    'Panne d\'affichage',
                    'Problème de circuit électrique',
                    'Dysfonctionnement du système de paiement',
                    'Erreur de communication'
                ]
            },
            SECURITE: {
                keywords: ['security', 'safety', 'emergency', 'warning'],
                issues: [
                    'Problème d\'arrêt d\'urgence',
                    'Dysfonctionnement des alarmes',
                    'Signalisation défectueuse'
                ]
            }
        };
    }

    async analyzeImage(imagePath) {
        try {
            // Vérifier si l'image existe
            if (!fs.existsSync(imagePath)) {
                throw new Error('Image non trouvée');
            }

            // Analyser les métadonnées de l'image
            const metadata = await sharp(imagePath).metadata();
            
            // Effectuer une analyse basique de l'image
            const analysis = {
                format: metadata.format,
                width: metadata.width,
                height: metadata.height,
                size: metadata.size,
                quality: this.evaluateImageQuality(metadata),
                suggestedIssues: []
            };

            // Ajouter des suggestions basées sur le type de réclamation
            analysis.suggestedIssues = this.getSuggestedIssues('POMPE');

            return analysis;
        } catch (error) {
            console.error('Erreur lors de l\'analyse de l\'image:', error);
            throw error;
        }
    }

    evaluateImageQuality(metadata) {
        // Évaluer la qualité de l'image basée sur la résolution
        const minAcceptableResolution = 800 * 600;
        const imageResolution = metadata.width * metadata.height;
        
        if (imageResolution < minAcceptableResolution) {
            return 'FAIBLE';
        } else if (imageResolution < minAcceptableResolution * 2) {
            return 'MOYENNE';
        } else {
            return 'BONNE';
        }
    }

    getSuggestedIssues(category) {
        // Retourner les problèmes suggérés pour une catégorie donnée
        if (this.panneCategories[category]) {
            return this.panneCategories[category].issues;
        }
        return [];
    }

    async saveAnalysisResult(reclamationId, analysisResult) {
        try {
            // Sauvegarder le résultat dans la base de données
            const query = `
                INSERT INTO ReclamationAnalytics 
                (idReclamation, image_analysis)
                VALUES (?, ?)
                ON DUPLICATE KEY UPDATE
                image_analysis = VALUES(image_analysis)
            `;
            
            await db.query(query, [
                reclamationId,
                JSON.stringify(analysisResult)
            ]);

            return true;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'analyse:', error);
            throw error;
        }
    }
}

module.exports = new ImageAnalysisService();

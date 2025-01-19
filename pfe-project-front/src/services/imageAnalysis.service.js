import axios from 'axios';
import { API_URL } from '../config';

class ImageAnalysisService {
    async analyzeImage(imageData, claimId, claimType) {
        try {
            const response = await axios.post(
                `${API_URL}/analyze-image`,
                {
                    imageData,
                    claimId,
                    claimType
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error analyzing image:', error);
            throw error;
        }
    }

    getMaintenanceRecommendations(analysis) {
        const { severity, technicalAnalysis } = analysis;
        
        const recommendations = {
            actions: [],
            preventive: [],
            timeline: this.getTimelineRecommendation(severity),
            costs: this.estimateCosts(severity, technicalAnalysis)
        };

        // Add maintenance actions based on technical analysis
        if (technicalAnalysis.issues) {
            technicalAnalysis.issues.forEach(issue => {
                recommendations.actions.push({
                    action: `Vérifier et réparer: ${issue}`,
                    priority: this.getIssuePriority(issue)
                });
            });
        }

        // Add preventive measures
        if (analysis.maintenanceRecommendations) {
            recommendations.preventive = analysis.maintenanceRecommendations;
        }

        return recommendations;
    }

    getTimelineRecommendation(severity) {
        const now = new Date();
        switch (severity.level) {
            case 'HAUTE':
                return {
                    deadline: new Date(now.getTime() + 24 * 60 * 60 * 1000),
                    estimatedDuration: '2-4 heures',
                    priority: 'URGENT'
                };
            case 'MOYENNE':
                return {
                    deadline: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
                    estimatedDuration: '4-8 heures',
                    priority: 'NORMAL'
                };
            default:
                return {
                    deadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
                    estimatedDuration: '1-2 jours',
                    priority: 'FAIBLE'
                };
        }
    }

    estimateCosts(severity, technicalAnalysis) {
        let baseCost = 0;
        
        // Calculate base cost based on issues
        if (technicalAnalysis.issues) {
            technicalAnalysis.issues.forEach(issue => {
                if (issue.includes('Fuite')) baseCost += 500;
                else if (issue.includes('Panne')) baseCost += 300;
                else baseCost += 200;
            });
        }

        // Apply severity multiplier
        const multiplier = severity.level === 'HAUTE' ? 1.5 :
                         severity.level === 'MOYENNE' ? 1.2 : 1;

        const totalCost = Math.round(baseCost * multiplier);

        return {
            estimatedCost: totalCost,
            currency: 'EUR',
            breakdown: {
                materiel: Math.round(totalCost * 0.6),
                mainDoeuvre: Math.round(totalCost * 0.3),
                autres: Math.round(totalCost * 0.1)
            }
        };
    }

    getIssuePriority(issue) {
        if (issue.includes('Fuite') || issue.includes('Sécurité')) return 'HAUTE';
        if (issue.includes('Panne') || issue.includes('Dysfonctionnement')) return 'MOYENNE';
        return 'FAIBLE';
    }
}

const imageAnalysisServiceInstance = new ImageAnalysisService();
export default imageAnalysisServiceInstance;

import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};

export const analysisService = {
    // Analyse complète d'une réclamation
    analyzeReclamation: (reclamationData) => 
        axios.post(API_ENDPOINTS.ANALYSIS.ANALYZE_RECLAMATION, reclamationData, getAuthHeader()),

    // Analyse d'image
    analyzeImage: (formData) => 
        axios.post(API_ENDPOINTS.ANALYSIS.ANALYZE_IMAGE, formData, {
            ...getAuthHeader(),
            headers: {
                ...getAuthHeader().headers,
                'Content-Type': 'multipart/form-data'
            }
        }),

    // Obtenir les métriques de performance
    getPerformanceMetrics: () => 
        axios.get(API_ENDPOINTS.ANALYSIS.PERFORMANCE_METRICS, getAuthHeader()),

    // Obtenir l'historique des analyses
    getAnalysisHistory: (reclamationId) => 
        axios.get(API_ENDPOINTS.ANALYSIS.ANALYSIS_HISTORY(reclamationId), getAuthHeader()),

    // Obtenir les suggestions pour une réclamation
    getSuggestions: (reclamationId) => 
        axios.get(API_ENDPOINTS.ANALYSIS.SUGGESTIONS(reclamationId), getAuthHeader()),
};

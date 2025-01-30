const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
    BASE_URL: `${API_BASE_URL}/api`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    DASHBOARD_STATS: `${API_BASE_URL}/api/admin/dashboard/stats`,
    DASHBOARD_ACTIVITIES: `${API_BASE_URL}/api/admin/dashboard/activities`,
    COMMANDES_STATS: `${API_BASE_URL}/api/admin/dashboard/commandes/stats`,
    RECLAMATIONS_STATS: `${API_BASE_URL}/api/admin/dashboard/reclamations/stats`,
    USER_COMMANDES: `${API_BASE_URL}/api/commandes/user`,
    USER_RECLAMATIONS: `${API_BASE_URL}/api/reclamations/user`,
    USER_PROFILE: `${API_BASE_URL}/api/auth/profile`,  
    ANALYSIS: {
        ANALYZE_RECLAMATION: `${API_BASE_URL}/api/analysis/analyze-reclamation`,
        ANALYZE_IMAGE: `${API_BASE_URL}/api/analysis/image`,
        PERFORMANCE_METRICS: `${API_BASE_URL}/api/analysis/performance-metrics`,
        ANALYSIS_HISTORY: (id) => `${API_BASE_URL}/api/analysis/history/${id}`,
        SUGGESTIONS: (id) => `${API_BASE_URL}/api/analysis/suggestions/${id}`,
    }
};

export default API_ENDPOINTS;

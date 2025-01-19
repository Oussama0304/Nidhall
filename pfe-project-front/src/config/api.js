const API_BASE_URL = 'http://localhost:3000/api';

export const API_ENDPOINTS = {
    BASE_URL: API_BASE_URL,
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    DASHBOARD_STATS: `${API_BASE_URL}/admin/dashboard/stats`,
    DASHBOARD_ACTIVITIES: `${API_BASE_URL}/admin/dashboard/activities`,
    COMMANDES_STATS: `${API_BASE_URL}/admin/dashboard/commandes/stats`,
    RECLAMATIONS_STATS: `${API_BASE_URL}/admin/dashboard/reclamations/stats`,
    USER_COMMANDES: `${API_BASE_URL}/commandes/user`,
    USER_RECLAMATIONS: `${API_BASE_URL}/reclamations/user`,
    USER_PROFILE: `${API_BASE_URL}/auth/profile`,  
    ANALYSIS: {
        ANALYZE_RECLAMATION: `${API_BASE_URL}/analysis/analyze-reclamation`,
        ANALYZE_IMAGE: `${API_BASE_URL}/analysis/image`,
        PERFORMANCE_METRICS: `${API_BASE_URL}/analysis/performance-metrics`,
        ANALYSIS_HISTORY: (id) => `${API_BASE_URL}/analysis/history/${id}`,
        SUGGESTIONS: (id) => `${API_BASE_URL}/analysis/suggestions/${id}`,
    }
};

export default API_ENDPOINTS;

import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 30000, // Augmenter le timeout à 30 secondes
    withCredentials: true // Ajouter cette option pour les cookies
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('API Request:', {
            url: config.url,
            method: config.method,
            baseURL: config.baseURL,
            headers: config.headers
        });
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('API Response Error:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.message,
            data: error.response?.data
        });
        
        if (error.response) {
            if (error.response.status === 401) {
                // Token expiré ou invalide
                localStorage.removeItem('token');
                window.location.href = '/login';
            } else if (error.response.status === 403) {
                // Accès refusé
                console.error('Accès refusé');
            }
        } else if (error.request) {
            // La requête a été faite mais pas de réponse
            console.error('Pas de réponse du serveur');
        } else {
            // Erreur lors de la configuration de la requête
            console.error('Erreur de configuration de la requête');
        }
        
        return Promise.reject(error);
    }
);

export default api;

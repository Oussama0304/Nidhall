import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Configuration de l'intercepteur pour ajouter le token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const depotService = {
  // Récupérer les commandes validées
  getValidatedOrders: async () => {
    try {
      const response = await axios.get(`${API_URL}/commandes/validees`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer toutes les stations
  getAllStations: async () => {
    try {
      const response = await axios.get(`${API_URL}/stations`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Affecter une commande à une station
  assignOrderToStation: async (orderId, stationId) => {
    try {
      const response = await axios.post(`${API_URL}/commandes/${orderId}/affecter-station`, {
        stationId: stationId
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default depotService;

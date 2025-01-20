import * as tf from '@tensorflow/tfjs';

// Calcul du score de capacité
export const getCapacityScore = (station, commande) => {
  const capacityRatio = station.capacite / commande.quantite;
  return Math.min(capacityRatio, 1); // Normalise entre 0 et 1
};

// Calcul du score de distance
export const getDistanceScore = (stationLocation, depotLocation) => {
  const distance = calculateDistance(stationLocation, depotLocation);
  const maxDistance = 100; // Distance maximale considérée
  return 1 - (distance / maxDistance); // Plus proche = meilleur score
};

// Calcul du score d'urgence
export const getUrgencyScore = (station) => {
  const stockRatio = station.stockActuel / station.capacite;
  return 1 - stockRatio; // Moins de stock = plus urgent
};

// Calcul du score historique
export const getHistoryScore = (station, commande) => {
  const successfulDeliveries = station.historiqueCommandes?.filter(h => h.status === 'success')?.length || 0;
  const totalDeliveries = station.historiqueCommandes?.length || 1;
  return successfulDeliveries / totalDeliveries;
};

// Calcul de la distance entre deux points
export const calculateDistance = (point1, point2) => {
  if (!point1 || !point2) return 0;
  const R = 6371; // Rayon de la Terre en km
  const lat1 = toRad(point1.lat);
  const lat2 = toRad(point2.lat);
  const dLat = toRad(point2.lat - point1.lat);
  const dLon = toRad(point2.lon - point1.lon);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1) * Math.cos(lat2) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Conversion en radians
const toRad = (value) => value * Math.PI / 180;

// Système de recommandation intelligent
export const getDeliveryRecommendations = async (commandes, stations, depotLocation) => {
  // Création d'un modèle simple pour le score
  const calculateScore = (station, commande) => {
    const capacityScore = getCapacityScore(station, commande);
    const distanceScore = getDistanceScore(station.location, depotLocation);
    const urgencyScore = getUrgencyScore(station);
    const historyScore = getHistoryScore(station, commande);

    return (capacityScore + distanceScore + urgencyScore + historyScore) / 4;
  };

  return commandes.map(commande => {
    const stationScores = stations.map(station => {
      const score = calculateScore(station, commande);
      
      return {
        station,
        score,
        metrics: {
          capacity: getCapacityScore(station, commande),
          distance: getDistanceScore(station.location, depotLocation),
          urgency: getUrgencyScore(station),
          history: getHistoryScore(station, commande)
        }
      };
    });

    return {
      commande,
      recommendations: stationScores.sort((a, b) => b.score - a.score)
    };
  });
};

// Prédiction du temps de livraison
export const predictDeliveryTime = async (commande, station, depotLocation) => {
  // Calcul simple du temps de livraison basé sur la distance
  const distance = calculateDistance(depotLocation, station.location);
  const averageSpeed = 50; // km/h
  const baseTime = (distance / averageSpeed) * 60; // Conversion en minutes

  // Facteurs d'ajustement
  const trafficFactor = getCurrentTrafficFactor();
  const timeFactor = getTimeOfDayFactor();
  const weatherFactor = getWeatherFactor();

  return Math.round(baseTime * trafficFactor * timeFactor * weatherFactor);
};

// Obtenir le facteur de trafic actuel
const getCurrentTrafficFactor = () => {
  const hour = new Date().getHours();
  // Heures de pointe : 8-10h et 16-19h
  if ((hour >= 8 && hour <= 10) || (hour >= 16 && hour <= 19)) {
    return 1.5; // 50% plus long pendant les heures de pointe
  }
  return 1.0;
};

// Obtenir le facteur selon l'heure
const getTimeOfDayFactor = () => {
  const hour = new Date().getHours();
  // Meilleurs heures : 10-16h
  if (hour >= 10 && hour <= 16) {
    return 1.0;
  }
  return 1.2; // 20% plus long en dehors des heures optimales
};

// Obtenir le facteur météo (à implémenter avec une API météo)
const getWeatherFactor = () => {
  // Simulation - à remplacer par une vraie API météo
  return 1.0;
};

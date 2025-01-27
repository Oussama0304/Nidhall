const initializeUtilisateurData = require('./initUtilisateurData');
const initializeStationData = require('./initStationData');
const initializeProduitData = require('./initProduitData');
const initializeCommandeData = require('./initCommandeData');
const initializeCommandeproduitData = require('./initCommandeproduitData');
const initializeLivraisonData = require('./initLivraisonData');
const initializeMouvementstockData = require('./initMouvementstockData');

async function initializeAllData() {
    try {
        console.log('Démarrage de l\'initialisation des données...');

        // Initialiser les utilisateurs en premier car ils sont référencés par d'autres tables
        await initializeUtilisateurData();

        // Initialiser les stations service
        await initializeStationData();

        // Initialiser les produits
        await initializeProduitData();

        // Initialiser les commandes
        await initializeCommandeData();

        // Initialiser les commandes-produits
        await initializeCommandeproduitData();

        // Initialiser les livraisons
        await initializeLivraisonData();

        // Initialiser les mouvements de stock
        await initializeMouvementstockData();

        console.log('Toutes les données ont été initialisées avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des données:', error);
        throw error;
    }
}

module.exports = initializeAllData;

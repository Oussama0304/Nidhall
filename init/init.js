const initializeUtilisateurData = require('./initUtilisateurData');
const initializeStationData = require('./initStationData');
const initializeGerantData = require('./initGerantData');
const initializeProduitData = require('./initProduitData');
const initializeMaterialData = require('./initMaterialData');
const initializeCommandeData = require('./initCommandeData');
const initializeCommandeProduitData = require('./initCommandeProduitData');
const initializeLivraisonData = require('./initLivraisonData');
const initializeMouvementStockData = require('./initMouvementStockData');
const initializeReclamationData = require('./initReclamationData');

async function initializeAllData() {
    try {
        // 1. Initialiser les utilisateurs (nécessaire pour les gérants et les commandes)
        await initializeUtilisateurData();

        // 2. Initialiser les stations (nécessaire pour les gérants et le matériel)
        await initializeStationData();

        // 3. Initialiser les gérants (dépend des utilisateurs et des stations)
        await initializeGerantData();

        // 4. Initialiser les produits (nécessaire pour les commandes)
        await initializeProduitData();

        // 5. Initialiser le matériel (dépend des stations)
        await initializeMaterialData();

        // 6. Initialiser les commandes (dépend des utilisateurs et des produits)
        await initializeCommandeData();

        // 7. Initialiser les relations commande-produit (dépend des commandes et des produits)
        await initializeCommandeProduitData();

        // 8. Initialiser les livraisons (dépend des commandes)
        await initializeLivraisonData();

        // 9. Initialiser les mouvements de stock (dépend des produits et des commandes)
        await initializeMouvementStockData();

        // 10. Initialiser les réclamations (dépend des gérants)
        await initializeReclamationData();

        console.log('Toutes les données ont été initialisées avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des données:', error);
        throw error;
    }
}

module.exports = initializeAllData;

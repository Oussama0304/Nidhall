const initUtilisateurData = require('./initUtilisateurData');
const initMaterialData = require('./initMaterialData');
const initGerantData = require('./initGerantData');
const initProduitData = require('./initProduitData');
const initImageAnalysisData = require('./initImageAnalysisData');

async function initializeDatabase() {
    try {
        console.log('Début de l\'initialisation de la base de données...');

        // 1. D'abord les utilisateurs car ils sont référencés par d'autres tables
        await initUtilisateurData();

        // 2. Ensuite les gérants car ils sont liés aux stations
        await initGerantData();

        // 3. Les matériels car ils sont liés aux stations
        await initMaterialData();

        // 4. Les produits car ils sont référencés par les commandes
        await initProduitData();

        // 5. La table d'analyse d'images
        await initImageAnalysisData();

        console.log('Base de données initialisée avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données:', error);
        throw error;
    }
}

module.exports = initializeDatabase;

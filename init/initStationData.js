const db = require('../config/db');

async function initializeStationData() {
    try {
        // Vérifier si la table StationService est vide
        const results = await db.query('SELECT COUNT(*) as count FROM StationService');
        const count = results[0].count;

        if (count === 0) {
            console.log('Initialisation des données des stations service...');
            
            await db.query(`
                INSERT INTO StationService (idStation, nom, adresse, ville, telephone, email, capacite)
                VALUES
                (1, 'Station Test', '123 Rue Test', NULL, NULL, NULL, NULL),
                (2, 'station bardo', '124 Rue ', NULL, NULL, NULL, NULL),
                (3, 'station ariana', '124 Rue ', 'ariana', '1478526', 'station.test@pfe.tn', 500),
                (4, 'station centre ville', '101 Rue ', 'Tunis', '1478526', 'station.test@pfe.tn', 500),
                (5, 'station bizerte', '101 Rue ', 'Tunis', '2659375', 'station.test@pfe.tn', 500),
                (6, 'station  nabeul', '101 Rue ', 'nabeul', '2659375', 'stationnabeul.test@pfe.tn', 300),
                (7, 'station ben arous', '123 Rue Test', 'Tunis', '12345678', 'station.test@pfe.tn', 400)
            `);

            console.log('Données des stations service initialisées avec succès');
        } else {
            console.log('La table StationService contient déjà des données');
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des stations service:', error);
        throw error;
    }
}

module.exports = initializeStationData;

const db = require('../config/db');

async function initializeStationData() {
    try {
        // Vérifier si la table StationService est vide
        const [result] = await db.execute('SELECT COUNT(*) as count FROM StationService');
        const count = result[0].count;

        if (count === 0) {
            console.log('Initialisation des données des stations...');

            const insertQuery = `
                INSERT INTO StationService (nom, adresse, ville, telephone, email, capacite) VALUES
                ('Station Test', '123 Rue Test', NULL, NULL, NULL, NULL),
                ('station bardo', '124 Rue', NULL, NULL, NULL, NULL),
                ('station ariana', '124 Rue', 'ariana', '1478526', 'station.test@pfe.tn', 500),
                ('station centre ville', '101 Rue', 'Tunis', '1478526', 'station.test@pfe.tn', 500),
                ('station bizerte', '101 Rue', 'Tunis', '2659375', 'station.test@pfe.tn', 500),
                ('station  nabeul', '101 Rue', 'nabeul', '2659375', 'stationnabeul.test@pfe.tn', 300),
                ('station ben arous', '123 Rue Test', 'Tunis', '12345678', 'station.test@pfe.tn', 400)`;

            await db.execute(insertQuery);
            console.log('Données des stations initialisées avec succès');
        } else {
            console.log('La table StationService contient déjà des données');
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des stations:', error);
        throw error;
    }
}

module.exports = initializeStationData;

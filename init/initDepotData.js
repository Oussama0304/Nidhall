const db = require('../config/db');

async function initializeDepotData() {
    try {
        // Vérifier si la table Depot est vide
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM Depot');
        const count = rows[0].count;

        if (count === 0) {
            console.log('Initialisation des données des dépôts...');
            
            await db.execute(`
                INSERT INTO Depot (idDepot, nomDepot, adresse, ville, telephone, email, capacite) VALUES
                (1, 'depot tunis', '124 Rue ', 'Tunis', '1478526', 'station.test@pfe.tn', 500),
                (2, 'station bardo', '124 Rue ', NULL, NULL, NULL, NULL),
                (3, 'station ariana', '124 Rue ', 'ariana', '1478526', 'station.test@pfe.tn', 500),
                (4, 'station centre ville', '101 Rue ', 'Tunis', '1478526', 'station.test@pfe.tn', 500),
                (5, 'station bizerte', '101 Rue ', 'Tunis', '2659375', 'station.test@pfe.tn', 500),
                (6, 'station  nabeul', '101 Rue ', 'nabeul', '2659375', 'stationnabeul.test@pfe.tn', 300),
                (7, 'station ben arous', '123 Rue Test', 'Tunis', '12345678', 'station.test@pfe.tn', 400)
            `);

            console.log('Données des dépôts initialisées avec succès');
        } else {
            console.log('La table Depot contient déjà des données');
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des dépôts:', error);
        throw error;
    }
}

module.exports = initializeDepotData;

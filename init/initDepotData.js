const db = require('../config/db');

async function initializeDepotData() {
    try {
        // Vérifier si la table Depot est vide
        const checkQuery = 'SELECT COUNT(*) as count FROM Depot';
        db.query(checkQuery, async (err, results) => {
            if (err) {
                console.error('Erreur lors de la vérification des données:', err);
                return;
            }

            const count = results[0].count;
            if (count === 0) {
                console.log('Initialisation des données des dépôts...');
                
                const insertQuery = `
                    INSERT INTO Depot (nomDepot, adresse) VALUES
                    ('Depot Central', '123 Rue Principale, Tunis'),
                    ('Depot Nord', '456 Avenue du Nord, Bizerte'),
                    ('Depot Sud', '789 Boulevard du Sud, Sfax')
                `;

                db.query(insertQuery, (err, results) => {
                    if (err) {
                        console.error('Erreur lors de l\'initialisation des données des dépôts:', err);
                    } else {
                        console.log('Données des dépôts insérées avec succès');
                    }
                });
            } else {
                console.log('Les données existent déjà dans la table Depot');
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des dépôts:', error);
    }
}

module.exports = initializeDepotData;

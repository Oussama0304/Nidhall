const db = require('../config/db');

async function initializeLivraisonData() {
    try {
        // Vérifier si la table Livraison est vide
        const checkQuery = 'SELECT COUNT(*) as count FROM Livraison';
        db.query(checkQuery, async (err, results) => {
            if (err) {
                console.error('Erreur lors de la vérification des données:', err);
                return;
            }

            const count = results[0].count;
            if (count === 0) {
                console.log('Initialisation des données des livraisons...');
                
                const insertQuery = `
                    INSERT INTO Livraison (idCommande, dateLivraison, numChauffeur, quantiteLv) VALUES
                    (1, '2024-12-02 15:00:00', 5001, 2500),
                    (2, '2024-12-03 16:30:00', 5002, 4000)
                `;

                db.query(insertQuery, (err, results) => {
                    if (err) {
                        console.error('Erreur lors de l\'initialisation des données des livraisons:', err);
                    } else {
                        console.log('Données des livraisons insérées avec succès');
                    }
                });
            } else {
                console.log('Les données existent déjà dans la table Livraison');
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des livraisons:', error);
    }
}

module.exports = initializeLivraisonData;

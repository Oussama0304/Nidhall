const db = require('../config/db');

async function initializeCommandeProduitData() {
    try {
        // Vérifier si la table Commandeproduit est vide
        const checkQuery = 'SELECT COUNT(*) as count FROM Commandeproduit';
        db.query(checkQuery, async (err, results) => {
            if (err) {
                console.error('Erreur lors de la vérification des données:', err);
                return;
            }

            const count = results[0].count;
            if (count === 0) {
                console.log('Initialisation des données des commandes-produits...');
                
                const insertQuery = `
                    INSERT INTO Commandeproduit (idCommande, idProduit, quantite, prix) VALUES
                    (1, 1, 100, 2100.00),
                    (2, 2, 150, 1800.00),
                    (3, 3, 80, 1000.00)
                `;

                db.query(insertQuery, (err, results) => {
                    if (err) {
                        console.error('Erreur lors de l\'initialisation des données des commandes-produits:', err);
                    } else {
                        console.log('Données des commandes-produits insérées avec succès');
                    }
                });
            } else {
                console.log('Les données existent déjà dans la table Commandeproduit');
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des commandes-produits:', error);
    }
}

module.exports = initializeCommandeProduitData;

const db = require('../config/db');

async function initializeMouvementStockData() {
    try {
        // Vérifier si la table Mouvementstock est vide
        const checkQuery = 'SELECT COUNT(*) as count FROM Mouvementstock';
        db.query(checkQuery, async (err, results) => {
            if (err) {
                console.error('Erreur lors de la vérification des données:', err);
                return;
            }

            const count = results[0].count;
            if (count === 0) {
                console.log('Initialisation des données des mouvements de stock...');
                
                const insertQuery = `
                    INSERT INTO Mouvementstock (idProduit, quantite, type_mouvement, date_mouvement, idCommande, raison) VALUES
                    (1, 100, 'ENTREE', '2024-12-01 10:30:00', 1, 'Livraison fournisseur'),
                    (2, -50, 'RETRAIT', '2024-12-02 11:45:00', 2, 'Vente client'),
                    (3, 30, 'AJUSTEMENT', '2024-12-03 14:30:00', 3, 'Correction inventaire')
                `;

                db.query(insertQuery, (err, results) => {
                    if (err) {
                        console.error('Erreur lors de l\'initialisation des données des mouvements de stock:', err);
                    } else {
                        console.log('Données des mouvements de stock insérées avec succès');
                    }
                });
            } else {
                console.log('Les données existent déjà dans la table Mouvementstock');
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des mouvements de stock:', error);
    }
}

module.exports = initializeMouvementStockData;

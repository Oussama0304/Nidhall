const db = require('../config/db');

async function initializeCommandeData() {
    try {
        // Vérifier si la table Commande est vide
        const checkQuery = 'SELECT COUNT(*) as count FROM Commande';
        db.query(checkQuery, async (err, results) => {
            if (err) {
                console.error('Erreur lors de la vérification des données:', err);
                return;
            }

            const count = results[0].count;
            if (count === 0) {
                console.log('Initialisation des données des commandes...');
                
                const insertQuery = `
                    INSERT INTO Commande (montant, date, idProduit, idUtilisateur, etat, RefCommande, idDepot) VALUES
                    (5000.00, '2024-12-01 10:00:00', 1, 3, 'Validée', 'CMD001', 1),
                    (7500.00, '2024-12-02 11:30:00', 2, 7, 'En cours', 'CMD002', 2),
                    (3200.00, '2024-12-03 14:15:00', 3, 8, 'En instance', 'CMD003', 3)
                `;

                db.query(insertQuery, (err, results) => {
                    if (err) {
                        console.error('Erreur lors de l\'initialisation des données des commandes:', err);
                    } else {
                        console.log('Données des commandes insérées avec succès');
                    }
                });
            } else {
                console.log('Les données existent déjà dans la table Commande');
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des commandes:', error);
    }
}

module.exports = initializeCommandeData;

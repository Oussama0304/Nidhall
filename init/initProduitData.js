const db = require('../config/db');

async function initializeProduitData() {
    try {
        // Vérifier si la table Produit est vide
        const checkQuery = 'SELECT COUNT(*) as count FROM Produit';
        db.query(checkQuery, async (err, results) => {
            if (err) {
                console.error('Erreur lors de la vérification des données:', err);
                return;
            }

            const count = results[0].count;
            if (count === 0) {
                console.log('Initialisation des données des produits...');
                
                const insertQuery = `
                    INSERT INTO Produit (nom, disponibilite, prix, CODPRD, LIBPRD, CODEMB, LIBEMB, TYPPRD, quantite, seuil_alerte) VALUES
                    ('Super Sans Plomb', 'dispo', 2100, 'SSP01', 'Essence Super Sans Plomb', 'L', 'Litre', 'CARBURANT', 5000, 1000),
                    ('Gasoil', 'dispo', 1800, 'GAS01', 'Gasoil Standard', 'L', 'Litre', 'CARBURANT', 8000, 1500),
                    ('GPL', 'dispo', 1000, 'GPL01', 'Gaz de Pétrole Liquéfié', 'L', 'Litre', 'GAZ', 3000, 800)
                `;

                db.query(insertQuery, (err, results) => {
                    if (err) {
                        console.error('Erreur lors de l\'initialisation des données des produits:', err);
                    } else {
                        console.log('Données des produits insérées avec succès');
                    }
                });
            } else {
                console.log('Les données existent déjà dans la table Produit');
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des produits:', error);
    }
}

module.exports = initializeProduitData;

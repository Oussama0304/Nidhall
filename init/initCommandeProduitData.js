const db = require('../config/db');

async function initializeCommandeproduitData() {
    try {
        // Vérifier si la table Commandeproduit est vide
        const results = await db.query('SELECT COUNT(*) as count FROM Commandeproduit');
        const count = results[0].count;

        if (count === 0) {
            console.log('Initialisation des données des commandes produits...');
            
            await db.query(`
                INSERT INTO Commandeproduit (id, idCommande, idProduit, quantite, prix)
                VALUES
                (2, 4, 2, 1, 2800.00),
                (3, 5, 2, 2, 2800.00),
                (4, 6, 2, 1, 2800.00),
                (5, 7, 2, 1, 2800.00),
                (6, 8, 3, 1, 70000.00),
                (7, 9, 2, 1, 2800.00),
                (8, 10, 2, 3, 2800.00),
                (9, 11, 3, 2, 70000.00),
                (10, 12, 3, 1, 70000.00),
                (11, 13, 2, 1, 2800.00),
                (12, 14, 3, 2, 70000.00),
                (13, 15, 7, 3, 52000.00),
                (14, 16, 2, 3, 2800.00),
                (15, 17, 2, 4, 2800.00),
                (16, 18, 2, 4, 2800.00),
                (21, 23, 2, 1, 2800.00),
                (22, 24, 2, 3, 2800.00),
                (23, 24, 5, 1, 68000.00),
                (24, 25, 2, 6, 2800.00)
            `);

            console.log('Données des commandes produits initialisées avec succès');
        } else {
            console.log('La table Commandeproduit contient déjà des données');
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des commandes produits:', error);
        throw error;
    }
}

module.exports = initializeCommandeproduitData;

const db = require('../config/db');

async function initializeCommandeproduitData() {
    try {
        // Vérifier si la table Commandeproduit est vide
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM Commandeproduit');
        const count = rows[0].count;

        if (count === 0) {
            console.log('Initialisation des données des relations commande-produit...');

            const insertQuery = `
                INSERT INTO Commandeproduit (idCommande, idProduit, quantite, prix) VALUES
                (4, 2, 1, 2800.00),
                (5, 2, 2, 2800.00),
                (6, 2, 1, 2800.00),
                (7, 2, 1, 2800.00),
                (8, 3, 1, 70000.00),
                (9, 2, 1, 2800.00),
                (10, 2, 3, 2800.00),
                (11, 3, 2, 70000.00),
                (12, 3, 1, 70000.00),
                (13, 2, 1, 2800.00),
                (14, 3, 2, 70000.00),
                (15, 7, 3, 52000.00),
                (16, 2, 3, 2800.00),
                (17, 2, 4, 2800.00),
                (18, 2, 4, 2800.00),
                (23, 2, 1, 2800.00),
                (24, 2, 3, 2800.00),
                (24, 5, 1, 68000.00),
                (25, 2, 6, 2800.00)`;

            await db.execute(insertQuery);
            console.log('Données des relations commande-produit initialisées avec succès');
        } else {
            console.log('La table Commandeproduit contient déjà des données');
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des relations commande-produit:', error);
        throw error;
    }
}

module.exports = initializeCommandeproduitData;

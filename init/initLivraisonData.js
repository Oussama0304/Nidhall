const db = require('../config/db');

async function initializeLivraisonData() {
    try {
        // Vérifier si la table Livraison est vide
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM Livraison');
        const count = rows[0].count;

        if (count === 0) {
            console.log('Initialisation des données des livraisons...');

            const insertQuery = `
                INSERT INTO Livraison (idCommande, dateLivraison, numChauffeur, quantiteLv) VALUES
                (4, '2024-12-18 15:40:42', 0, 0),
                (4, '2024-12-19 00:39:35', 0, 0),
                (6, '2024-12-19 00:39:46', 0, 0),
                (4, '2024-12-19 12:27:45', 0, 0),
                (11, '2024-12-19 12:38:37', 0, 0),
                (5, '2024-12-19 15:00:21', 0, 0),
                (6, '2024-12-24 21:29:56', 0, 0),
                (7, '2024-12-24 21:31:40', 0, 0),
                (4, '2024-12-24 21:45:52', 0, 0),
                (6, '2024-12-24 23:07:38', 0, 0),
                (5, '2024-12-29 14:35:03', 0, 0),
                (4, '2024-12-30 10:35:17', 0, 0)`;

            await db.execute(insertQuery);
            console.log('Données des livraisons initialisées avec succès');
        } else {
            console.log('La table Livraison contient déjà des données');
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des livraisons:', error);
        throw error;
    }
}

module.exports = initializeLivraisonData;

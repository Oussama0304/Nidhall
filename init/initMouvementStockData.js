const db = require('../config/db');

async function initializeMouvementstockData() {
    try {
        // Vérifier si la table Mouvementstock est vide
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM Mouvementstock');
        const count = rows[0].count;

        if (count === 0) {
            console.log('Initialisation des données des mouvements de stock...');

            const insertQuery = `
                INSERT INTO Mouvementstock (idProduit, quantite, type_mouvement, date_mouvement, idCommande, raison) VALUES
                (4, 10, 'ENTREE', '2024-12-27 14:23:48', NULL, 'Réapprovisionnement'),
                (5, 50, 'RETRAIT', '2024-12-27 14:25:43', NULL, 'Réapprovisionnement'),
                (2, 3, 'RETRAIT', '2024-12-27 22:42:27', 20, NULL),
                (2, 1, 'RETRAIT', '2024-12-27 22:43:56', 21, NULL)`;

            await db.execute(insertQuery);
            console.log('Données des mouvements de stock initialisées avec succès');
        } else {
            console.log('La table Mouvementstock contient déjà des données');
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des mouvements de stock:', error);
        throw error;
    }
}

module.exports = initializeMouvementstockData;

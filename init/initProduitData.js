const db = require('../config/db');

async function initializeProduitData() {
    try {
        // Vérifier si la table Produit est vide
        const results = await db.query('SELECT COUNT(*) as count FROM Produit');
        const count = results[0].count;

        if (count === 0) {
            console.log('Initialisation des données des produits...');
            
            await db.query(`
                INSERT INTO Produit (idProduit, nom, disponibilite, prix, CODPRD, LIBPRD, CODEMB, LIBEMB, TYPPRD, quantite, seuil_alerte)
                VALUES
                (1, 'sans plomb', 'non disponible', 2550, '', '', '', '', '', 100, 10),
                (2, 'gazoil 50', 'non disponible', 2800, '0101111', 'gazoil', '', '', 'CARBURANT', 65, 10),
                (3, 'castrol ', 'disponible', 70000, '0101112', 'huile', '', '', 'LUBRIFIANT', -6, 10),
                (4, 'castrol ', 'dispo', 70007, '122234', 'huile', '', '', 'LUBRIFIANT', 10, 10),
                (5, 'castrol ', 'non disponible', 68000, '12228', 'huile', '', '', 'LUBRIFIANT', -51, 10),
                (6, 'castrol ', 'non disponible', 56000, '0101122', 'huile', '', '', 'LUBRIFIANT', 0, 10),
                (7, 'castrol ', 'dispo', 52000, '0101123', 'huile', '', '', 'LUBRIFIANT', -3, 10),
                (8, 'shell huilux ', 'dispo', 58000, '0101128', 'huile', '', '', 'LUBRIFIANT', 0, 10),
                (9, 'shell huilux ', 'dispo', 58000, '0101128', 'huile', '', '', 'LUBRIFIANT', 0, 10),
                (10, 'shell', 'disponible', 54000, '0101111', 'huile', '', '', 'LUBRIFIANT', 0, 10),
                (11, 'castrol ', 'disponible', 70000, '0101112', 'huile', '', '', 'LUBRIFIANT', 0, 10),
                (12, 'castrol ', 'disponible', 70000, '0101112', 'huile', '', '', 'LUBRIFIANT', 0, 10)
            `);

            console.log('Données des produits initialisées avec succès');
        } else {
            console.log('La table Produit contient déjà des données');
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des produits:', error);
        throw error;
    }
}

module.exports = initializeProduitData;

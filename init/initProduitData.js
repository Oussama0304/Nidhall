const db = require('../config/db');

async function initializeProduitData() {
    try {
        // Vérifier si la table Produit est vide
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM Produit');
        const count = rows[0].count;

        if (count === 0) {
            console.log('Initialisation des données des produits...');

            const insertQuery = `
                INSERT INTO Produit (nom, disponibilite, prix, CODPRD, LIBPRD, CODEMB, LIBEMB, TYPPRD, quantite, seuil_alerte) VALUES
                ('sans plomb', 'non disponible', 2550, NULL, NULL, NULL, NULL, NULL, 100, 10),
                ('gazoil 50', 'non disponible', 2800, '0101111', 'gazoil', NULL, NULL, 'CARBURANT', 65, 10),
                ('castrol', 'disponible', 70000, '0101112', 'huile', NULL, NULL, 'LUBRIFIANT', -6, 10),
                ('castrol', 'dispo', 70007, '122234', 'huile', NULL, NULL, 'LUBRIFIANT', 10, 10),
                ('castrol', 'non disponible', 68000, '12228', 'huile', NULL, NULL, 'LUBRIFIANT', -51, 10),
                ('castrol', 'non disponible', 56000, '0101122', 'huile', NULL, NULL, 'LUBRIFIANT', 0, 10),
                ('castrol', 'dispo', 52000, '0101123', 'huile', NULL, NULL, 'LUBRIFIANT', -3, 10),
                ('shell huilux', 'dispo', 58000, '0101128', 'huile', NULL, NULL, 'LUBRIFIANT', 0, 10),
                ('shell huilux', 'dispo', 58000, '0101128', 'huile', NULL, NULL, 'LUBRIFIANT', 0, 10),
                ('shell', 'disponible', 54000, '0101111', 'huile', NULL, NULL, 'LUBRIFIANT', 0, 10),
                ('castrol', 'disponible', 70000, '0101112', 'huile', NULL, NULL, 'LUBRIFIANT', 0, 10),
                ('castrol', 'disponible', 70000, '0101112', 'huile', NULL, NULL, 'LUBRIFIANT', 0, 10)`;

            await db.execute(insertQuery);
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

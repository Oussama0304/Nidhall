const db = require('../config/db');

async function initializeProduitData() {
    try {
        // Vérifier si la table Produit est vide
        const [results] = await db.execute('SELECT COUNT(*) as count FROM Produit');
        const count = results[0].count;

        if (count === 0) {
            console.log('Initialisation des données des produits...');
            
            const insertQuery = `
                INSERT INTO Produit (nom, disponibilite, prix, CODPRD, LIBPRD, CODEMB, LIBEMB, TYPPRD) VALUES
                ('Super Sans Plomb', 1, 2.4, 'SSP', 'Super Sans Plomb', 'L', 'Litre', 'CARBURANT'),
                ('Gasoil 50', 1, 1.9, 'GO50', 'Gasoil 50', 'L', 'Litre', 'CARBURANT'),
                ('GPL', 1, 0.8, 'GPL', 'Gaz de Pétrole Liquéfié', 'L', 'Litre', 'CARBURANT'),
                ('Huile Moteur', 1, 25.0, 'HM', 'Huile Moteur', 'L', 'Litre', 'LUBRIFIANT'),
                ('Huile Boîte', 1, 30.0, 'HB', 'Huile Boîte', 'L', 'Litre', 'LUBRIFIANT'),
                ('Liquide Frein', 1, 15.0, 'LF', 'Liquide de Frein', 'L', 'Litre', 'LUBRIFIANT'),
                ('Liquide Refroidissement', 1, 12.0, 'LR', 'Liquide de Refroidissement', 'L', 'Litre', 'LUBRIFIANT')`;
            
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

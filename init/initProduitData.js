const db = require('../config/db');

async function initializeProduitData() {
    try {
        // Vérifier si la table Produit est vide
        const result = await db.query('SELECT COUNT(*) as count FROM Produit');
        const count = result[0].count;

        if (count === 0) {
            console.log('Initialisation des données des produits...');
            
            const insertQuery = `
                INSERT INTO Produit (nom, disponibilite, prix, CODPRD, LIBPRD, CODEMB, LIBEMB, TYPPRD, quantite, seuil_alerte) VALUES
                ('Super Sans Plomb', 'disponible', 2.4, 'SSP', 'Super Sans Plomb', 'L', 'Litre', 'CARBURANT', 100, 10),
                ('Gasoil 50', 'disponible', 1.9, 'GO50', 'Gasoil 50', 'L', 'Litre', 'CARBURANT', 100, 10),
                ('GPL', 'disponible', 0.8, 'GPL', 'Gaz de Pétrole Liquéfié', 'L', 'Litre', 'CARBURANT', 100, 10),
                ('Huile Moteur', 'disponible', 25.0, 'HM', 'Huile Moteur', 'L', 'Litre', 'LUBRIFIANT', 50, 5),
                ('Huile Boîte', 'disponible', 30.0, 'HB', 'Huile Boîte', 'L', 'Litre', 'LUBRIFIANT', 50, 5),
                ('Liquide Frein', 'disponible', 15.0, 'LF', 'Liquide de Frein', 'L', 'Litre', 'LUBRIFIANT', 30, 5),
                ('Liquide Refroidissement', 'disponible', 12.0, 'LR', 'Liquide de Refroidissement', 'L', 'Litre', 'LUBRIFIANT', 30, 5)`;
            
            await db.query(insertQuery);
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

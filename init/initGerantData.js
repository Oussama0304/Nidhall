const db = require('../config/db');

async function initializeGerantData() {
    try {
        // Vérifier si la table Gerant est vide
        const [result] = await db.execute('SELECT COUNT(*) as count FROM Gerant');
        const count = result[0].count;

        if (count === 0) {
            console.log('Initialisation des données des gérants...');
            
            const insertQuery = `
                INSERT INTO Gerant (idGerant, nom, prenom, matricule, numGerant, idStation) VALUES
                (3, 'rodrigo', 'rodriguez', 654321, 1001, 1),
                (7, 'nidhal', 'boughanmi', 213456, 1002, 2),
                (8, 'nidhal', 'boughanmi', 123455, 1003, 3),
                (10, 'oussema', 'boughanmi', 124563, 1004, 4),
                (12, 'boughanmi', 'nidhal', 987655, 1005, 5),
                (14, 'aloui', 'omar', 254136, 1006, 6),
                (16, 'ameur', 'atef', 257413, 1007, 1)`;
            
            await db.execute(insertQuery);
            console.log('Données des gérants initialisées avec succès');
        } else {
            console.log('La table Gerant contient déjà des données');
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des gérants:', error);
        console.error('Détails de l\'erreur:', error.message);
        if (error.sql) {
            console.error('Requête SQL:', error.sql);
        }
    }
}

module.exports = initializeGerantData;

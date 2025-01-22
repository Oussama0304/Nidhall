const db = require('../config/db');

async function initializeGerantData() {
    try {
        // Vérifier si la table Gerant est vide
        const checkQuery = 'SELECT COUNT(*) as count FROM Gerant';
        db.query(checkQuery, async (err, results) => {
            if (err) {
                console.error('Erreur lors de la vérification des données:', err);
                return;
            }

            const count = results[0].count;
            if (count === 0) {
                console.log('Initialisation des données des gérants...');
                
                // Insérer les données initiales des gérants
                const insertQuery = `
                    INSERT INTO Gerant (idGerant, nom, prenom, matricule, numGerant, idStation) VALUES
                    (3, 'rodrigo', 'rodriguez', 654321, 1001, 1),
                    (7, 'nidhal', 'boughanmi', 213456, 1002, 2),
                    (8, 'nidhal', 'boughanmi', 123455, 1003, 3),
                    (10, 'oussema', 'boughanmi', 124563, 1004, 4),
                    (12, 'boughanmi', 'nidhal', 987655, 1005, 5),
                    (14, 'aloui', 'omar', 254136, 1006, 6),
                    (16, 'ameur', 'atef', 257413, 1007, 1)
                `;

                db.query(insertQuery, (err, results) => {
                    if (err) {
                        console.error('Erreur lors de l\'initialisation des données des gérants:', err);
                    } else {
                        console.log('Données des gérants insérées avec succès');
                    }
                });
            } else {
                console.log('Les données existent déjà dans la table Gerant');
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des gérants:', error);
    }
}

module.exports = initializeGerantData;

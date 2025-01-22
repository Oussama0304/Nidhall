const db = require('../config/db');

async function initializeMaterialData() {
    try {
        // Vérifier si la table Material est vide
        const checkQuery = 'SELECT COUNT(*) as count FROM Material';
        db.query(checkQuery, async (err, results) => {
            if (err) {
                console.error('Erreur lors de la vérification des données:', err);
                return;
            }

            const count = results[0].count;
            if (count === 0) {
                console.log('Initialisation des données des matériels...');
                
                const insertQuery = `
                    INSERT INTO Material (idStation, Actif, Description, Emplacement, status) VALUES
                    (1, 'Pompe 1', 'Pompe à essence principale', 'Zone A', 'Actif'),
                    (1, 'Pompe 2', 'Pompe à gasoil principale', 'Zone B', 'Actif'),
                    (2, 'Cuve 1', 'Cuve de stockage essence', 'Sous-sol', 'Actif'),
                    (2, 'Cuve 2', 'Cuve de stockage gasoil', 'Sous-sol', 'Actif')
                `;

                db.query(insertQuery, (err, results) => {
                    if (err) {
                        console.error('Erreur lors de l\'initialisation des données des matériels:', err);
                    } else {
                        console.log('Données des matériels insérées avec succès');
                    }
                });
            } else {
                console.log('Les données existent déjà dans la table Material');
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des matériels:', error);
    }
}

module.exports = initializeMaterialData;

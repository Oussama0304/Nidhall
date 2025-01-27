const db = require('../config/db');

async function initializeMaterialData() {
    try {
        // Vérifier si la table Material est vide
        const [result] = await db.execute('SELECT COUNT(*) as count FROM Material');
        const count = result[0].count;

        if (count === 0) {
            console.log('Initialisation des données des matériels...');
            
            const insertQuery = `
                INSERT INTO Material (idStation, Actif, Description, Emplacement, status) VALUES
                (1, 'Pompe 1', 'Pompe à essence principale', 'Zone A', 'Actif'),
                (1, 'Pompe 2', 'Pompe à gasoil principale', 'Zone B', 'Actif'),
                (1, 'Pompe 3', 'Pompe à essence secondaire', 'Zone A', 'En maintenance'),
                (1, 'Pompe 4', 'Pompe à gasoil secondaire', 'Zone B', 'Actif'),
                (1, 'Jauge 1', 'Jauge électronique essence', 'Zone A', 'Actif'),
                (1, 'Jauge 2', 'Jauge électronique gasoil', 'Zone B', 'Actif'),
                (2, 'Cuve 1', 'Cuve de stockage essence', 'Sous-sol', 'Actif'),
                (2, 'Cuve 2', 'Cuve de stockage gasoil', 'Sous-sol', 'Actif'),
                (2, 'Pompe 5', 'Pompe à essence principale', 'Zone C', 'Actif'),
                (2, 'Pompe 6', 'Pompe à gasoil principale', 'Zone D', 'En panne'),
                (3, 'Cuve 3', 'Cuve de stockage essence', 'Sous-sol', 'Actif'),
                (3, 'Cuve 4', 'Cuve de stockage gasoil', 'Sous-sol', 'En maintenance'),
                (3, 'Pompe 7', 'Pompe à essence principale', 'Zone E', 'Actif'),
                (3, 'Pompe 8', 'Pompe à gasoil principale', 'Zone F', 'Actif'),
                (4, 'Cuve 5', 'Cuve de stockage essence', 'Sous-sol', 'Actif'),
                (4, 'Cuve 6', 'Cuve de stockage gasoil', 'Sous-sol', 'Actif'),
                (4, 'Pompe 9', 'Pompe à essence principale', 'Zone G', 'En panne'),
                (4, 'Pompe 10', 'Pompe à gasoil principale', 'Zone H', 'Actif')`;
            
            await db.execute(insertQuery);
            console.log('Données des matériels initialisées avec succès');
        } else {
            console.log('La table Material contient déjà des données');
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des données des matériels:', error);
        console.error('Détails de l\'erreur:', error.message);
        if (error.sql) {
            console.error('Requête SQL:', error.sql);
        }
    }
}

module.exports = initializeMaterialData;

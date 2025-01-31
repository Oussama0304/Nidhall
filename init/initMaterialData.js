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
                (2, 'Cuve 1', 'Cuve de stockage essence', 'Sous-sol', 'Actif'),
                (2, 'Cuve 2', 'Cuve de stockage gasoil', 'Sous-sol', 'Actif')`;

            await db.execute(insertQuery);
            console.log('Données des matériels initialisées avec succès');
        } else {
            console.log('La table Material contient déjà des données');
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des matériels:', error);
        throw error;
    }
}

module.exports = initializeMaterialData;

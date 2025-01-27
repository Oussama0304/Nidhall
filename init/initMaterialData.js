const db = require('../config/db');

async function initializeMaterialData() {
    try {
        // Check if Material table is empty
        const [existingData] = await db.query('SELECT COUNT(*) as count FROM Material');
        
        if (existingData[0].count === 0) {
            // Initial material data
            const materials = [
                {
                    idStation: 1,
                    Actif: 'Pompe 1',
                    Description: 'Pompe à essence principale',
                    Emplacement: 'Zone A',
                    status: 'Actif'
                },
                {
                    idStation: 1,
                    Actif: 'Pompe 2',
                    Description: 'Pompe à gasoil principale',
                    Emplacement: 'Zone B',
                    status: 'Actif'
                },
                {
                    idStation: 2,
                    Actif: 'Cuve 1',
                    Description: 'Cuve de stockage essence',
                    Emplacement: 'Sous-sol',
                    status: 'Actif'
                },
                {
                    idStation: 2,
                    Actif: 'Cuve 2',
                    Description: 'Cuve de stockage gasoil',
                    Emplacement: 'Sous-sol',
                    status: 'Actif'
                }
            ];

            // Insert materials
            for (const material of materials) {
                await db.query(
                    'INSERT INTO Material (idStation, Actif, Description, Emplacement, status) VALUES (?, ?, ?, ?, ?)',
                    [material.idStation, material.Actif, material.Description, material.Emplacement, material.status]
                );
            }
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

const db = require('../config/db');

async function initializeMaterialData() {
    try {
        // Créer la table si elle n'existe pas
        await db.execute(`
            CREATE TABLE IF NOT EXISTS Material (
                idMaterial INT PRIMARY KEY AUTO_INCREMENT,
                idStation INT,
                Actif VARCHAR(255) NOT NULL,
                Description TEXT,
                Emplacement VARCHAR(255),
                status VARCHAR(50) DEFAULT 'Actif',
                date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (idStation) REFERENCES StationService(idStation)
            )
        `);

        // Check if Material table is empty
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM Material');
        const count = rows[0]?.count || 0;
        
        if (count === 0) {
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
                await db.execute(
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

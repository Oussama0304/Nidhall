const db = require('../config/db');

async function initializeMaterialData() {
    try {
        // Check if Material table exists first
        const [tables] = await db.execute("SHOW TABLES LIKE 'Material'");
        if (tables.length === 0) {
            console.log('Creating Material table...');
            await db.execute(`
                CREATE TABLE IF NOT EXISTS Material (
                    idStation BIGINT,
                    Actif VARCHAR(50) NOT NULL,
                    Description TEXT,
                    Emplacement VARCHAR(100),
                    status VARCHAR(50),
                    FOREIGN KEY (idStation) REFERENCES StationService(idStation)
                )
            `);
        }

        // Check if table is empty
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM Material');
        const count = rows[0]?.count || 0;
        
        if (count === 0) {
            console.log('Initialisation des données des matériels...');
            
            // Get all stations
            const [stations] = await db.execute('SELECT idStation FROM StationService');
            console.log('Stations trouvées:', stations);
            
            if (!stations || stations.length === 0) {
                console.log('Aucune station n\'existe. Skipping Material initialization.');
                return;
            }

            // Préparer la requête d'insertion
            const values = [];
            const placeholders = [];
            
            // Pour chaque station, ajouter 3 matériels
            stations.forEach(station => {
                // Pompe 1
                values.push(
                    station.idStation,
                    'Pompe 1',
                    'Pompe à essence principale',
                    'Zone A',
                    'Actif'
                );
                // Pompe 2
                values.push(
                    station.idStation,
                    'Pompe 2',
                    'Pompe à essence secondaire',
                    'Zone B',
                    'Actif'
                );
                // Réservoir
                values.push(
                    station.idStation,
                    'Réservoir 1',
                    'Réservoir principal',
                    'Zone C',
                    'Actif'
                );
                
                // Ajouter les placeholders pour cette station
                placeholders.push('(?, ?, ?, ?, ?)');
                placeholders.push('(?, ?, ?, ?, ?)');
                placeholders.push('(?, ?, ?, ?, ?)');
            });

            // Construire et exécuter la requête d'insertion
            const insertQuery = `
                INSERT INTO Material (idStation, Actif, Description, Emplacement, status)
                VALUES ${placeholders.join(', ')}
            `;
            
            await db.execute(insertQuery, values);
            console.log('Données des matériels initialisées avec succès pour toutes les stations');
        } else {
            console.log('La table Material contient déjà des données');
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des matériels:', error);
        throw error;
    }
}

module.exports = initializeMaterialData;

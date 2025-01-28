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
            
            // Get all stations with a more explicit query
            const [stations] = await db.execute('SELECT * FROM StationService ORDER BY idStation');
            console.log('Stations trouvées:', JSON.stringify(stations, null, 2));
            
            if (!stations || stations.length === 0) {
                console.log('Aucune station n\'existe. Skipping Material initialization.');
                return;
            }

            // Construire la requête d'insertion
            let insertQuery = 'INSERT INTO Material (idStation, Actif, Description, Emplacement, status) VALUES ';
            const values = [];

            // Pour chaque station, ajouter les matériels
            stations.forEach((station, index) => {
                // Ajouter Pompe 1
                values.push(
                    station.idStation,
                    'Pompe 1',
                    'Pompe à essence principale',
                    'Zone A',
                    'Actif'
                );
                
                // Ajouter Pompe 2
                values.push(
                    station.idStation,
                    'Pompe 2',
                    'Pompe à essence secondaire',
                    'Zone B',
                    'Actif'
                );
                
                // Ajouter Réservoir
                values.push(
                    station.idStation,
                    'Réservoir 1',
                    'Réservoir principal',
                    'Zone C',
                    'Actif'
                );

                // Ajouter les placeholders pour cette station
                const stationPlaceholders = [
                    '(?, ?, ?, ?, ?)',
                    '(?, ?, ?, ?, ?)',
                    '(?, ?, ?, ?, ?)'
                ].join(',');

                insertQuery += stationPlaceholders;
                if (index < stations.length - 1) {
                    insertQuery += ',';
                }
            });
            
            console.log('Executing query with values:', JSON.stringify(values, null, 2));
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

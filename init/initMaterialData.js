const db = require('../config/db');

async function initializeMaterialData() {
    try {
        // Check if Material table exists first
        const [tables] = await db.execute("SHOW TABLES LIKE 'Material'");
        if (tables.length === 0) {
            console.log('Creating Material table...');
            await db.execute(`
                CREATE TABLE IF NOT EXISTS Material (
                    idMaterial INT PRIMARY KEY AUTO_INCREMENT,
                    idStation INT,
                    Actif VARCHAR(255),
                    Description TEXT,
                    Emplacement VARCHAR(255),
                    status VARCHAR(50),
                    FOREIGN KEY (idStation) REFERENCES StationService(idStation)
                )
            `);
        }

        // Check if table is empty
        const [result] = await db.execute('SELECT COUNT(*) as count FROM Material');
        
        if (result[0].count === 0) {
            console.log('Initialisation des données des matériels...');
            
            // Get existing stations
            const [stations] = await db.execute('SELECT idStation FROM StationService');
            
            if (stations.length === 0) {
                console.log('Aucune station n\'existe. Skipping Material initialization.');
                return;
            }

            // Insert sample data using the first station
            const insertQuery = `
                INSERT INTO Material (idStation, Actif, Description, Emplacement, status) VALUES
                (?, 'Pompe 1', 'Pompe à essence principale', 'Zone A', 'Actif'),
                (?, 'Pompe 2', 'Pompe à essence secondaire', 'Zone B', 'Actif'),
                (?, 'Réservoir 1', 'Réservoir principal', 'Zone C', 'Actif')
            `;
            
            await db.execute(insertQuery, [stations[0].idStation, stations[0].idStation, stations[0].idStation]);
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

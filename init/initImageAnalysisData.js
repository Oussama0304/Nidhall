const db = require('../config/db');

async function initImageAnalysisTable() {
    try {
        // Créer la table ImageAnalysis si elle n'existe pas
        await db.execute(`
            CREATE TABLE IF NOT EXISTS ImageAnalysis (
                id INT PRIMARY KEY AUTO_INCREMENT,
                image_path VARCHAR(255) NOT NULL,
                analysis_results JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        console.log('Table ImageAnalysis initialisée avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la table ImageAnalysis:', error);
        throw error;
    }
}

module.exports = initImageAnalysisTable;

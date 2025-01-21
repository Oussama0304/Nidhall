const mysql = require('mysql2/promise');

let db = null;

// Database connection
async function initializeDatabase() {
    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'ProjetPfeAgil',
            // Proper configuration options for MySQL2
            waitForConnections: true,
            connectionLimit: 10,
            maxIdle: 10,
            idleTimeout: 60000,
            queueLimit: 0
        });
        console.log('Connected to MySQL database for recommendations');
    } catch (err) {
        console.error('Error connecting to database:', err);
        throw err;
    }
}

// Initialize database connection
initializeDatabase();

// Fonction pour trouver des cas similaires
const findSimilarCases = (description) => {
    return new Promise((resolve, reject) => {
        // Recherche des réclamations similaires basées sur le type et les mots-clés
        const query = `
            SELECT r.*, 
                   u.nom as nom_commercial, u.prenom as prenom_commercial
            FROM Reclamation r
            LEFT JOIN Utilisateur u ON r.idCommercial = u.identifiant
            WHERE r.etat = 'Validée'
            AND r.description LIKE ?
            ORDER BY r.date DESC
            LIMIT 5
        `;
        
        // Créer un pattern de recherche avec les mots-clés de la description
        const searchPattern = `%${description.split(' ').join('%')}%`;
        
        db.query(query, [searchPattern], (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

// Fonction pour recommander un commercial
const recommendCommercial = (reclamationType) => {
    return new Promise((resolve, reject) => {
        // Trouver le commercial avec le meilleur taux de résolution pour ce type de réclamation
        const query = `
            SELECT 
                u.identifiant,
                u.nom,
                u.prenom,
                COUNT(r.idReclamation) as total_reclamations,
                SUM(CASE WHEN r.etat = 'Validée' THEN 1 ELSE 0 END) as reclamations_resolues,
                COUNT(CASE WHEN r.etat = 'Validée' THEN 1 END) / COUNT(r.idReclamation) * 100 as taux_resolution
            FROM Utilisateur u
            LEFT JOIN Reclamation r ON u.identifiant = r.idCommercial
            WHERE u.roles = 'COMMERCIAL'
            AND r.type = ?
            GROUP BY u.identifiant
            ORDER BY taux_resolution DESC, total_reclamations DESC
            LIMIT 1
        `;
        
        db.query(query, [reclamationType], (err, results) => {
            if (err) reject(err);
            else resolve(results[0]);
        });
    });
};

// Fonction pour suggérer des actions préventives
const suggestPreventiveActions = (reclamationType) => {
    return new Promise((resolve, reject) => {
        // Analyser les tendances des réclamations pour suggérer des actions préventives
        const query = `
            SELECT 
                type,
                COUNT(*) as occurrence_count,
                GROUP_CONCAT(description SEPARATOR ' | ') as descriptions
            FROM Reclamation
            WHERE type = ?
            GROUP BY type
            ORDER BY occurrence_count DESC
        `;
        
        db.query(query, [reclamationType], (err, results) => {
            if (err) reject(err);
            else {
                // Générer des suggestions basées sur les tendances
                const suggestions = [];
                if (results[0]) {
                    if (reclamationType === 'TECHNIQUE') {
                        suggestions.push('Planifier une maintenance préventive régulière');
                        suggestions.push('Former le personnel sur les procédures de maintenance');
                        suggestions.push('Mettre en place un système de surveillance des équipements');
                    } else if (reclamationType === 'COMMERCIALE') {
                        suggestions.push('Revoir les processus de service client');
                        suggestions.push('Organiser des formations sur la relation client');
                        suggestions.push('Mettre en place un suivi régulier de la satisfaction client');
                    }
                }
                resolve(suggestions);
            }
        });
    });
};

module.exports = {
    db,
    findSimilarCases,
    recommendCommercial,
    suggestPreventiveActions
};

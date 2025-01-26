const mysql = require('mysql2/promise');
const db = require('../config/db');

// Database connection
async function initializeDatabase() {
    try {
        // Utiliser la connexion à la base de données existante
        // db = await mysql.createConnection({
        //     host: process.env.DB_HOST || 'localhost',
        //     user: process.env.DB_USER || 'root',
        //     password: process.env.DB_PASSWORD || '',
        //     database: process.env.DB_NAME || 'ProjetPfeAgil',
        //     // Proper configuration options for MySQL2
        //     waitForConnections: true,
        //     connectionLimit: 10,
        //     maxIdle: 10,
        //     idleTimeout: 60000,
        //     queueLimit: 0
        // });
        console.log('Connected to MySQL database for recommendations');
    } catch (err) {
        console.error('Error connecting to database:', err);
        throw err;
    }
}

// Initialize database connection
initializeDatabase();

// Fonction pour trouver des cas similaires
const findSimilarCases = async (description) => {
    try {
        const query = `
            SELECT r.*, u.nom as commercial_nom, u.prenom as commercial_prenom
            FROM Reclamation r
            LEFT JOIN Utilisateur u ON r.commercial_id = u.identifiant
            WHERE r.statut = 'RESOLVED'
            ORDER BY r.date_creation DESC
            LIMIT 5
        `;
        
        const results = await db.query(query);
        return results;
    } catch (error) {
        console.error('Erreur lors de la recherche de cas similaires:', error);
        throw error;
    }
};

// Fonction pour recommander un commercial
const recommendCommercial = async (reclamationType) => {
    try {
        const query = `
            SELECT 
                u.identifiant,
                u.nom,
                u.prenom,
                COUNT(r.id) as success_count
            FROM Utilisateur u
            LEFT JOIN Reclamation r ON u.identifiant = r.commercial_id
            WHERE u.roles = 'COMMERCIAL'
            AND (r.statut = 'RESOLVED' OR r.statut IS NULL)
            GROUP BY u.identifiant
            ORDER BY success_count DESC
            LIMIT 1
        `;
        
        const results = await db.query(query);
        return results[0] || null;
    } catch (error) {
        console.error('Erreur lors de la recommandation d\'un commercial:', error);
        throw error;
    }
};

// Fonction pour suggérer des actions préventives
const suggestPreventiveActions = async (reclamationType) => {
    try {
        const query = `
            SELECT 
                action_preventive,
                COUNT(*) as frequency
            FROM Reclamation
            WHERE statut = 'RESOLVED'
            AND action_preventive IS NOT NULL
            AND type = ?
            GROUP BY action_preventive
            ORDER BY frequency DESC
            LIMIT 3
        `;
        
        const results = await db.query(query, [reclamationType]);
        return results;
    } catch (error) {
        console.error('Erreur lors de la suggestion d\'actions préventives:', error);
        throw error;
    }
};

module.exports = {
    findSimilarCases,
    recommendCommercial,
    suggestPreventiveActions
};

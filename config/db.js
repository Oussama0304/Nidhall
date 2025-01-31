const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'database',
    user: process.env.DB_USER || 'pfeuser',
    password: process.env.DB_PASSWORD || 'ProjectPfeAgil',
    database: process.env.DB_NAME || 'ProjetPfeAgil',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    charset: 'utf8mb4'
});

// Fonction pour tester la connexion avec retry
const testConnection = async (retries = 5, delay = 5000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const connection = await pool.getConnection();
            console.log('Successfully connected to the database');
            connection.release();
            return true;
        } catch (err) {
            console.error(`Attempt ${i + 1}/${retries} - Error connecting to the database:`, err);
            if (i < retries - 1) {
                console.log(`Retrying in ${delay/1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    return false;
};

// Fonction pour exécuter une requête
const execute = async (sql, params = []) => {
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

// Fonction pour obtenir une connexion
const getConnection = async () => {
    try {
        return await pool.getConnection();
    } catch (error) {
        console.error('Error getting database connection:', error);
        throw error;
    }
};

// Initialisation de la connexion au démarrage
console.log('Initializing database connection...');
testConnection()
    .then(success => {
        if (!success) {
            console.error('Failed to establish database connection after multiple retries');
            process.exit(1);
        }
    })
    .catch(err => {
        console.error('Error during initial database connection:', err);
        process.exit(1);
    });

module.exports = {
    execute,
    query: execute, // Alias pour la compatibilité
    getConnection,
    testConnection,
    pool // Exporter le pool pour un accès direct si nécessaire
};

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'database',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'ProjectPfeAgil',
    database: process.env.DB_NAME || 'ProjetPfeAgil',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    charset: 'utf8mb4'
});

// Fonction pour tester la connexion
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Successfully connected to the database.');
        connection.release();
        return true;
    } catch (err) {
        console.error('Error connecting to the database:', err);
        return false;
    }
};

// Fonction pour exécuter une requête
const execute = async (sql, params = []) => {
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (err) {
        console.error('Database query error:', err);
        throw err;
    }
};

// Fonction pour faire une requête
const query = async (sql, params = []) => {
    try {
        const [results] = await pool.query(sql, params);
        return results;
    } catch (err) {
        console.error('Database query error:', err);
        throw err;
    }
};

// Fonction pour obtenir une connexion
const getConnection = async () => {
    try {
        return await pool.getConnection();
    } catch (err) {
        console.error('Error getting connection:', err);
        throw err;
    }
};

// Initialisation de la connexion au démarrage
(async () => {
    try {
        console.log('Initializing database connection...');
        await testConnection();
    } catch (err) {
        console.error('Error during database initialization:', err);
        process.exit(1);
    }
})();

module.exports = {
    execute,
    query,
    getConnection,
    testConnection,
    pool
};

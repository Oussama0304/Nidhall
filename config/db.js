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
    charset: 'utf8mb4',
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000
});

// Fonction pour tester la connexion avec retry
const testConnection = async (retries = 5, delay = 5000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const connection = await pool.getConnection();
            console.log('Successfully connected to the database.');
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
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
};

// Fonction pour faire une requête
const query = async (sql, params = []) => {
    try {
        const [results] = await pool.query(sql, params);
        return results;
    } catch (err) {
        console.error('Error executing query:', err);
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


module.exports = {
    execute,
    query,
    getConnection,
    testConnection,
    pool
};


module.exports = {
    execute,
    query,
    getConnection,
    testConnection,
    pool
};

const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'database',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'ProjectPfeAgil',
    database: process.env.DB_NAME || 'ProjetPfeAgil',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000,
    charset: 'utf8mb4',
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    multipleStatements: true
});

const promisePool = pool.promise();

// Fonction pour tester la connexion
const testConnection = async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('Connexion à la base de données établie avec succès');
        connection.release();
        return true;
    } catch (error) {
        console.error('Erreur de connexion à la base de données:', error);
        throw error;
    }
};

// Tester la connexion au démarrage
testConnection().catch(console.error);

// Export des fonctions promise-based
module.exports = {
    query: async (sql, params) => {
        try {
            const [results] = await promisePool.query(sql, params);
            return results;
        } catch (error) {
            console.error('Erreur lors de la requête:', error);
            throw error;
        }
    },
    execute: async (sql, params) => {
        try {
            const [results] = await promisePool.execute(sql, params);
            return results;
        } catch (error) {
            console.error('Erreur lors de l\'exécution:', error);
            throw error;
        }
    },
    getConnection: () => promisePool.getConnection(),
    escape: (value) => pool.escape(value),
    escapeId: (value) => pool.escapeId(value)
};

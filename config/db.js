const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    connectTimeout: 10000, // 10 secondes
    acquireTimeout: 10000, // 10 secondes
    timeout: 10000, // 10 secondes
    charset: 'utf8mb4',
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

// Fonction pour réessayer la connexion
const retryConnection = async (maxRetries = 5, delay = 5000) => {
    for (let i = 0; i < maxRetries; i++) {
        console.log(`Attempting to connect to database (attempt ${i + 1}/${maxRetries})...`);
        const isConnected = await testConnection();
        if (isConnected) {
            return true;
        }
        if (i < maxRetries - 1) {
            console.log(`Connection failed. Retrying in ${delay/1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    return false;
};

// Wrapper pour les requêtes avec retry automatique
const query = async (sql, params) => {
    try {
        const [results] = await pool.execute(sql, params);
        return [results];
    } catch (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || 
            err.code === 'ECONNREFUSED' || 
            err.code === 'ER_CON_COUNT_ERROR') {
            
            console.log('Database connection error. Attempting to reconnect...');
            const reconnected = await retryConnection();
            if (reconnected) {
                // Réessayer la requête
                const [results] = await pool.execute(sql, params);
                return [results];
            }
        }
        throw err;
    }
};

// Ajouter la colonne idUtilisateur si elle n'existe pas
const addUserIdColumn = async () => {
    try {
        const [results] = await query(`
            SELECT COUNT(*) as count 
            FROM information_schema.COLUMNS 
            WHERE TABLE_SCHEMA = '${process.env.DB_NAME}' 
            AND TABLE_NAME = 'Commande' 
            AND COLUMN_NAME = 'idUtilisateur'
        `);

        if (results[0].count === 0) {
            await query(`
                ALTER TABLE Commande
                ADD COLUMN idUtilisateur BIGINT,
                ADD CONSTRAINT fk_commande_utilisateur
                FOREIGN KEY (idUtilisateur) REFERENCES Utilisateur(identifiant)
            `);
            console.log('Colonne idUtilisateur ajoutée avec succès');
        }
    } catch (error) {
        console.error('Erreur lors de la modification de la table:', error);
    }
};

// Initialisation de la connexion au démarrage
(async () => {
    try {
        console.log('Initializing database connection...');
        const connected = await retryConnection();
        if (!connected) {
            console.error('Failed to establish database connection after multiple retries.');
            process.exit(1);
        }
        await addUserIdColumn();
    } catch (err) {
        console.error('Error during database initialization:', err);
        process.exit(1);
    }
})();

module.exports = {
    query,
    testConnection,
    retryConnection,
    pool
};

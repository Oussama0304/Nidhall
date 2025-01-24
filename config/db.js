const mysql = require('mysql2');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'ProjectPfeAgil',
    database: process.env.DB_NAME || 'ProjetPfeAgil',
    connectionLimit: 10,
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000,
    waitForConnections: true,
    queueLimit: 0,
    charset: 'utf8mb4'
};

const pool = mysql.createPool(dbConfig);

// Fonction pour tester la connexion avec retries
const testConnection = async (retries = 5, delay = 5000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const connection = await pool.promise().getConnection();
            console.log('Connexion à la base de données établie avec succès');
            connection.release();
            return true;
        } catch (err) {
            console.error(`Tentative ${i + 1}/${retries} - Erreur de connexion:`, err.message);
            if (i < retries - 1) {
                console.log(`Nouvelle tentative dans ${delay/1000} secondes...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    throw new Error('Impossible de se connecter à la base de données après plusieurs tentatives');
};

// Ajouter la colonne idUtilisateur si elle n'existe pas
const addUserIdColumn = async () => {
    try {
        const connection = await pool.promise().getConnection();
        try {
            const [results] = await connection.query(`
                SELECT COUNT(*) as count 
                FROM information_schema.COLUMNS 
                WHERE TABLE_SCHEMA = ? 
                AND TABLE_NAME = 'Commande' 
                AND COLUMN_NAME = 'idUtilisateur'
            `, [process.env.DB_NAME || 'ProjetPfeAgil']);

            if (results[0].count === 0) {
                await connection.query(`
                    ALTER TABLE Commande
                    ADD COLUMN idUtilisateur BIGINT,
                    ADD CONSTRAINT fk_commande_utilisateur
                    FOREIGN KEY (idUtilisateur) REFERENCES Utilisateur(identifiant)
                `);
                console.log('Colonne idUtilisateur ajoutée avec succès');
            }
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error('Erreur lors de la modification de la table:', err);
        throw err;
    }
};

// Initialiser la connexion
(async () => {
    try {
        await testConnection();
        await addUserIdColumn();
        console.log('Base de données initialisée avec succès');
    } catch (err) {
        console.error('Erreur d\'initialisation de la base de données:', err);
        process.exit(1); // Arrêter l'application si la connexion échoue
    }
})();

module.exports = pool;

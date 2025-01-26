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

// Ajouter la colonne idUtilisateur si elle n'existe pas
const addUserIdColumn = () => {
    promisePool.getConnection((err, connection) => {
        if (err) {
            console.error('Erreur de connexion à la base de données:', err);
            return;
        }

        const checkColumnQuery = `
            SELECT COUNT(*) as count 
            FROM information_schema.COLUMNS 
            WHERE TABLE_SCHEMA = 'ProjetPfeAgil' 
            AND TABLE_NAME = 'Commande' 
            AND COLUMN_NAME = 'idUtilisateur'
        `;

        connection.query(checkColumnQuery, (err, results) => {
            connection.release();
            if (err) {
                console.error('Erreur lors de la vérification de la colonne:', err);
                return;
            }

            if (results[0].count === 0) {
                const alterTableQuery = `
                    ALTER TABLE Commande
                    ADD COLUMN idUtilisateur BIGINT,
                    ADD CONSTRAINT fk_commande_utilisateur
                    FOREIGN KEY (idUtilisateur) REFERENCES Utilisateur(identifiant)
                `;

                promisePool.query(alterTableQuery, (err) => {
                    if (err) {
                        console.error('Erreur lors de l\'ajout de la colonne:', err);
                    } else {
                        console.log('Colonne idUtilisateur ajoutée avec succès');
                    }
                });
            }
        });
    });
};

// Fonction pour tester la connexion
const testConnection = async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('Connexion à la base de données établie avec succès');
        connection.release();
        addUserIdColumn();
    } catch (error) {
        console.error('Erreur de connexion à la base de données:', error);
        // Attendre 5 secondes avant de réessayer
        setTimeout(testConnection, 5000);
    }
};

// Tester la connexion au démarrage
testConnection();

module.exports = {
    pool: promisePool,
    execute: (...params) => promisePool.execute(...params),
    query: (...params) => promisePool.query(...params),
    getConnection: () => promisePool.getConnection()
};

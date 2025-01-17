const mysql = require('mysql');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ProjetPfeAgil',
    connectionLimit: 10,
    connectTimeout: 20000,
    acquireTimeout: 20000,
    timeout: 20000,
    waitForConnections: true,
    queueLimit: 0
};

let retries = 5;
const retryInterval = 5000; // 5 secondes

function createPool() {
    const pool = mysql.createPool(dbConfig);
    
    function testConnection(retryCount = 0) {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error(`Tentative ${retryCount + 1}/${retries} - Erreur de connexion à la base de données:`, err.message);
                if (retryCount < retries) {
                    console.log(`Nouvelle tentative dans ${retryInterval/1000} secondes...`);
                    setTimeout(() => testConnection(retryCount + 1), retryInterval);
                } else {
                    console.error('Échec de la connexion à la base de données après plusieurs tentatives');
                    process.exit(1);
                }
                return;
            }
            
            console.log('Connexion à la base de données établie avec succès!');
            connection.release();
            
            // Une fois la connexion établie, on vérifie/ajoute la colonne idUtilisateur
            addUserIdColumn(pool);
        });
    }
    
    // Démarrer le test de connexion
    testConnection();
    
    return pool;
}

// Ajouter la colonne idUtilisateur si elle n'existe pas
function addUserIdColumn(pool) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Erreur lors de la vérification de la structure de la table:', err);
            return;
        }

        const checkColumnQuery = `
            SELECT COUNT(*) as count 
            FROM information_schema.COLUMNS 
            WHERE TABLE_SCHEMA = ? 
            AND TABLE_NAME = 'Commande' 
            AND COLUMN_NAME = 'idUtilisateur'
        `;

        connection.query(checkColumnQuery, [process.env.DB_NAME || 'ProjetPfeAgil'], (err, results) => {
            if (err) {
                connection.release();
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

                connection.query(alterTableQuery, (err) => {
                    connection.release();
                    if (err) {
                        console.error('Erreur lors de l\'ajout de la colonne:', err);
                    } else {
                        console.log('Colonne idUtilisateur ajoutée avec succès');
                    }
                });
            } else {
                connection.release();
            }
        });
    });
}

// Créer et exporter le pool de connexions
const db = createPool();

// Gérer les erreurs de pool
db.on('error', (err) => {
    console.error('Erreur inattendue du pool de connexions:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Tentative de reconnexion à la base de données...');
        createPool();
    }
});

module.exports = db;

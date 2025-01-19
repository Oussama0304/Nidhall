const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root123',
    database: process.env.DB_NAME || 'ProjetPfeAgil',
    connectionLimit: 10,
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000
});

// Ajouter la colonne idUtilisateur si elle n'existe pas
const addUserIdColumn = () => {
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Erreur de connexion à la base de données:', err);
            return;
        }

        const checkColumnQuery = `
            SELECT COUNT(*) as count 
            FROM information_schema.COLUMNS 
            WHERE TABLE_SCHEMA = ? 
            AND TABLE_NAME = 'COMMANDE' 
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
                    ALTER TABLE COMMANDE
                    ADD COLUMN idUtilisateur BIGINT,
                    ADD CONSTRAINT fk_commande_utilisateur
                    FOREIGN KEY (idUtilisateur) REFERENCES UTILISATEUR(identifiant)
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
};

// Vérifier la connexion
db.getConnection((err, connection) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        return;
    }
    console.log('Connecté à la base de données MySQL');
    connection.release();
    addUserIdColumn();
});

// Gérer les erreurs de pool
db.on('error', (err) => {
    console.error('Erreur inattendue du pool de connexions:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Tentative de reconnexion à la base de données...');
    }
});

module.exports = db;

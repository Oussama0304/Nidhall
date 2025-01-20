require('dotenv').config();
const mysql = require('mysql');

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'projetpfeagil',
    port: process.env.DB_PORT || 3306,
    connectionLimit: 10,
    connectTimeout: 20000,
    acquireTimeout: 20000,
    timeout: 20000,
    waitForConnections: true,
    queueLimit: 0,
    insecureAuth: true
});

// Tester la connexion au démarrage
db.getConnection((err, connection) => {
    if (err) {
        console.error('Erreur de connexion initiale à la base de données:', err);
        return;
    }
    console.log('Connecté avec succès à la base de données MySQL');
    connection.release();
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
            WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'projetpfeagil'}' 
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

                db.query(alterTableQuery, (err) => {
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

addUserIdColumn();

module.exports = db;

const mysql = require('mysql2');

const db = mysql.createPool({
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

// Fonction pour tester la connexion
const testConnection = async () => {
    try {
        const connection = await db.promise().getConnection();
        console.log('Connexion à la base de données établie avec succès');
        connection.release();
        addUserIdColumn();
    } catch (err) {
        console.error('Erreur de connexion à la base de données:', err);
        // Attendre 5 secondes avant de réessayer
        setTimeout(testConnection, 5000);
    }
};

// Tester la connexion au démarrage
testConnection();

module.exports = db;

const mysql = require('mysql');
const fs = require('fs');
const path = require('path');

// Configuration de connexion pour le conteneur Docker
const connection = mysql.createConnection({
    host: 'localhost', // Le port est mappé sur localhost
    user: 'root',
    password: 'root123',
    port: 3306
});

async function executeSqlFile(filePath) {
    console.log(`Exécution du fichier: ${filePath}`);
    const sqlFile = fs.readFileSync(filePath, 'utf8');
    const statements = sqlFile.split(';').filter(stmt => stmt.trim());

    for (const statement of statements) {
        if (statement.trim()) {
            await new Promise((resolve, reject) => {
                connection.query(statement, (err) => {
                    if (err) {
                        console.error(`Erreur lors de l'exécution de la requête: ${statement.slice(0, 150)}...`);
                        reject(err);
                    }
                    else resolve();
                });
            });
        }
    }
    console.log(`Fichier ${filePath} exécuté avec succès`);
}

async function initDatabase() {
    try {
        // 1. Créer la base de données si elle n'existe pas
        console.log('Création de la base de données...');
        await new Promise((resolve, reject) => {
            connection.query('CREATE DATABASE IF NOT EXISTS ProjetPfeAgil', (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        console.log('Base de données créée ou déjà existante');

        // 2. Utiliser la base de données
        await new Promise((resolve, reject) => {
            connection.query('USE ProjetPfeAgil', (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        console.log('Base de données sélectionnée');

        // 3. Exécuter les fichiers SQL dans l'ordre
        const files = [
            path.join(__dirname, '..', 'database.sql'),
            path.join(__dirname, '..', 'sql_templates', 'data.sql'),
            path.join(__dirname, '..', 'migrations', 'add_test_commercial.sql'),
            path.join(__dirname, '..', 'migrations', 'add_test_gerant.sql'),
            path.join(__dirname, '..', 'migrations', 'add_commande_detail.sql'),
            path.join(__dirname, '..', 'migrations', 'add_image_url_to_reclamations.sql'),
            path.join(__dirname, '..', 'migrations', 'add_user_to_commande.sql'),
            path.join(__dirname, '..', 'migrations', 'update_reclamation_table.sql')
        ];

        for (const file of files) {
            await executeSqlFile(file);
        }

        console.log('\nInitialisation de la base de données terminée avec succès!');
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
    } finally {
        connection.end();
    }
}

initDatabase();

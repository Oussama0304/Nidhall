const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function initializeUtilisateurData() {
    try {
        // Create table if it doesn't exist
        await db.execute(`
            CREATE TABLE IF NOT EXISTS Utilisateur (
                identifiant INT AUTO_INCREMENT PRIMARY KEY,
                nom VARCHAR(255) NOT NULL,
                prenom VARCHAR(255) NOT NULL,
                telephone VARCHAR(20) NOT NULL,
                mail VARCHAR(255) NOT NULL UNIQUE,
                mot_de_passe VARCHAR(255) NOT NULL,
                matricule INT NOT NULL UNIQUE,
                roles VARCHAR(50) NOT NULL
            )
        `);

        // Vérifier si la table Utilisateur est vide
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM Utilisateur');
        const count = rows[0].count;

        if (count === 0) {
            console.log('Initialisation des données utilisateurs...');
            
            // Insérer les utilisateurs
            const insertQuery = `
                INSERT INTO Utilisateur (nom, prenom, telephone, mail, mot_de_passe, matricule, roles) VALUES
                ('Admin', 'System', '21612345678', 'admin@pfe.tn', '$2a$10$7he4/mlhVcwDso6exKbQx.tUEoxeK5POd1gioUGXvD.l9UeDJulNi', 9999, 'ADMIN'),
                ('neder', 'boughanmi', '26593757', 'commercial@agil.com', '$2a$10$7he4/mlhVcwDso6exKbQx.tUEoxeK5POd1gioUGXvD.l9UeDJulNi', 123456, 'COMMERCIAL'),
                ('rodrigo', 'rodriguez', '23456781', 'gerant.test@station.com', '$2a$10$7he4/mlhVcwDso6exKbQx.tUEoxeK5POd1gioUGXvD.l9UeDJulNi', 654321, 'GERANT'),
                ('mouldi', 'aifa', '28456934', 'depot.test@gmail.com', '$2a$10$7he4/mlhVcwDso6exKbQx.tUEoxeK5POd1gioUGXvD.l9UeDJulNi', 9876554, 'DEPOT'),
                ('brian', 'ruiz', '12365478', 'brian.depot@gmail.com', '$2a$10$7he4/mlhVcwDso6exKbQx.tUEoxeK5POd1gioUGXvD.l9UeDJulNi', 471852, 'DEPOT'),
                ('oussema', 'boughan', '26593757', 'boughanmi.commercial@agil.com', '$2a$10$7he4/mlhVcwDso6exKbQx.tUEoxeK5POd1gioUGXvD.l9UeDJulNi', 14455, 'COMMERCIAL'),
                ('nidhal', 'boughanmi', '26593758', 'nidhal.gerant@station.com', '$2a$10$7he4/mlhVcwDso6exKbQx.tUEoxeK5POd1gioUGXvD.l9UeDJulNi', 213456, 'GERANT'),
                ('nidhal', 'boughanmi', '26593759', 'nidhal2.gerant@station.com', '$2a$10$7he4/mlhVcwDso6exKbQx.tUEoxeK5POd1gioUGXvD.l9UeDJulNi', 123455, 'GERANT'),
                ('oussema', 'boughanmi', '26593760', 'oussema.gerant@station.com', '$2a$10$7he4/mlhVcwDso6exKbQx.tUEoxeK5POd1gioUGXvD.l9UeDJulNi', 124563, 'GERANT'),
                ('boughanmi', 'nidhal', '26593761', 'nidhal3.gerant@station.com', '$2a$10$7he4/mlhVcwDso6exKbQx.tUEoxeK5POd1gioUGXvD.l9UeDJulNi', 987655, 'GERANT'),
                ('aloui', 'omar', '26593762', 'omar.gerant@station.com', '$2a$10$7he4/mlhVcwDso6exKbQx.tUEoxeK5POd1gioUGXvD.l9UeDJulNi', 987656, 'GERANT')
            `;
            
            await db.execute(insertQuery);
            console.log('Données utilisateurs initialisées avec succès');
        } else {
            console.log('La table Utilisateur contient déjà des données');
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des utilisateurs:', error);
        throw error;
    }
}

module.exports = initializeUtilisateurData;

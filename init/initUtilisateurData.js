const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function initializeUtilisateurData() {
    try {
        // Vérifier si la table Utilisateur est vide
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM Utilisateur');
        const count = rows[0].count;

        if (count === 0) {
            console.log('Initialisation des données utilisateurs...');
            
            // Hasher le mot de passe (nous utiliserons le même pour tous les utilisateurs pour simplifier)
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('$2a$10$7he4/mlhVcwDso6exKbQx.tUEoxeK5POd1gioUGXvD.l9UeDJulNi', salt);
            
            // Insérer les utilisateurs
            const insertQuery = `
                INSERT INTO Utilisateur (nom, prenom, telephone, mail, mot_de_passe, matricule, roles) VALUES
                ('Admin', 'System', '21612345678', 'admin@pfe.tn', ?, 9999, 'ADMIN'),
                ('neder', 'boughanmi', '26593757', 'commercial@agil.com', ?, 123456, 'COMMERCIAL'),
                ('rodrigo', 'rodriguez', '23456781', 'gerant.test@station.com', ?, 654321, 'GERANT'),
                ('mouldi', 'aifa', '28456934', 'depot.test@gmail.com', ?, 9876554, 'DEPOT'),
                ('brian', 'ruiz', '12365478', 'brian.depot@gmail.com', ?, 471852, 'DEPOT'),
                ('oussema', 'boughan', '26593757', 'boughanmi.commercial@agil.com', ?, 14455, 'COMMERCIAL'),
                ('nidhal', 'boughanmi', '26593758', 'nidhal.gerant@station.com', ?, 213456, 'GERANT'),
                ('nidhal', 'boughanmi', '26593759', 'nidhal2.gerant@station.com', ?, 123455, 'GERANT'),
                ('oussema', 'boughanmi', '26593760', 'oussema.gerant@station.com', ?, 124563, 'GERANT'),
                ('boughanmi', 'nidhal', '26593761', 'nidhal3.gerant@station.com', ?, 987655, 'GERANT'),
                ('aloui', 'omar', '26593762', 'omar.gerant@station.com', ?, 987656, 'GERANT')`;
            
            const params = Array(11).fill(hashedPassword);
            await db.execute(insertQuery, params);
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

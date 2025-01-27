const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function initializeData() {
    try {
        // Vérifier si la table Utilisateur est vide
        const [result] = await db.execute('SELECT COUNT(*) as count FROM Utilisateur');
        const count = result[0].count;

        if (count === 0) {
            console.log('Initialisation des données utilisateurs...');
            
            // Hasher les mots de passe
            const salt = await bcrypt.genSalt(10);
            const adminPassword = await bcrypt.hash('admin123', salt);
            const commercialPassword = await bcrypt.hash('commercial123', salt);
            const gerantPassword = await bcrypt.hash('gerant123', salt);
            
            const insertQuery = `
                INSERT INTO Utilisateur (nom, prenom, telephone, mail, mot_de_passe, matricule, roles) VALUES
                ('Admin', 'System', '12345678', 'admin@example.com', ?, 111111, 'ADMIN'),
                ('Commercial', 'Test', '23456789', 'commercial@example.com', ?, 222222, 'COMMERCIAL'),
                ('Gerant', 'Test', '34567890', 'gerant@example.com', ?, 333333, 'GERANT')`;
            
            await db.execute(insertQuery, [adminPassword, commercialPassword, gerantPassword]);
            console.log('Données utilisateurs initialisées avec succès');
        } else {
            console.log('La table Utilisateur contient déjà des données');
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des données:', error);
        console.error('Détails de l\'erreur:', error.message);
        if (error.sql) {
            console.error('Requête SQL:', error.sql);
        }
    }
}

module.exports = initializeData;

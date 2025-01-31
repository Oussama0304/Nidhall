const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function initializeUtilisateurData() {
    try {
        // Vérifier si la table Utilisateur est vide
        const results = await db.execute('SELECT COUNT(*) as count FROM Utilisateur');
        const count = results[0]['COUNT(*)'] || results[0].count || 0;

        if (count === 0) {
            console.log('Initialisation des données utilisateurs...');
            
            // Hasher le mot de passe
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            
            // Insérer les utilisateurs
            const insertQuery = `
                INSERT INTO Utilisateur (nom, prenom, telephone, mail, mot_de_passe, matricule, roles) VALUES
                ('Admin', 'System', '21612345678', 'admin@pfe.tn', ?, 9999, 'ADMIN'),
                ('Gerant', 'Station', '21612345679', 'gerant@pfe.tn', ?, 1001, 'GERANT'),
                ('Client', 'Test', '21612345680', 'client@pfe.tn', ?, 1002, 'CLIENT'),
                ('Chauffeur', 'Test', '21612345681', 'chauffeur@pfe.tn', ?, 1003, 'CHAUFFEUR'),
                ('Responsable', 'Depot', '21612345682', 'responsable@pfe.tn', ?, 1004, 'RESPONSABLE_DEPOT')`;

            await db.execute(insertQuery, [hashedPassword, hashedPassword, hashedPassword, hashedPassword, hashedPassword]);
            console.log('Données des utilisateurs initialisées avec succès');
        } else {
            console.log('La table Utilisateur contient déjà des données');
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des utilisateurs:', error);
        throw error;
    }
}

module.exports = initializeUtilisateurData;

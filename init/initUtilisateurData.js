const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function initializeUtilisateurData() {
    try {
        // Vérifier si la table Utilisateur est vide
        const [results] = await db.execute('SELECT COUNT(*) as count FROM Utilisateur');
        const count = results[0].count;

        if (count === 0) {
            console.log('Initialisation des données des utilisateurs...');
            
            // Hasher les mots de passe
            const password = await bcrypt.hash('123456', 10);
            
            // Insérer les données initiales des utilisateurs
            const insertQuery = `
                INSERT INTO Utilisateur (identifiant, nom, prenom, telephone, mail, mot_de_passe, matricule, roles)
                VALUES 
                (1, 'Nidhal', 'Boughanmi', '12345678', 'nidhal@example.com', ?, 12345, 'GERANT'),
                (2, 'Ahmed', 'Ben Ali', '12345679', 'ahmed@example.com', ?, 12346, 'GERANT'),
                (3, 'Mohamed', 'Trabelsi', '12345670', 'mohamed@example.com', ?, 12347, 'GERANT')
            `;

            await db.execute(insertQuery, [password, password, password]);
            console.log('Données des utilisateurs insérées avec succès');
        } else {
            console.log('Les données existent déjà dans la table Utilisateur');
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des utilisateurs:', error);
    }
}

module.exports = initializeUtilisateurData;

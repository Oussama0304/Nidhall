const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function initializeUtilisateurData() {
    try {
        // Vérifier si la table Utilisateur est vide
        const checkQuery = 'SELECT COUNT(*) as count FROM Utilisateur';
        db.query(checkQuery, async (err, results) => {
            if (err) {
                console.error('Erreur lors de la vérification des données:', err);
                return;
            }

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

                db.query(insertQuery, [password, password, password], (err, results) => {
                    if (err) {
                        console.error('Erreur lors de l\'initialisation des données des utilisateurs:', err);
                    } else {
                        console.log('Données des utilisateurs insérées avec succès');
                    }
                });
            } else {
                console.log('Les données existent déjà dans la table Utilisateur');
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des utilisateurs:', error);
    }
}

module.exports = initializeUtilisateurData;

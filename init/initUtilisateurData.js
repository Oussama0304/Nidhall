const db = require('../config/db');

async function initializeUtilisateurData() {
    try {
        // Vérifier si la table Utilisateur est vide
        const results = await db.query('SELECT COUNT(*) as count FROM Utilisateur');
        
        if (!results || !results[0] || typeof results[0].count === 'undefined') {
            throw new Error('Erreur lors de la vérification de la table Utilisateur');
        }

        const count = results[0].count;

        if (count === 0) {
            console.log('Initialisation des données des utilisateurs...');
            
            // Les mots de passe sont déjà hashés dans la base de données
            const insertQuery = `
                INSERT INTO Utilisateur (nom, prenom, telephone, mail, mot_de_passe, matricule, roles)
                VALUES
                ('Admin', 'System', '21612345678', 'admin@pfe.tn', '$2a$10$2EZZzs0Gz9LCva1RU.3fDegZan0cQuLvMGr8zVEdypM6hz8UmcVVu', 9999, 'ADMIN'),
                ('neder', 'boughanmi', '26593757', 'commercial@agil.com', '$2a$10$xL5pVQknFxWtfiEVr2R7leBYmZr18HCD11MWRM9PN20OrhgstXwge', 123456, 'COMMERCIAL'),
                ('rodrigo', 'rodriguez', '23456781', 'gerant.test@station.com', '$2a$10$/IWjTxgiBry/8VIwuUsFu.2Bv0d.5uBIOCKgoNqRcdCHqb.CtpABC', 654321, 'GERANT'),
                ('mouldi', 'aifa', '28456934', 'depot.test@gmail.com', '$2a$10$Or1XUqCJ8cPWlQqeeILsLOgrohixpnwiWK.w/FT5gGuUfx2hkWD/2', 9876554, 'DEPOT'),
                ('brian', 'ruiz', '12365478', 'brian.depot@gmail.com', '$2a$10$qf9INIgYJsOKjLdhiArvA.VSQjme8M27UTumUcIsA1AGM9FBrSaUy', 471852, 'DEPOT'),
                ('oussema', 'boughan', '26593757', 'boughanmi.oussema@gmail.com', '$2a$10$qf9INIgYJsOKjLdhiArvA.VSQjme8M27UTumUcIsA1AGM9FBrSaUy', 471853, 'DEPOT')`;
            
            await db.query(insertQuery);
            console.log('Données des utilisateurs initialisées avec succès');
            return true;
        } else {
            console.log('La table Utilisateur contient déjà des données');
            return false;
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des utilisateurs:', error);
        throw error;
    }
}

module.exports = initializeUtilisateurData;

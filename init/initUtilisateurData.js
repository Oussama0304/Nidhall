const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function initializeUtilisateurData() {
    try {
        // Vérifier si la table Utilisateur est vide
        const results = await db.query('SELECT COUNT(*) as count FROM Utilisateur');
        const count = results[0].count;

        if (count === 0) {
            console.log('Initialisation des données des utilisateurs...');
            
            // Les mots de passe sont déjà hashés dans la base de données
            await db.query(`
                INSERT INTO Utilisateur (nom, prenom, telephone, mail, mot_de_passe, matricule, roles)
                VALUES
                ('Admin', 'System', '21612345678', 'admin@pfe.tn', '$2a$10$2EZZzs0Gz9LCva1RU.3fDegZan0cQuLvMGr8zVEdypM6hz8UmcVVu', 9999, 'ADMIN'),
                ('neder', 'boughanmi', '26593757', 'commercial@agil.com', '$2a$10$xL5pVQknFxWtfiEVr2R7leBYmZr18HCD11MWRM9PN20OrhgstXwge', 123456, 'COMMERCIAL'),
                ('rodrigo', 'rodriguez', '23456781', 'gerant.test@station.com', '$2a$10$/IWjTxgiBry/8VIwuUsFu.2Bv0d.5uBIOCKgoNqRcdCHqb.CtpABC', 654321, 'GERANT'),
                ('mouldi', 'aifa', '28456934', 'depot.test@gmail.com', '$2a$10$Or1XUqCJ8cPWlQqeeILsLOgrohixpnwiWK.w/FT5gGuUfx2hkWD/2', 9876554, 'DEPOT'),
                ('brian', 'ruiz', '12365478', 'brian.depot@gmail.com', '$2a$10$qf9INIgYJsOKjLdhiArvA.VSQjme8M27UTumUcIsA1AGM9FBrSaUy', 471852, 'DEPOT'),
                ('oussema', 'boughan', '26593757', 'boughanmi.commercial@agil.com', '$2a$10$7he4/mlhVcwDso6exKbQx.tUEoxeK5POd1gioUGXvD.l9UeDJulNi', 14455, 'COMMERCIAL'),
                ('nidhal', 'boughanmi', '26593757', 'nidhal.boughanmi@gmail.com', '$2a$10$K2lK8692KeqV5LgHIC/YwOWiamSV/vNWpVPZ5Px723hM7BFmEHVU2', 213456, 'GERANT'),
                ('nidhal', 'boughanmi', '26593757', 'nidhal.boughanmi22@gmail.com', '$2a$10$uO1Jb5kaQejIkt3136LnXeW6Nu16h1oOF7/3I5eBn7rV2go0aAgTe', 123455, 'GERANT'),
                ('oussema', 'boughanmi', '25693757', 'oussema123@gmail.com', '$2a$10$/Fo0oONuwSRHlGz7tixR6.em9UsM/e.JLNB2Idbg2KJTiHVJaeNiG', 213654, 'COMMERCIAL'),
                ('oussema', 'boughanmi', '26593775', 'oussema.boughanmni22@gmail.com', '$2a$10$S5qK.FakZso2Q0ncUq6tm.VjjhIBMB1dMLga0mIhMCXxscGa4EdW6', 124563, 'GERANT'),
                ('oussema', 'boughanmi', '26593747', 'oussemaboughanmi@agil.com', '$2a$10$LgkAW6rBAsVO5RFtss/V3uEdrkZwziEB0tMMFZno0TF1T1fypVbVK', 124547, 'COMMERCIAL'),
                ('boughanmi', 'nidhal', '21345679', 'boughanmi123@gmail.com', '$2a$10$Rrx3Wq1fumdpWAZGJc9VC.8YYddfLFLbqMbx9jTovnlEzSqtjKpjq', 987655, 'GERANT'),
                ('boughanmi', 'oussema', '26593757', 'boughanmi.test@gmail.com', '$2a$10$YcUthi4NQzHvXJV5Lai.3u3vM5E7S6DEsacibV2YtyWSseLRwMS/e', 147852, 'DEPOT'),
                ('aloui', 'omar', '26593757', 'omar.aloui@gmail.com', '$2a$10$aupiVTuZTBA9oHeLumJZNuNkgDdITRSgskCd5QEGooj/xElABOoHS', 254136, 'GERANT'),
                ('neila', 'bouali', '28741367', 'neila.bou@gmail.com', '$2a$10$auBwaM4fBVH2IkVneNb40ui3JdbdhtIfHwFQBLAh1hgKcykesn/n2', 5468271, 'DEPOT'),
                ('ameur', 'atef', '26593754', 'amer.atef@gmail.com', '$2a$10$Ggz7f7Nnatb9kWNhDV.8XOEHJmt53NwCd1HQOcNfA4nzaKn9MWY8W', 257413, 'GERANT')
            `);

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

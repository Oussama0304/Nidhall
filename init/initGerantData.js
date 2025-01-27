const db = require('../config/db');

async function initializeGerantData() {
    try {
        // Vérifier si la table Gerant est vide
        const results = await db.query('SELECT COUNT(*) as count FROM Gerant');
        
        if (!results || !results[0] || typeof results[0].count === 'undefined') {
            throw new Error('Erreur lors de la vérification de la table Gerant');
        }

        const count = results[0].count;

        if (count === 0) {
            console.log('Initialisation des données des gérants...');
            
            // D'abord, vérifions que les utilisateurs existent
            const users = await db.query(
                'SELECT identifiant FROM Utilisateur WHERE roles = ?',
                ['GERANT']
            );

            if (!users || users.length === 0) {
                console.log('Aucun utilisateur avec le rôle GERANT n\'existe');
                return false;
            }

            // Ensuite, vérifions que les stations existent
            const stations = await db.query('SELECT idStation FROM StationService');
            
            if (!stations || stations.length === 0) {
                console.log('Aucune station n\'existe');
                return false;
            }

            // Associer chaque gérant à une station
            const values = [];
            const params = [];
            
            for (let i = 0; i < Math.min(users.length, stations.length); i++) {
                values.push('(?, ?)');
                params.push(users[i].identifiant, stations[i].idStation);
            }

            if (values.length > 0) {
                const insertQuery = `
                    INSERT INTO Gerant (idGerant, idStation) 
                    VALUES ${values.join(', ')}`;
                
                await db.query(insertQuery, params);
                console.log('Données des gérants initialisées avec succès');
                return true;
            } else {
                console.log('Pas de données à insérer pour les gérants');
                return false;
            }
        } else {
            console.log('La table Gerant contient déjà des données');
            return false;
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des gérants:', error);
        throw error;
    }
}

module.exports = initializeGerantData;

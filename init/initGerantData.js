const db = require('../config/db');

async function initializeGerantData() {
    try {
        // Vérifier si la table Gerant est vide
        const [result] = await db.execute('SELECT COUNT(*) as count FROM Gerant');
        const count = result[0].count;

        if (count === 0) {
            console.log('Initialisation des données des gérants...');
            
            // D'abord, vérifions que les utilisateurs existent
            const [users] = await db.execute(
                'SELECT identifiant FROM Utilisateur WHERE roles = ?',
                ['GERANT']
            );

            if (users.length === 0) {
                throw new Error('Aucun utilisateur avec le rôle GERANT n\'existe');
            }

            // Ensuite, vérifions que les stations existent
            const [stations] = await db.execute('SELECT idStation FROM StationService');
            
            if (stations.length === 0) {
                throw new Error('Aucune station n\'existe');
            }

            const insertQuery = `
                INSERT INTO Gerant (idGerant, idStation) VALUES
                (?, ?), (?, ?), (?, ?), (?, ?), (?, ?), (?, ?), (?, ?)`;
            
            await db.execute(insertQuery, [
                3, 1,  // rodrigo rodriguez -> Station Test
                7, 2,  // nidhal boughanmi -> station bardo
                8, 3,  // nidhal boughanmi -> station ariana
                10, 4, // oussema boughanmi -> station centre ville
                12, 5, // boughanmi nidhal -> station bizerte
                14, 6, // aloui omar -> station nabeul
                16, 1  // ameur atef -> station ben arous
            ]);

            console.log('Données des gérants initialisées avec succès');
        } else {
            console.log('La table Gerant contient déjà des données');
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des gérants:', error);
        throw error; // Propager l'erreur pour que initializeDatabase puisse la gérer
    }
}

module.exports = initializeGerantData;

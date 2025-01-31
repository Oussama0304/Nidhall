const db = require('../config/db');

async function initializeGerantData() {
    try {
        // Vérifier si la table Gerant est vide
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM Gerant');
        const count = rows[0].count;

        if (count === 0) {
            console.log('Initialisation des données des gérants...');

            // Récupérer les utilisateurs qui ont le rôle GERANT
            const [rows] = await db.execute('SELECT identifiant, nom, prenom, matricule FROM Utilisateur WHERE roles = ?', ['GERANT']);
            const gerants = rows;

            if (gerants.length === 0) {
                console.log('Aucun utilisateur avec le rôle GERANT trouvé');
                return;
            }

            // Préparer les données pour l'insertion
            const values = gerants.map(gerant => {
                return [
                    gerant.identifiant,  // idGerant (même que l'identifiant utilisateur)
                    gerant.nom,
                    gerant.prenom,
                    gerant.matricule,    // matricule
                    Math.floor(10000000 + Math.random() * 90000000), // numGerant (généré aléatoirement)
                    null                 // idStation (sera mis à jour plus tard)
                ];
            });

            // Insérer les gérants
            const insertQuery = `
                INSERT INTO Gerant (idGerant, nom, prenom, matricule, numGerant, idStation)
                VALUES ?`;

            await db.query(insertQuery, [values]);
            console.log('Données des gérants initialisées avec succès');
        } else {
            console.log('La table Gerant contient déjà des données');
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des gérants:', error);
        throw error;
    }
}

module.exports = initializeGerantData;

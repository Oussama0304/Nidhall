const db = require('../config/db');

async function initializeData() {
    try {
        // Vérifier si la table Reclamation est vide
        const [results] = await db.promise().query('SELECT COUNT(*) as count FROM Reclamation');
        const count = results[0].count;

        if (count === 0) {
            console.log('Initialisation des données de réclamation...');
            
            // Préparation des données avec les valeurs JSON correctes
            const reclamations = [
                [1, 3, null, 'hfhhfhfhhfh', '2024-12-08 23:53:39', 'COMMERCIALE', 'Validée', null, null, 'NORMAL', null, null, 'NEUTRE', 'FAIBLE', null, null, null, null, null, null],
                [2, 3, null, 'hvgfchxdgwsdxgcfhgvj', '2024-12-18 11:10:10', 'TECHNIQUE', 'En instance', null, null, 'NORMAL', null, null, 'NEUTRE', 'FAIBLE', null, null, null, null, null, null],
                [3, 3, null, 'lnbhgvfcxdxgchv', '2024-12-18 13:53:08', 'TECHNIQUE', 'En instance', null, '/uploads/reclamations/1734526388342-images.png', 'NORMAL', null, null, 'NEUTRE', 'FAIBLE', null, null, null, null, null, null],
                [4, 3, null, 'panne', '2024-12-18 14:13:37', 'COMMERCIALE', 'En instance', null, '/uploads/reclamations/1734527617578-usecom.PNG', 'NORMAL', null, null, 'NEUTRE', 'FAIBLE', null, null, null, null, null, null],
                [5, 3, null, 'panne com', '2024-12-18 23:17:57', 'COMMERCIALE', 'Validée', null, '/uploads/reclamations/1734560277307-dashger4.PNG', 'NORMAL', null, null, 'NEUTRE', 'FAIBLE', null, null, null, null, null, null],
                [6, 3, null, 'probleme de commande', '2024-12-19 00:37:32', 'COMMERCIALE', 'Validée', null, '/uploads/reclamations/1734565052432-etat.PNG', 'NORMAL', null, null, 'NEUTRE', 'FAIBLE', null, null, null, null, null, null],
                [7, 3, null, 'probleme de prix', '2024-12-19 12:26:25', 'COMMERCIALE', 'Validée', null, '/uploads/reclamations/1734607585169-liv.PNG', 'NORMAL', null, null, 'NEUTRE', 'FAIBLE', null, null, null, null, null, null],
                [8, 3, null, 'probleme de prix', '2024-12-19 12:36:21', 'COMMERCIALE', 'Validée', null, '/uploads/reclamations/1734608181964-liv.PNG', 'NORMAL', null, null, 'NEUTRE', 'FAIBLE', null, null, null, null, null, null],
                [9, 3, null, 'panne technique', '2024-12-19 14:57:08', 'COMMERCIALE', 'En cours', null, '/uploads/reclamations/1734616628308-liv.PNG', 'NORMAL', null, null, 'NEUTRE', 'FAIBLE', null, null, null, null, null, null],
                [10, 3, null, 'Retard de livraison de carburant, le délai habituel n\'a pas été respecté. Besoin d\'une solution rapidement.', '2024-12-20 14:28:05', 'COMMERCIALE', 'En cours', null, '/uploads/reclamations/1734701285247-str.PNG', 'MOYEN', 24, null, 'NEUTRE', 'FAIBLE', null, null, null, null, null, null],
                [11, 3, null, 'Panne urgente du système de pompage, équipement complètement arrêté ! Situation critique nécessitant une intervention immédiate.', '2024-12-20 14:41:34', 'TECHNIQUE', 'En instance', null, '/uploads/reclamations/1734702094290-str.PNG', 'MOYEN', 48, null, 'NEUTRE', 'FAIBLE', null, null, null, null, null, null],
                [12, 3, null, 'grave', '2024-12-20 21:26:20', 'TECHNIQUE', 'En instance', null, '/uploads/reclamations/1734726380344-mern.jpg', 'MOYEN', 48, null, 'PEU_SATISFAIT', 'MOYENNE', -2, null, null, null, null, null],
                [13, 3, 2, 'URGENT ! Panne critique du système de distribution. Situation inacceptable, nous perdons des clients ! Intervention immédiate requise.', '2024-12-20 21:31:05', 'TECHNIQUE', 'En instance', null, null, 'URGENT', 24, null, 'INSATISFAIT', 'HAUTE', -3, null, null, null, null, null],
                [14, 3, null, 'panne grave', '2024-12-20 23:25:53', 'TECHNIQUE', 'En instance', null, null, 'MOYEN', 48, null, 'PEU_SATISFAIT', 'MOYENNE', -2, null, null, null, null, null],
                [15, 3, null, 'panne', '2024-12-20 23:28:32', 'TECHNIQUE', 'En instance', null, '/uploads/reclamations/1734733712207-OIP.jpg', 'MOYEN', 48, null, 'NEUTRE', 'MOYENNE', 0, null, null, null, null, null],
                [16, 3, null, 'panne urgente', '2024-12-20 23:33:16', 'TECHNIQUE', 'En instance', null, '/uploads/reclamations/1734733996246-OIP.jpg', 'MOYEN', 48, null, 'NEUTRE', 'MOYENNE', 0, null, null, '{"metadata":{"width":474,"height":632,"format":"jpeg"}}', null, null],
                [17, 3, null, 'panne', '2024-12-20 23:44:49', 'TECHNIQUE', 'En instance', null, '/uploads/reclamations/1734734689421-OIP.jpg', 'MOYEN', 48, null, 'NEUTRE', 'MOYENNE', 0, null, null, '{"metadata":{"width":474,"height":632,"format":"jpeg"}}', null, null],
                [18, 3, null, 'panne', '2024-12-21 15:12:36', 'COMMERCIALE', 'En instance', null, '/uploads/reclamations/1734790355781-OIP.jpg', 'MOYEN', 48, null, 'NEUTRE', 'MOYENNE', 0, null, null, '{"metadata":{"width":474,"height":632,"format":"jpeg"}}', null, null],
                [19, 3, null, 'panne grave urgente', '2024-12-22 12:18:36', 'TECHNIQUE', 'En instance', null, '/uploads/reclamations/1734866315866-OIP.jpg', 'MOYEN', 48, null, 'PEU_SATISFAIT', 'MOYENNE', -2, null, null, '{"metadata":{"width":474,"height":632,"format":"jpeg"}}', null, null],
                [20, 3, 2, 'panne des pistolé', '2024-12-22 12:31:39', 'COMMERCIALE', 'En instance', null, '/uploads/reclamations/1734867098375-maxnewsfrthree.jpg', 'MOYEN', 48, null, 'NEUTRE', 'MOYENNE', 0, null, null, '{"metadata":{"width":474,"height":632,"format":"jpeg"}}', 'ouiii', '2024-12-26 09:50:57'],
                [21, 2, null, 'panne de jauge d essence', '2024-12-22 12:49:42', 'TECHNIQUE', 'Validée', null, '/uploads/reclamations/1734868182053-maxnewsfrthree.jpg', 'MOYEN', 48, null, 'NEUTRE', 'MOYENNE', 0, null, null, '{"metadata":{"width":474,"height":632,"format":"jpeg"}}', 'Cher gérant,...', '2024-12-23 14:29:21'],
                [22, 2, null, 'panne commercial', '2024-12-22 12:59:06', 'TECHNIQUE', 'Validée', null, '/uploads/reclamations/1734868745738-OIP (1).jpg', 'MOYEN', 48, null, 'NEUTRE', 'MOYENNE', 0, null, null, '{"metadata":{"width":474,"height":632,"format":"jpeg"}}', 'traité', '2024-12-24 14:29:46'],
                [23, 3, null, 'panne grave', '2024-12-30 10:32:07', 'TECHNIQUE', 'En instance', null, '/uploads/reclamations/1735551126749-gaz.jpg', 'MOYEN', 48, null, 'PEU_SATISFAIT', 'MOYENNE', -2, null, null, null, null, null],
                [24, 1, null, 'panne de paiment', '2025-01-08 23:40:29', 'COMMERCIALE', 'En instance', null, '/uploads/reclamations/1736376024636-OIP (2).jpg', 'MOYEN', 48, null, 'NEUTRE', 'MOYENNE', 0, null, null, null, null, null],
                [25, 2, null, 'panne', '2025-01-09 23:43:54', 'TECHNIQUE', 'En instance', null, '/uploads/reclamations/1736462628654-gaz.jpg', 'MOYEN', 48, null, 'NEUTRE', 'MOYENNE', 0, null, null, null, null, null]
            ];

            const query = `
                INSERT INTO Reclamation (
                    idReclamation, idGerant, idCommercial, description, date, 
                    type, etat, material, image_url, priority, 
                    estimatedResolutionTime, actualResolutionTime, satisfaction, 
                    gravite, sentiment_score, suggestedActions, aiConfidence, 
                    image_analysis, reponse, date_reponse
                ) VALUES ?
            `;

            await db.promise().query(query, [reclamations]);
            console.log('Données des réclamations insérées avec succès');
        } else {
            console.log('Les données existent déjà dans la table Reclamation');
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des données:', error);
        throw error;
    }
}

module.exports = initializeData;

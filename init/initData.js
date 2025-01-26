const db = require('../config/db');

async function initializeData() {
    try {
        // Vérifier si la table Reclamation est vide
        const [results] = await db.query('SELECT COUNT(*) as count FROM Reclamation');
        const count = results[0].count;

        if (count === 0) {
            console.log('Initialisation des données de réclamation...');
            
            // Insérer les données initiales
            const insertQuery = `
                INSERT INTO Reclamation (idReclamation, idGerant, idCommercial, description, date, type, etat, material, image_url, priority, estimatedResolutionTime, actualResolutionTime, satisfaction, gravite, sentiment_score, suggestedActions, aiConfidence, image_analysis, reponse, date_reponse)
                VALUES
                (1, 3, NULL, 'hfhhfhfhhfh', '2024-12-08 23:53:39', 'COMMERCIALE', 'Validée', NULL, NULL, 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL),
                (2, 3, NULL, 'hvgfchxdgwsdxgcfhgvj', '2024-12-18 11:10:10', 'TECHNIQUE', 'En instance', NULL, NULL, 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL),
                (3, 3, NULL, 'lnbhgvfcxdxgchv', '2024-12-18 13:53:08', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1734526388342-images.png', 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL),
                (4, 3, NULL, 'panne', '2024-12-18 14:13:37', 'COMMERCIALE', 'En instance', NULL, '/uploads/reclamations/1734527617578-usecom.PNG', 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL),
                (5, 3, NULL, 'panne com', '2024-12-18 23:17:57', 'COMMERCIALE', 'Validée', NULL, '/uploads/reclamations/1734560277307-dashger4.PNG', 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL),
                (6, 3, NULL, 'probleme de commande', '2024-12-19 00:37:32', 'COMMERCIALE', 'Validée', NULL, '/uploads/reclamations/1734565052432-etat.PNG', 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL),
                (7, 3, NULL, 'probleme de prix', '2024-12-19 12:26:25', 'COMMERCIALE', 'Validée', NULL, '/uploads/reclamations/1734607585169-liv.PNG', 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL),
                (8, 3, NULL, 'probleme de prix', '2024-12-19 12:36:21', 'COMMERCIALE', 'Validée', NULL, '/uploads/reclamations/1734608181964-liv.PNG', 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL),
                (9, 3, NULL, 'panne technique', '2024-12-19 14:57:08', 'COMMERCIALE', 'En cours', NULL, '/uploads/reclamations/1734616628308-liv.PNG', 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL),
                (10, 3, NULL, 'Retard de livraison de carburant, le délai habituel n\\'a pas été respecté. Besoin d\\'une solution rapidement.', '2024-12-20 14:28:05', 'COMMERCIALE', 'En cours', NULL, '/uploads/reclamations/1734701285247-str.PNG', 'MOYEN', 24, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL),
                (11, 3, NULL, 'Panne urgente du système de pompage, équipement complètement arrêté ! Situation critique nécessitant une intervention immédiate.', '2024-12-20 14:41:34', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1734702094290-str.PNG', 'MOYEN', 48, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL),
                (12, 3, NULL, 'grave', '2024-12-20 21:26:20', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1734726380344-mern.jpg', 'MOYEN', 48, NULL, 'PEU_SATISFAIT', 'MOYENNE', -2, NULL, NULL, NULL, NULL, NULL),
                (13, 3, 2, 'URGENT ! Panne critique du système de distribution. Situation inacceptable, nous perdons des clients ! Intervention immédiate requise.', '2024-12-20 21:31:05', 'TECHNIQUE', 'En instance', NULL, NULL, 'URGENT', 24, NULL, 'INSATISFAIT', 'HAUTE', -3, NULL, NULL, NULL, NULL, NULL),
                (14, 3, NULL, 'panne grave', '2024-12-20 23:25:53', 'TECHNIQUE', 'En instance', NULL, NULL, 'MOYEN', 48, NULL, 'PEU_SATISFAIT', 'MOYENNE', -2, NULL, NULL, NULL, NULL, NULL),
                (15, 3, NULL, 'panne', '2024-12-20 23:28:32', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1734733712207-OIP.jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, NULL, NULL, NULL),
                (16, 3, NULL, 'panne urgente', '2024-12-20 23:33:16', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1734733996246-OIP.jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, ?, NULL, NULL),
                (17, 3, NULL, 'panne', '2024-12-20 23:44:49', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1734734689421-OIP.jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, ?, NULL, NULL),
                (18, 3, NULL, 'panne', '2024-12-21 15:12:36', 'COMMERCIALE', 'En instance', NULL, '/uploads/reclamations/1734790355781-OIP.jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, ?, NULL, NULL),
                (19, 3, NULL, 'panne grave urgente', '2024-12-22 12:18:36', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1734866315866-OIP.jpg', 'MOYEN', 48, NULL, 'PEU_SATISFAIT', 'MOYENNE', -2, NULL, NULL, ?, NULL, NULL),
                (20, 3, 2, 'panne des pistolé', '2024-12-22 12:31:39', 'COMMERCIALE', 'En instance', NULL, '/uploads/reclamations/1734867098375-maxnewsfrthree.jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, ?, 'ouiii', '2024-12-26 09:50:57'),
                (21, 2, NULL, 'panne de jauge d essence', '2024-12-22 12:49:42', 'TECHNIQUE', 'Validée', NULL, '/uploads/reclamations/1734868182053-maxnewsfrthree.jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, ?, 'Cher gérant,...', '2024-12-23 14:29:21'),
                (22, 2, NULL, 'panne commercial', '2024-12-22 12:59:06', 'TECHNIQUE', 'Validée', NULL, '/uploads/reclamations/1734868745738-OIP (1).jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, ?, 'traité', '2024-12-24 14:29:46'),
                (23, 3, NULL, 'panne grave', '2024-12-30 10:32:07', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1735551126749-gaz.jpg', 'MOYEN', 48, NULL, 'PEU_SATISFAIT', 'MOYENNE', -2, NULL, NULL, NULL, NULL, NULL),
                (24, 1, NULL, 'panne de paiment', '2025-01-08 23:40:29', 'COMMERCIALE', 'En instance', NULL, '/uploads/reclamations/1736376024636-OIP (2).jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, NULL, NULL, NULL),
                (25, 2, NULL, 'panne', '2025-01-09 23:43:54', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1736462628654-gaz.jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, NULL, NULL, NULL)
            `;
            
            await db.query(insertQuery);
            console.log('Données de réclamation initialisées avec succès');
        } else {
            console.log('La table Reclamation contient déjà des données');
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des données:', error);
    }
}

module.exports = initializeData;

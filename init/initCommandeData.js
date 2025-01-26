const db = require('../config/db');

async function initializeCommandeData() {
    try {
        // Vérifier si la table Commande est vide
        const results = await db.query('SELECT COUNT(*) as count FROM Commande');
        const count = results[0].count;

        if (count === 0) {
            console.log('Initialisation des données des commandes...');
            
            await db.query(`
                INSERT INTO Commande (idCommande, montant, date, idProduit, idUtilisateur, etat, RefCommande, idDepot, note)
                VALUES
                (1, 2800, '2024-12-07 21:47:24', NULL, 3, 'En instance', 'CMD1733604444435', NULL, NULL),
                (2, 2800, '2024-12-07 21:47:58', NULL, 3, 'En instance', 'CMD1733604478485', NULL, NULL),
                (3, 2800, '2024-12-07 21:54:12', NULL, 3, 'En instance', 'CMD1733604852895', NULL, NULL),
                (4, 2800, '2024-12-07 22:03:49', NULL, 3, 'En cours', 'CMD1733605429409', NULL, NULL),
                (5, 5600, '2024-12-07 23:28:04', NULL, 3, 'En cours', 'CMD1733610484417', NULL, NULL),
                (6, 2800, '2024-12-07 23:31:46', NULL, 3, 'En cours', 'CMD1733610706353', NULL, NULL),
                (7, 2800, '2024-12-07 23:42:32', NULL, 3, 'En cours', 'CMD1733611352753', NULL, NULL),
                (8, 70000, '2024-12-08 13:29:48', NULL, 3, 'En cours', 'CMD1733660988368', NULL, NULL),
                (9, 2800, '2024-12-16 16:15:31', NULL, 3, 'En cours', 'CMD1734362131094', NULL, NULL),
                (10, 8400, '2024-12-18 14:15:03', NULL, 3, 'En instance', 'CMD1734527702994', NULL, NULL),
                (11, 140000, '2024-12-18 15:16:33', NULL, 3, 'En cours', 'CMD1734531393702', NULL, NULL),
                (12, 70000, '2024-12-18 23:08:36', NULL, 3, 'En cours', 'CMD1734559716626', NULL, NULL),
                (13, 2800, '2024-12-18 23:16:46', NULL, 3, 'En instance', 'CMD1734560206344', NULL, NULL),
                (14, 140000, '2024-12-18 23:38:33', NULL, 3, 'En instance', 'CMD1734561513804', NULL, NULL),
                (15, 156000, '2024-12-19 00:36:39', NULL, 3, 'En instance', 'CMD1734564999329', NULL, NULL),
                (16, 8400, '2024-12-19 12:25:52', NULL, 3, 'En instance', 'CMD1734607552720', NULL, NULL),
                (17, 11200, '2024-12-19 12:35:33', NULL, 3, 'En instance', 'CMD1734608133948', NULL, NULL),
                (18, 11200, '2024-12-19 14:57:51', NULL, 3, 'En instance', 'CMD1734616671389', NULL, NULL),
                (19, 14000, '2024-12-27 23:40:12', NULL, 3, 'En instance', 'CMD1735339212106', NULL, NULL),
                (20, 8400, '2024-12-27 23:42:27', NULL, 3, 'En instance', 'CMD1735339347614', NULL, NULL),
                (21, 2800, '2024-12-27 23:43:56', NULL, 3, 'En instance', 'CMD1735339436155', NULL, NULL),
                (22, 2800, '2024-12-27 23:47:39', NULL, 3, 'En instance', 'CMD1735339659784', NULL, NULL),
                (23, 2800, '2024-12-27 23:55:33', NULL, 3, 'En instance', 'CMD1735340133239', NULL, NULL),
                (24, 76400, '2024-12-30 10:31:08', NULL, 3, 'En instance', 'CMD1735551068135', NULL, NULL),
                (25, 16800, '2025-01-08 15:09:47', NULL, 3, 'En instance', 'CMD1736345387714', NULL, NULL)
            `);

            console.log('Données des commandes initialisées avec succès');
        } else {
            console.log('La table Commande contient déjà des données');
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des commandes:', error);
        throw error;
    }
}

module.exports = initializeCommandeData;

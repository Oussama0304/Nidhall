-- Désactiver les contraintes de clés étrangères temporairement
SET FOREIGN_KEY_CHECKS = 0;

-- Réinitialiser les tables
TRUNCATE TABLE commande;
TRUNCATE TABLE commandeproduit;
TRUNCATE TABLE produit;
TRUNCATE TABLE livraison;
TRUNCATE TABLE mouvementstock;
TRUNCATE TABLE reclamation;

-- Insertion des données dans la table produit
INSERT INTO produit (idProduit, nom, disponibilite, prix, CODPRD, LIBPRD, CODEMB, LIBEMB, TYPPRD, quantite, seuil_alerte) VALUES
(1, 'sans plomb', 'non disponible', 2550, '', '', '', '', '', 100, 10),
(2, 'gazoil 50', 'non disponible', 2800, '0101111', 'gazoil', '', '', 'CARBURANT', 65, 10),
(3, 'castrol ', 'disponible', 70000, '0101112', 'huile', '', '', 'LUBRIFIANT', -6, 10),
(4, 'castrol ', 'dispo', 70007, '122234', 'huile', '', '', 'LUBRIFIANT', 10, 10),
(5, 'castrol ', 'non disponible', 68000, '12228', 'huile', '', '', 'LUBRIFIANT', -51, 10),
(6, 'castrol ', 'non disponible', 56000, '0101122', 'huile', '', '', 'LUBRIFIANT', 0, 10),
(7, 'castrol ', 'dispo', 52000, '0101123', 'huile', '', '', 'LUBRIFIANT', -3, 10),
(8, 'shell huilux ', 'dispo', 58000, '0101128', 'huile', '', '', 'LUBRIFIANT', 0, 10),
(9, 'shell huilux ', 'dispo', 58000, '0101128', 'huile', '', '', 'LUBRIFIANT', 0, 10),
(10, 'shell', 'disponible', 54000, '0101111', 'huile', '', '', 'LUBRIFIANT', 0, 10),
(11, 'castrol ', 'disponible', 70000, '0101112', 'huile', '', '', 'LUBRIFIANT', 0, 10),
(12, 'castrol ', 'disponible', 70000, '0101112', 'huile', '', '', 'LUBRIFIANT', 0, 10);

-- Insertion des données dans la table commande
INSERT INTO commande (idCommande, montant, date, idProduit, idUtilisateur, etat, RefCommande, depot_id, note) VALUES
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
(25, 16800, '2025-01-08 15:09:47', NULL, 3, 'En instance', 'CMD1736345387714', NULL, NULL);

-- Insertion des données dans la table commandeproduit
INSERT INTO commandeproduit (id, idCommande, idProduit, quantite, prix) VALUES
(2, 4, 2, 1, 2800.00),
(3, 5, 2, 2, 2800.00),
(4, 6, 2, 1, 2800.00),
(5, 7, 2, 1, 2800.00),
(6, 8, 3, 1, 70000.00),
(7, 9, 2, 1, 2800.00),
(8, 10, 2, 3, 2800.00),
(9, 11, 3, 2, 70000.00),
(10, 12, 3, 1, 70000.00),
(11, 13, 2, 1, 2800.00),
(12, 14, 3, 2, 70000.00),
(13, 15, 7, 3, 52000.00),
(14, 16, 2, 3, 2800.00),
(15, 17, 2, 4, 2800.00),
(16, 18, 2, 4, 2800.00),
(21, 23, 2, 1, 2800.00),
(22, 24, 2, 3, 2800.00),
(23, 24, 5, 1, 68000.00),
(24, 25, 2, 6, 2800.00);

-- Insertion des données dans la table livraison
INSERT INTO livraison (idLivraison, idCommande, dateLivraison, numChauffeur, quantiteLv) VALUES
(1, 4, '2024-12-18 15:40:42', 0, 0),
(2, 4, '2024-12-19 00:39:35', 0, 0),
(3, 6, '2024-12-19 00:39:46', 0, 0),
(4, 4, '2024-12-19 12:27:45', 0, 0),
(5, 11, '2024-12-19 12:38:37', 0, 0),
(6, 5, '2024-12-19 15:00:21', 0, 0),
(7, 6, '2024-12-24 21:29:56', 0, 0),
(8, 7, '2024-12-24 21:31:40', 0, 0),
(9, 4, '2024-12-24 21:45:52', 0, 0),
(10, 6, '2024-12-24 23:07:38', 0, 0),
(11, 5, '2024-12-29 14:35:03', 0, 0),
(12, 4, '2024-12-30 10:35:17', 0, 0);

-- Insertion des données dans la table mouvementstock
INSERT INTO mouvementstock (id, idProduit, quantite, type_mouvement, date_mouvement, idCommande, raison) VALUES
(1, 4, 10, 'ENTREE', '2024-12-27 14:23:48', NULL, 'Réapprovisionnement'),
(2, 5, 50, 'RETRAIT', '2024-12-27 14:25:43', NULL, 'Réapprovisionnement'),
(3, 2, 3, 'RETRAIT', '2024-12-27 22:42:27', 20, NULL),
(4, 2, 1, 'RETRAIT', '2024-12-27 22:43:56', 21, NULL);

-- Insertion des données dans la table reclamation
INSERT INTO reclamation (idReclamation, idGerant, idCommercial, description, date, type, etat, material, image_url, priority, estimatedResolutionTime, actualResolutionTime, satisfaction, gravite, sentiment_score) VALUES
(1, 3, NULL, 'hfhhfhfhhfh', '2024-12-08 23:53:39', 'COMMERCIALE', 'Validée', NULL, NULL, 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL),
(2, 3, NULL, 'hvgfchxdgwsdxgcfhgvj', '2024-12-18 11:10:10', 'TECHNIQUE', 'En instance', NULL, NULL, 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL),
(3, 3, NULL, 'lnbhgvfcxdxgchv', '2024-12-18 13:53:08', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1734526388342-images.png', 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL);

-- Réactiver les contraintes de clés étrangères
SET FOREIGN_KEY_CHECKS = 1;

-- Fix the Reclamation table data
DELETE FROM Reclamation;

-- Re-insert data with correct column count
INSERT INTO Reclamation (idReclamation, idGerant, idCommercial, description, date, type, etat, material, image_url, priority, estimatedResolutionTime, actualResolutionTime, satisfaction, gravite, sentiment_score, suggestedActions, aiConfidence, image_analysis, reponse, date_reponse)
VALUES
(1, 3, NULL, 'hfhhfhfhhfh', '2024-12-08 23:53:39', 'COMMERCIALE', 'Validée', NULL, NULL, 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL),
(2, 3, NULL, 'hvgfchxdgwsdxgcfhgvj', '2024-12-18 11:10:10', 'TECHNIQUE', 'En instance', NULL, NULL, 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL),
(3, 3, NULL, 'lnbhgvfcxdxgchv', '2024-12-18 13:53:08', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1734526388342-images.png', 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL),
(17, 3, NULL, 'panne', '2024-12-20 23:44:49', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1734734689421-OIP.jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, NULL, NULL, NULL),
(18, 3, NULL, 'panne', '2024-12-21 15:12:36', 'COMMERCIALE', 'En instance', NULL, '/uploads/reclamations/1734790355781-OIP.jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, NULL, NULL, NULL),
(19, 3, NULL, 'panne grave urgente', '2024-12-22 12:18:36', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1734866315866-OIP.jpg', 'MOYEN', 48, NULL, 'PEU_SATISFAIT', 'MOYENNE', -2, NULL, NULL, NULL, NULL, NULL),
(20, 3, 2, 'panne des pistolé', '2024-12-22 12:31:39', 'COMMERCIALE', 'En instance', NULL, '/uploads/reclamations/1734867098375-maxnewsfrthree.jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, NULL, 'ouiii', '2024-12-26 09:50:57'),
(21, 2, NULL, 'panne de jauge d essence ', '2024-12-22 12:49:42', 'TECHNIQUE', 'Validée', NULL, '/uploads/reclamations/1734868182053-maxnewsfrthree.jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, NULL, 'Cher gérant...', '2024-12-23 14:29:21'),
(22, 2, NULL, 'panne commercial', '2024-12-22 12:59:06', 'TECHNIQUE', 'Validée', NULL, '/uploads/reclamations/1734868745738-OIP (1).jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, NULL, 'traité', '2024-12-24 14:29:46'),
(23, 3, NULL, 'panne grave', '2024-12-30 10:32:07', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1735551126749-gaz.jpg', 'MOYEN', 48, NULL, 'PEU_SATISFAIT', 'MOYENNE', -2, NULL, NULL, NULL, NULL, NULL),
(24, 1, NULL, 'panne de paiment ', '2025-01-08 23:40:29', 'COMMERCIALE', 'En instance', NULL, '/uploads/reclamations/1736376024636-OIP (2).jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, NULL, NULL, NULL),
(25, 2, NULL, 'panne', '2025-01-09 23:43:54', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1736462628654-gaz.jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, NULL, NULL, NULL);

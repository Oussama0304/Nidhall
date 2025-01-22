INSERT INTO Mouvementstock (idProduit, quantite, type_mouvement, date_mouvement, idCommande, raison)
VALUES 
(1, 2000, 'ENTREE', '2024-01-22 08:00:00', 1, 'Réception commande'),
(2, 3000, 'ENTREE', '2024-01-22 10:30:00', 2, 'Réception commande'),
(3, -1000, 'RETRAIT', '2024-01-22 13:15:00', NULL, 'Vente journalière'),
(4, 50, 'ENTREE', '2024-01-22 15:00:00', 4, 'Réception commande'),
(5, -10, 'RETRAIT', '2024-01-22 09:00:00', NULL, 'Vente client');

INSERT INTO Commande (montant, date, idProduit, idUtilisateur, etat, RefCommande, idDepot, note)
VALUES 
(4800.00, '2024-01-22 10:00:00', 1, 1, 'Validée', 'CMD-2024-001', 1, 'Livraison urgente'),
(5700.00, '2024-01-22 11:30:00', 2, 2, 'En cours', 'CMD-2024-002', 2, 'Livraison standard'),
(3200.00, '2024-01-22 14:15:00', 3, 3, 'En instance', 'CMD-2024-003', 1, 'Attente confirmation'),
(2250.00, '2024-01-22 16:00:00', 4, 1, 'Validée', 'CMD-2024-004', 3, 'Commande hebdomadaire'),
(1650.00, '2024-01-22 09:00:00', 5, 2, 'En cours', 'CMD-2024-005', 2, 'Commande mensuelle');

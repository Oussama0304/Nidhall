-- Initialisation des données de la table reclamation
INSERT INTO reclamation (id, titre, description, date_creation, statut, priorite, type_reclamation, id_utilisateur, id_gerant)
VALUES 
(1, 'Problème de livraison carburant', 'Le camion de livraison est en retard de 2 heures', '2024-01-22 10:00:00', 'En attente', 'Haute', 'Livraison', 1, 1),
(2, 'Panne pompe à essence', 'La pompe numéro 3 ne fonctionne plus correctement', '2024-01-22 11:30:00', 'En cours', 'Urgente', 'Technique', 2, 2),
(3, 'Stock insuffisant', 'Niveau critique de carburant diesel', '2024-01-22 14:15:00', 'En attente', 'Moyenne', 'Stock', 1, 3),
(4, 'Problème de facturation', 'Erreur sur le montant de la dernière facture', '2024-01-22 16:00:00', 'Nouveau', 'Basse', 'Facturation', 3, 1),
(5, 'Maintenance préventive', 'Demande de vérification des équipements', '2024-01-22 09:00:00', 'Planifié', 'Normale', 'Maintenance', 2, 2);

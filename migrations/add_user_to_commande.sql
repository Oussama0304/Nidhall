USE ProjetPfeAgil;

-- Ajout de la colonne idUtilisateur
ALTER TABLE COMMANDE
ADD COLUMN idUtilisateur BIGINT,
ADD CONSTRAINT fk_commande_utilisateur
FOREIGN KEY (idUtilisateur) REFERENCES UTILISATEUR(identifiant);

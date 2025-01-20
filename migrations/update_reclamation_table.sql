-- Add new columns to Reclamation table
ALTER TABLE Reclamation 
ADD COLUMN reponse TEXT,
ADD COLUMN date_reponse DATETIME,
MODIFY COLUMN etat ENUM('En instance', 'EN_TRAITEMENT', 'RESOLU', 'EN_ATTENTE') NOT NULL DEFAULT 'En instance';

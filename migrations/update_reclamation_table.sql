-- Add new columns to Reclamation table
ALTER TABLE RECLAMATION 
ADD COLUMN reponse TEXT,
ADD COLUMN date_reponse DATETIME,
MODIFY COLUMN etat ENUM('En instance', 'EN_TRAITEMENT', 'RESOLU', 'EN_ATTENTE') NOT NULL DEFAULT 'En instance';

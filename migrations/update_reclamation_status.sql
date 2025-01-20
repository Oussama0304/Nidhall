-- First update existing statuses to match new enum values
UPDATE Reclamation SET etat = 'En instance' WHERE etat = 'En instance';
UPDATE Reclamation SET etat = 'EN_TRAITEMENT' WHERE etat = 'En cours';
UPDATE Reclamation SET etat = 'RESOLU' WHERE etat = 'Validée';

-- Then modify the column
ALTER TABLE Reclamation 
ADD COLUMN IF NOT EXISTS reponse TEXT,
ADD COLUMN IF NOT EXISTS date_reponse DATETIME;

-- Update enum values
ALTER TABLE Reclamation 
MODIFY COLUMN etat VARCHAR(20) NOT NULL DEFAULT 'En instance';

ALTER TABLE Reclamation 
MODIFY COLUMN etat ENUM('En instance', 'EN_TRAITEMENT', 'RESOLU', 'EN_ATTENTE') NOT NULL DEFAULT 'En instance';

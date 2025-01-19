-- Add response fields to Reclamation table
ALTER TABLE Reclamation 
ADD COLUMN IF NOT EXISTS reponse TEXT,
ADD COLUMN IF NOT EXISTS date_reponse DATETIME;

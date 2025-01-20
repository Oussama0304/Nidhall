-- Add image_url column to Reclamation table if it doesn't exist
ALTER TABLE Reclamation 
ADD COLUMN IF NOT EXISTS image_url VARCHAR(255);

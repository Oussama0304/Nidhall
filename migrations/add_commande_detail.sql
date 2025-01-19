-- Create CommandeDetail table
CREATE TABLE IF NOT EXISTS COMMANDEDETAIL (
    idDetail INT PRIMARY KEY AUTO_INCREMENT,
    idCommande INT NOT NULL,
    idProduit INT NOT NULL,
    quantite INT NOT NULL,
    prix DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (idCommande) REFERENCES COMMANDE(idCommande),
    FOREIGN KEY (idProduit) REFERENCES PRODUIT(idProduit),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add description field to Commande table if it doesn't exist
ALTER TABLE COMMANDE
ADD COLUMN IF NOT EXISTS description VARCHAR(255) NULL;

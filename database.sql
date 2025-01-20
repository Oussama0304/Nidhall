-- Create database
CREATE DATABASE IF NOT EXISTS ProjetPfeAgil;
USE ProjetPfeAgil;

-- Create Utilisateur table
CREATE TABLE IF NOT EXISTS Utilisateur (
    identifiant BIGINT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    telephone VARCHAR(20),
    mail VARCHAR(100) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    matricule BIGINT UNIQUE NOT NULL,
    roles ENUM('ADMIN', 'GERANT', 'COMMERCIAL', 'DEPOT', 'ELECTROMECANIQUE', 'TECHNIQUE') NOT NULL
);

-- Create StationService table
CREATE TABLE IF NOT EXISTS StationService (
    idStation BIGINT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    adresse TEXT NOT NULL,
    ville VARCHAR(100),
    telephone VARCHAR(20),
    email VARCHAR(100),
    capacite INT
);

-- Create Gerant table
CREATE TABLE IF NOT EXISTS Gerant (
    idGerant BIGINT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    matricule BIGINT UNIQUE NOT NULL,
    numGerant BIGINT UNIQUE NOT NULL,
    idStation BIGINT,
    FOREIGN KEY (idStation) REFERENCES StationService(idStation),
    FOREIGN KEY (idGerant) REFERENCES Utilisateur(identifiant)
);

-- Create Produit table
CREATE TABLE IF NOT EXISTS Produit (
    idProduit BIGINT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    disponibilite VARCHAR(50),
    prix FLOAT NOT NULL,
    CODPRD VARCHAR(20),
    LIBPRD VARCHAR(100),
    CODEMB VARCHAR(20),
    LIBEMB VARCHAR(100),
    TYPPRD VARCHAR(50),
    quantite INT DEFAULT 0,
    seuil_alerte INT DEFAULT 10
);

-- Create Depot table
CREATE TABLE IF NOT EXISTS Depot (
    idDepot BIGINT PRIMARY KEY AUTO_INCREMENT,
    nomDepot VARCHAR(100) NOT NULL,
    adresse TEXT NOT NULL
);

-- Create Commande table
CREATE TABLE IF NOT EXISTS Commande (
    idCommande BIGINT PRIMARY KEY AUTO_INCREMENT,
    montant FLOAT NOT NULL,
    date DATETIME NOT NULL,
    idProduit BIGINT,
    idUtilisateur BIGINT,
    etat ENUM('En instance', 'En cours', 'Validée') NOT NULL DEFAULT 'En instance',
    RefCommande VARCHAR(50) UNIQUE NOT NULL,
    depot_id INT DEFAULT NULL,
    note TEXT DEFAULT NULL,
    FOREIGN KEY (idProduit) REFERENCES Produit(idProduit),
    FOREIGN KEY (idUtilisateur) REFERENCES Utilisateur(identifiant),
    FOREIGN KEY (depot_id) REFERENCES Depot(idDepot)
);

-- Create Livraison table
CREATE TABLE IF NOT EXISTS Livraison (
    idLivraison BIGINT PRIMARY KEY AUTO_INCREMENT,
    idCommande BIGINT,
    dateLivraison DATETIME NOT NULL,
    numChauffeur BIGINT NOT NULL,
    quantiteLv FLOAT NOT NULL,
    FOREIGN KEY (idCommande) REFERENCES Commande(idCommande)
);

-- Create Material table
CREATE TABLE IF NOT EXISTS Material (
    idStation BIGINT,
    Actif VARCHAR(50) NOT NULL,
    Description TEXT,
    Emplacement VARCHAR(100),
    status VARCHAR(50),
    FOREIGN KEY (idStation) REFERENCES StationService(idStation)
);

-- Create Reclamation table
CREATE TABLE IF NOT EXISTS Reclamation (
    idReclamation BIGINT PRIMARY KEY AUTO_INCREMENT,
    idGerant BIGINT,
    idCommercial BIGINT,
    description TEXT NOT NULL,
    date DATETIME NOT NULL,
    type ENUM('TECHNIQUE', 'COMMERCIALE') NOT NULL,
    etat ENUM('En instance', 'En cours', 'Validée') NOT NULL DEFAULT 'En instance',
    material VARCHAR(50),
    image_url VARCHAR(255) DEFAULT NULL,
    priority ENUM('URGENT', 'MOYEN', 'NORMAL') DEFAULT 'NORMAL',
    estimatedResolutionTime INT DEFAULT NULL,
    actualResolutionTime INT DEFAULT NULL,
    satisfaction ENUM('TRES_SATISFAIT', 'SATISFAIT', 'NEUTRE', 'PEU_SATISFAIT', 'INSATISFAIT') DEFAULT 'NEUTRE',
    gravite ENUM('HAUTE', 'MOYENNE', 'FAIBLE') DEFAULT 'FAIBLE',
    sentiment_score FLOAT DEFAULT NULL,
    suggestedActions TEXT DEFAULT NULL,
    aiConfidence JSON DEFAULT NULL CHECK (JSON_VALID(aiConfidence)),
    image_analysis JSON DEFAULT NULL CHECK (JSON_VALID(image_analysis)),
    reponse TEXT DEFAULT NULL,
    date_reponse DATETIME DEFAULT NULL,
    FOREIGN KEY (idGerant) REFERENCES Gerant(idGerant),
    FOREIGN KEY (idCommercial) REFERENCES Utilisateur(identifiant)
);

-- Create Commandeproduit table
CREATE TABLE IF NOT EXISTS Commandeproduit (
    id INT PRIMARY KEY AUTO_INCREMENT,
    idCommande INT NOT NULL,
    idProduit INT NOT NULL,
    quantite INT NOT NULL,
    prix DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (idCommande) REFERENCES Commande(idCommande),
    FOREIGN KEY (idProduit) REFERENCES Produit(idProduit)
);

-- Create Mouvementstock table
CREATE TABLE IF NOT EXISTS Mouvementstock (
    id INT PRIMARY KEY AUTO_INCREMENT,
    idProduit INT DEFAULT NULL,
    quantite INT DEFAULT NULL,
    type_mouvement ENUM('ENTREE', 'RETRAIT', 'AJUSTEMENT') DEFAULT NULL,
    date_mouvement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    idCommande INT DEFAULT NULL,
    raison TEXT DEFAULT NULL,
    FOREIGN KEY (idProduit) REFERENCES Produit(idProduit),
    FOREIGN KEY (idCommande) REFERENCES Commande(idCommande)
);

-- Create Equipmentsensors table
CREATE TABLE IF NOT EXISTS Equipmentsensors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    equipment_id INT DEFAULT NULL,
    temperature FLOAT DEFAULT NULL,
    pressure FLOAT DEFAULT NULL,
    vibration FLOAT DEFAULT NULL,
    timestamp DATETIME DEFAULT NULL,
    location VARCHAR(255) DEFAULT NULL
);

-- Create Maintenanceanalytics table
CREATE TABLE IF NOT EXISTS Maintenanceanalytics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    equipment_id INT DEFAULT NULL,
    prediction_date DATETIME DEFAULT NULL,
    failure_probability FLOAT DEFAULT NULL,
    recommended_actions TEXT DEFAULT NULL,
    maintenance_priority VARCHAR(50) DEFAULT NULL,
    estimated_costs JSON DEFAULT NULL CHECK (JSON_VALID(estimated_costs)),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP(),
    FOREIGN KEY (equipment_id) REFERENCES Equipmentsensors(id)
);

-- Insert initial data into Utilisateur
DELETE FROM Utilisateur WHERE mail = 'admin@pfe.tn';
INSERT INTO Utilisateur (nom, prenom, telephone, mail, mot_de_passe, matricule, roles)
VALUES (
    'Admin',
    'System',
    '21612345678',
    'admin@pfe.tn',
    '$2a$10$2EZZzs0Gz9LCva1RU.3fDegZan0cQuLvMGr8zVEdypM6hz8UmcVVu',
    '9999',
    'ADMIN'
);

-- Insert initial data into Produit
INSERT INTO Produit (idProduit, nom, disponibilite, prix, CODPRD, LIBPRD, CODEMB, LIBEMB, TYPPRD, quantite, seuil_alerte)
VALUES
(1, 'sans plomb', 'non disponible', 2550, '', '', '', '', '', 100, 10),
(2, 'gazoil 50', 'non disponible', 2800, '0101111', 'gazoil', '', '', 'CARBURANT', 65, 10),
(3, 'castrol ', 'disponible', 70000, '0101112', 'huile', '', '', 'LUBRIFIANT', -6, 10),
(4, 'castrol ', 'dispo', 70007, '122234', 'huile', '', '', 'LUBRIFIANT', 10, 10),
(5, 'castrol ', 'non disponible', 68000, '12228', 'huile', '', '', 'LUBRIFIANT', -51, 10),
(6, 'castrol ', 'non disponible', 56000, '0101122', 'huile', '', '', 'LUBRIFIANT', 0, 10),
(7, 'castrol ', 'dispo', 52000, '0101123', 'huile', '', '', 'LUBRIFIANT', -3, 10),
(8, 'shell huilux ', 'dispo', 58000, '0101128', 'huile', '', '', 'LUBRIFIANT', 0, 10),
(9, 'shell huilux ', 'dispo', 58000, '0101128', 'huile', '', '', 'LUBRIFIANT', 0, 10),
(10, 'shell', 'disponible', 54000, '0101111', 'huile', '', '', 'LUBRIFIANT', 0, 10),
(11, 'castrol ', 'disponible', 70000, '0101112', 'huile', '', '', 'LUBRIFIANT', 0, 10),
(12, 'castrol ', 'disponible', 70000, '0101112', 'huile', '', '', 'LUBRIFIANT', 0, 10);

-- Insert initial data into Commande
INSERT INTO Commande (idCommande, montant, date, idProduit, idUtilisateur, etat, RefCommande, depot_id, note)
VALUES
(1, 2800, '2024-12-07 21:47:24', NULL, 3, 'En instance', 'CMD1733604444435', NULL, NULL),
(2, 2800, '2024-12-07 21:47:58', NULL, 3, 'En instance', 'CMD1733604478485', NULL, NULL),
(3, 2800, '2024-12-07 21:54:12', NULL, 3, 'En instance', 'CMD1733604852895', NULL, NULL),
(4, 2800, '2024-12-07 22:03:49', NULL, 3, 'En cours', 'CMD1733605429409', NULL, NULL),
(5, 5600, '2024-12-07 23:28:04', NULL, 3, 'En cours', 'CMD1733610484417', NULL, NULL),
(6, 2800, '2024-12-07 23:31:46', NULL, 3, 'En cours', 'CMD1733610706353', NULL, NULL),
(7, 2800, '2024-12-07 23:42:32', NULL, 3, 'En cours', 'CMD1733611352753', NULL, NULL),
(8, 70000, '2024-12-08 13:29:48', NULL, 3, 'En cours', 'CMD1733660988368', NULL, NULL),
(9, 2800, '2024-12-16 16:15:31', NULL, 3, 'En cours', 'CMD1734362131094', NULL, NULL),
(10, 8400, '2024-12-18 14:15:03', NULL, 3, 'En instance', 'CMD1734527702994', NULL, NULL),
(11, 140000, '2024-12-18 15:16:33', NULL, 3, 'En cours', 'CMD1734531393702', NULL, NULL),
(12, 70000, '2024-12-18 23:08:36', NULL, 3, 'En cours', 'CMD1734559716626', NULL, NULL),
(13, 2800, '2024-12-18 23:16:46', NULL, 3, 'En instance', 'CMD1734560206344', NULL, NULL),
(14, 140000, '2024-12-18 23:38:33', NULL, 3, 'En instance', 'CMD1734561513804', NULL, NULL),
(15, 156000, '2024-12-19 00:36:39', NULL, 3, 'En instance', 'CMD1734564999329', NULL, NULL),
(16, 8400, '2024-12-19 12:25:52', NULL, 3, 'En instance', 'CMD1734607552720', NULL, NULL),
(17, 11200, '2024-12-19 12:35:33', NULL, 3, 'En instance', 'CMD1734608133948', NULL, NULL),
(18, 11200, '2024-12-19 14:57:51', NULL, 3, 'En instance', 'CMD1734616671389', NULL, NULL),
(19, 14000, '2024-12-27 23:40:12', NULL, 3, 'En instance', 'CMD1735339212106', NULL, NULL),
(20, 8400, '2024-12-27 23:42:27', NULL, 3, 'En instance', 'CMD1735339347614', NULL, NULL),
(21, 2800, '2024-12-27 23:43:56', NULL, 3, 'En instance', 'CMD1735339436155', NULL, NULL),
(22, 2800, '2024-12-27 23:47:39', NULL, 3, 'En instance', 'CMD1735339659784', NULL, NULL),
(23, 2800, '2024-12-27 23:55:33', NULL, 3, 'En instance', 'CMD1735340133239', NULL, NULL),
(24, 76400, '2024-12-30 10:31:08', NULL, 3, 'En instance', 'CMD1735551068135', NULL, NULL),
(25, 16800, '2025-01-08 15:09:47', NULL, 3, 'En instance', 'CMD1736345387714', NULL, NULL);

-- Insert initial data into Commandeproduit
INSERT INTO Commandeproduit (id, idCommande, idProduit, quantite, prix)
VALUES
(2, 4, 2, 1, 2800.00),
(3, 5, 2, 2, 2800.00),
(4, 6, 2, 1, 2800.00),
(5, 7, 2, 1, 2800.00),
(6, 8, 3, 1, 70000.00),
(7, 9, 2, 1, 2800.00),
(8, 10, 2, 3, 2800.00),
(9, 11, 3, 2, 70000.00),
(10, 12, 3, 1, 70000.00),
(11, 13, 2, 1, 2800.00),
(12, 14, 3, 2, 70000.00),
(13, 15, 7, 3, 52000.00),
(14, 16, 2, 3, 2800.00),
(15, 17, 2, 4, 2800.00),
(16, 18, 2, 4, 2800.00),
(21, 23, 2, 1, 2800.00),
(22, 24, 2, 3, 2800.00),
(23, 24, 5, 1, 68000.00),
(24, 25, 2, 6, 2800.00);

-- Insert initial data into Livraison
INSERT INTO Livraison (idLivraison, idCommande, dateLivraison, numChauffeur, quantiteLv)
VALUES
(1, 4, '2024-12-18 15:40:42', 0, 0),
(2, 4, '2024-12-19 00:39:35', 0, 0),
(3, 6, '2024-12-19 00:39:46', 0, 0),
(4, 4, '2024-12-19 12:27:45', 0, 0),
(5, 11, '2024-12-19 12:38:37', 0, 0),
(6, 5, '2024-12-19 15:00:21', 0, 0),
(7, 6, '2024-12-24 21:29:56', 0, 0),
(8, 7, '2024-12-24 21:31:40', 0, 0),
(9, 4, '2024-12-24 21:45:52', 0, 0),
(10, 6, '2024-12-24 23:07:38', 0, 0),
(11, 5, '2024-12-29 14:35:03', 0, 0),
(12, 4, '2024-12-30 10:35:17', 0, 0);

-- Insert initial data into Mouvementstock
INSERT INTO Mouvementstock (id, idProduit, quantite, type_mouvement, date_mouvement, idCommande, raison)
VALUES
(1, 4, 10, 'ENTREE', '2024-12-27 14:23:48
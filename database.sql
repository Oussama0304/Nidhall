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
    FOREIGN KEY (idProduit) REFERENCES Produit(idProduit),
    FOREIGN KEY (idUtilisateur) REFERENCES Utilisateur(identifiant)
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
    idMaterial BIGINT PRIMARY KEY AUTO_INCREMENT,
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
    image_url VARCHAR(255),
    priority ENUM('NORMAL', 'URGENT', 'CRITIQUE') DEFAULT 'NORMAL',
    estimatedResolutionTime DATETIME,
    actualResolutionTime DATETIME,
    satisfaction ENUM('SATISFAIT', 'NON_SATISFAIT', 'NEUTRE') DEFAULT 'NEUTRE',
    gravite ENUM('FAIBLE', 'MOYENNE', 'ELEVEE') DEFAULT 'FAIBLE',
    sentiment_score FLOAT,
    FOREIGN KEY (idGerant) REFERENCES Utilisateur(identifiant),
    FOREIGN KEY (idCommercial) REFERENCES Utilisateur(identifiant)
);

-- Create CommandeProduit table
CREATE TABLE IF NOT EXISTS CommandeProduit (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    idCommande BIGINT,
    idProduit BIGINT,
    quantite INT NOT NULL,
    prix FLOAT NOT NULL,
    FOREIGN KEY (idCommande) REFERENCES Commande(idCommande),
    FOREIGN KEY (idProduit) REFERENCES Produit(idProduit)
);

-- Create MouvementStock table
CREATE TABLE IF NOT EXISTS MouvementStock (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    idProduit BIGINT,
    quantite INT NOT NULL,
    type_mouvement ENUM('ENTREE', 'RETRAIT') NOT NULL,
    date_mouvement DATETIME NOT NULL,
    idCommande BIGINT,
    raison VARCHAR(255),
    FOREIGN KEY (idProduit) REFERENCES Produit(idProduit),
    FOREIGN KEY (idCommande) REFERENCES Commande(idCommande)
);

-- Create EquipmentSensors table
CREATE TABLE IF NOT EXISTS EquipmentSensors (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    equipment_id BIGINT,
    temperature FLOAT,
    pressure FLOAT,
    vibration FLOAT,
    timestamp DATETIME,
    location VARCHAR(255),
    FOREIGN KEY (equipment_id) REFERENCES Material(idMaterial)
);

-- Create MaintenanceAnalytics table
CREATE TABLE IF NOT EXISTS MaintenanceAnalytics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    equipment_id BIGINT,
    prediction_date DATETIME,
    failure_probability FLOAT,
    maintenance_recommendations TEXT,
    severity_level ENUM('BASSE', 'MOYENNE', 'HAUTE'),
    FOREIGN KEY (equipment_id) REFERENCES Material(idMaterial)
);

-- Create PerformanceMetrics table
CREATE TABLE IF NOT EXISTS PerformanceMetrics (
    id INT(11) NOT NULL AUTO_INCREMENT,
    metric_date DATE DEFAULT NULL,
    resolution_times JSON DEFAULT NULL,
    satisfaction_rates JSON DEFAULT NULL,
    issue_patterns JSON DEFAULT NULL,
    cost_analysis JSON DEFAULT NULL,
    efficiency_scores JSON DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Création de l'administrateur permanent
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
-- Identifiants permanents :
-- Email: admin@pfe.tn
-- Mot de passe: admin123

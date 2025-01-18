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
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Create StationService table
CREATE TABLE IF NOT EXISTS StationService (
    idStation BIGINT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    adresse TEXT NOT NULL,
    ville VARCHAR(100),
    telephone VARCHAR(20),
    email VARCHAR(100),
    capacite INT
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Create Gerant table
CREATE TABLE IF NOT EXISTS Gerant (
    idGerant BIGINT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    matricule BIGINT UNIQUE NOT NULL,
    numGerant BIGINT UNIQUE NOT NULL,
    idStation BIGINT,
    KEY `idStation` (`idStation`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

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
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Create Depot table
CREATE TABLE IF NOT EXISTS Depot (
    idDepot BIGINT PRIMARY KEY AUTO_INCREMENT,
    nomDepot VARCHAR(100) NOT NULL,
    adresse TEXT NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Create Commande table
CREATE TABLE IF NOT EXISTS Commande (
    idCommande BIGINT PRIMARY KEY AUTO_INCREMENT,
    montant FLOAT NOT NULL,
    date DATETIME NOT NULL,
    idProduit BIGINT,
    idUtilisateur BIGINT,
    etat ENUM('En instance', 'En cours', 'Validée') NOT NULL DEFAULT 'En instance',
    RefCommande VARCHAR(50) NOT NULL,
    depot_id INT(11) DEFAULT NULL,
    note TEXT,
    PRIMARY KEY (`idCommande`),
    UNIQUE KEY `RefCommande` (`RefCommande`),
    KEY `idProduit` (`idProduit`),
    KEY `idUtilisateur` (`idUtilisateur`),
    KEY `depot_id` (`depot_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Create Livraison table
CREATE TABLE IF NOT EXISTS Livraison (
    idLivraison BIGINT PRIMARY KEY AUTO_INCREMENT,
    idCommande BIGINT,
    dateLivraison DATETIME NOT NULL,
    numChauffeur BIGINT NOT NULL,
    quantiteLv FLOAT NOT NULL,
    KEY `idCommande` (`idCommande`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Create Material table
CREATE TABLE IF NOT EXISTS Material (
    idMaterial BIGINT PRIMARY KEY AUTO_INCREMENT,
    idStation BIGINT,
    Actif VARCHAR(50) NOT NULL,
    Description TEXT,
    Emplacement VARCHAR(100),
    status VARCHAR(50),
    KEY `idStation` (`idStation`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Create Reclamation table
CREATE TABLE IF NOT EXISTS Reclamation (
    idReclamation BIGINT PRIMARY KEY AUTO_INCREMENT,
    idGerant BIGINT,
    idCommercial BIGINT,
    description TEXT NOT NULL,
    date DATETIME NOT NULL,
    type ENUM('TECHNIQUE', 'COMMERCIALE') NOT NULL,
    etat ENUM('En instance', 'En cours', 'Validée') NOT NULL DEFAULT 'En instance',
    material VARCHAR(255),
    image_url VARCHAR(255),
    priority ENUM('FAIBLE', 'NORMAL', 'MOYEN', 'URGENT') NOT NULL DEFAULT 'NORMAL',
    estimatedResolutionTime INT,
    actualResolutionTime INT,
    satisfaction ENUM('TRES_SATISFAIT', 'SATISFAIT', 'NEUTRE', 'PEU_SATISFAIT', 'INSATISFAIT') DEFAULT 'NEUTRE',
    gravite ENUM('FAIBLE', 'MOYENNE', 'HAUTE') DEFAULT 'FAIBLE',
    sentiment_score INT,
    suggestedActions TEXT,
    aiConfidence FLOAT,
    image_analysis TEXT,
    reponse TEXT,
    date_reponse DATETIME,
    categories TEXT,
    keywords TEXT,
    impact_score INT,
    related_issues TEXT,
    resolution_history TEXT,
    predicted_resolution_time INT,
    maintenance_cost FLOAT,
    analysis_results TEXT,
    last_analyzed DATETIME,
    KEY `idGerant` (`idGerant`),
    KEY `idCommercial` (`idCommercial`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

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
    severity_level VARCHAR(50),
    maintenance_type VARCHAR(50),
    estimated_cost FLOAT,
    next_maintenance_date DATETIME,
    component_health_score FLOAT,
    last_maintenance_date DATETIME,
    maintenance_history TEXT,
    sensor_data TEXT,
    anomaly_score FLOAT,
    maintenance_recommendations TEXT,
    KEY `equipment_id` (`equipment_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Create PerformanceMetrics table
CREATE TABLE IF NOT EXISTS PerformanceMetrics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    metric_name VARCHAR(100),
    metric_value FLOAT,
    timestamp DATETIME,
    station_id BIGINT,
    equipment_id BIGINT,
    metric_type VARCHAR(50),
    unit VARCHAR(20),
    threshold_value FLOAT,
    alert_status VARCHAR(50),
    notes TEXT,
    KEY `station_id` (`station_id`),
    KEY `equipment_id` (`equipment_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Create ReclamationAnalytics table
CREATE TABLE IF NOT EXISTS ReclamationAnalytics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    idReclamation BIGINT,
    analysis_type VARCHAR(50),
    analysis_result TEXT,
    confidence_score FLOAT,
    timestamp DATETIME,
    recommendations TEXT,
    impact_analysis TEXT,
    priority_score FLOAT,
    category_prediction VARCHAR(50),
    response_time_prediction INT,
    KEY `idReclamation` (`idReclamation`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Create EquipmentSensors table
CREATE TABLE IF NOT EXISTS EquipmentSensors (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    equipment_id BIGINT,
    sensor_type VARCHAR(50),
    sensor_value FLOAT,
    timestamp DATETIME,
    status VARCHAR(50),
    alert_threshold FLOAT,
    unit VARCHAR(20),
    location VARCHAR(100),
    last_calibration DATETIME,
    next_calibration DATETIME,
    KEY `equipment_id` (`equipment_id`)
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
-- Mot de passe: admin123;

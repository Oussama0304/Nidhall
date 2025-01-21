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
    idDepot BIGINT DEFAULT NULL,
    note TEXT DEFAULT NULL,
    FOREIGN KEY (idProduit) REFERENCES Produit(idProduit),
    FOREIGN KEY (idUtilisateur) REFERENCES Utilisateur(identifiant),
    FOREIGN KEY (idDepot) REFERENCES Depot(idDepot)
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
    idCommande BIGINT NOT NULL,  -- Changé de INT à BIGINT
    idProduit BIGINT NOT NULL,   -- Changé de INT à BIGINT
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
VALUES
('Admin', 'System', '21612345678', 'admin@pfe.tn', '$2a$10$2EZZzs0Gz9LCva1RU.3fDegZan0cQuLvMGr8zVEdypM6hz8UmcVVu', 9999, 'ADMIN'),
('neder', 'boughanmi', '26593757', 'commercial@agil.com', '$2a$10$xL5pVQknFxWtfiEVr2R7leBYmZr18HCD11MWRM9PN20OrhgstXwge', 123456, 'COMMERCIAL'),
('rodrigo', 'rodriguez', '23456781', 'gerant.test@station.com', '$2a$10$/IWjTxgiBry/8VIwuUsFu.2Bv0d.5uBIOCKgoNqRcdCHqb.CtpABC', 654321, 'GERANT'),
('mouldi', 'aifa', '28456934', 'depot.test@gmail.com', '$2a$10$Or1XUqCJ8cPWlQqeeILsLOgrohixpnwiWK.w/FT5gGuUfx2hkWD/2', 9876554, 'DEPOT'),
('brian', 'ruiz', '12365478', 'brian.depot@gmail.com', '$2a$10$qf9INIgYJsOKjLdhiArvA.VSQjme8M27UTumUcIsA1AGM9FBrSaUy', 471852, 'DEPOT'),
('oussema', 'boughan', '26593757', 'boughanmi.commercial@agil.com', '$2a$10$7he4/mlhVcwDso6exKbQx.tUEoxeK5POd1gioUGXvD.l9UeDJulNi', 14455, 'COMMERCIAL'),
('nidhal', 'boughanmi', '26593757', 'nidhal.boughanmi@gmail.com', '$2a$10$K2lK8692KeqV5LgHIC/YwOWiamSV/vNWpVPZ5Px723hM7BFmEHVU2', 213456, 'GERANT'),
('nidhal', 'boughanmi', '26593757', 'nidhal.boughanmi22@gmail.com', '$2a$10$uO1Jb5kaQejIkt3136LnXeW6Nu16h1oOF7/3I5eBn7rV2go0aAgTe', 123455, 'GERANT'),
('oussema', 'boughanmi', '25693757', 'oussema123@gmail.com', '$2a$10$/Fo0oONuwSRHlGz7tixR6.em9UsM/e.JLNB2Idbg2KJTiHVJaeNiG', 213654, 'COMMERCIAL'),
('oussema', 'boughanmi', '26593775', 'oussema.boughanmni22@gmail.com', '$2a$10$S5qK.FakZso2Q0ncUq6tm.VjjhIBMB1dMLga0mIhMCXxscGa4EdW6', 124563, 'GERANT'),
('oussema', 'boughanmi', '26593747', 'oussemaboughanmi@agil.com', '$2a$10$LgkAW6rBAsVO5RFtss/V3uEdrkZwziEB0tMMFZno0TF1T1fypVbVK', 124547, 'COMMERCIAL'),
('boughanmi', 'nidhal', '21345679', 'boughanmi123@gmail.com', '$2a$10$Rrx3Wq1fumdpWAZGJc9VC.8YYddfLFLbqMbx9jTovnlEzSqtjKpjq', 987655, 'GERANT'),
('boughanmi', 'oussema', '26593757', 'boughanmi.test@gmail.com', '$2a$10$YcUthi4NQzHvXJV5Lai.3u3vM5E7S6DEsacibV2YtyWSseLRwMS/e', 147852, 'DEPOT'),
('aloui', 'omar', '26593757', 'omar.aloui@gmail.com', '$2a$10$aupiVTuZTBA9oHeLumJZNuNkgDdITRSgskCd5QEGooj/xElABOoHS', 254136, 'GERANT'),
('neila', 'bouali', '28741367', 'neila.bou@gmail.com', '$2a$10$auBwaM4fBVH2IkVneNb40ui3JdbdhtIfHwFQBLAh1hgKcykesn/n2', 5468271, 'DEPOT'),
('ameur', 'atef', '26593754', 'amer.atef@gmail.com', '$2a$10$Ggz7f7Nnatb9kWNhDV.8XOEHJmt53NwCd1HQOcNfA4nzaKn9MWY8W', 257413, 'GERANT');

-- Insert initial data into StationService
INSERT INTO StationService (idStation, nom, adresse, ville, telephone, email, capacite)
VALUES
(1, 'Station Test', '123 Rue Test', NULL, NULL, NULL, NULL),
(2, 'station bardo', '124 Rue ', NULL, NULL, NULL, NULL),
(3, 'station ariana', '124 Rue ', 'ariana', '1478526', 'station.test@pfe.tn', 500),
(4, 'station centre ville', '101 Rue ', 'Tunis', '1478526', 'station.test@pfe.tn', 500),
(5, 'station bizerte', '101 Rue ', 'Tunis', '2659375', 'station.test@pfe.tn', 500),
(6, 'station  nabeul', '101 Rue ', 'nabeul', '2659375', 'stationnabeul.test@pfe.tn', 300),
(7, 'station ben arous', '123 Rue Test', 'Tunis', '12345678', 'station.test@pfe.tn', 400);

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
INSERT INTO Commande (idCommande, montant, date, idProduit, idUtilisateur, etat, RefCommande, idDepot, note)
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
(1, 4, 10, 'ENTREE', '2024-12-27 14:23:48', NULL, 'Réapprovisionnement'),
(2, 5, 50, 'RETRAIT', '2024-12-27 14:25:43', NULL, 'Réapprovisionnement'),
(3, 2, 3, 'RETRAIT', '2024-12-27 22:42:27', 20, NULL),
(4, 2, 1, 'RETRAIT', '2024-12-27 22:43:56', 21, NULL);

-- Insert initial data into Reclamation
INSERT INTO Reclamation (idReclamation, idGerant, idCommercial, description, date, type, etat, material, image_url, priority, estimatedResolutionTime, actualResolutionTime, satisfaction, gravite, sentiment_score, suggestedActions, aiConfidence, image_analysis, reponse, date_reponse)
VALUES
(1, 3, NULL, 'hfhhfhfhhfh', '2024-12-08 23:53:39', 'COMMERCIALE', 'Validée', NULL, NULL, 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL),
(2, 3, NULL, 'hvgfchxdgwsdxgcfhgvj', '2024-12-18 11:10:10', 'TECHNIQUE', 'En instance', NULL, NULL, 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL),
(3, 3, NULL, 'lnbhgvfcxdxgchv', '2024-12-18 13:53:08', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1734526388342-images.png', 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL),
(4, 3, NULL, 'panne', '2024-12-18 14:13:37', 'COMMERCIALE', 'En instance', NULL, '/uploads/reclamations/1734527617578-usecom.PNG', 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL),
(5, 3, NULL, 'panne com', '2024-12-18 23:17:57', 'COMMERCIALE', 'Validée', NULL, '/uploads/reclamations/1734560277307-dashger4.PNG', 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL),
(6, 3, NULL, 'probleme de commande', '2024-12-19 00:37:32', 'COMMERCIALE', 'Validée', NULL, '/uploads/reclamations/1734565052432-etat.PNG', 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL),
(7, 3, NULL, 'probleme de prix', '2024-12-19 12:26:25', 'COMMERCIALE', 'Validée', NULL, '/uploads/reclamations/1734607585169-liv.PNG', 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL),
(8, 3, NULL, 'probleme de prix', '2024-12-19 12:36:21', 'COMMERCIALE', 'Validée', NULL, '/uploads/reclamations/1734608181964-liv.PNG', 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL),
(9, 3, NULL, 'panne technique', '2024-12-19 14:57:08', 'COMMERCIALE', 'En cours', NULL, '/uploads/reclamations/1734616628308-liv.PNG', 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL),
(10, 3, NULL, '\"Retard de livraison de carburant, le délai habituel n\'a pas été respecté. Besoin d\'une solution rapidement.\"', '2024-12-20 14:28:05', 'COMMERCIALE', 'En cours', NULL, '/uploads/reclamations/1734701285247-str.PNG', 'MOYEN', 24, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL),
(11, 3, NULL, '\"Panne urgente du système de pompage, équipement complètement arrêté ! Situation critique nécessitant une intervention immédiate.\"', '2024-12-20 14:41:34', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1734702094290-str.PNG', 'MOYEN', 48, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL),
(12, 3, NULL, 'grave', '2024-12-20 21:26:20', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1734726380344-mern.jpg', 'MOYEN', 48, NULL, 'PEU_SATISFAIT', 'MOYENNE', -2, NULL, NULL, NULL, NULL, NULL),
(13, 3, 2, 'URGENT ! Panne critique du système de distribution. Situation inacceptable, nous perdons des clients ! Intervention immédiate requise.', '2024-12-20 21:31:05', 'TECHNIQUE', 'En instance', NULL, NULL, 'URGENT', 24, NULL, 'INSATISFAIT', 'HAUTE', -3, NULL, NULL, NULL, NULL, NULL),
(14, 3, NULL, 'panne grave', '2024-12-20 23:25:53', 'TECHNIQUE', 'En instance', NULL, NULL, 'MOYEN', 48, NULL, 'PEU_SATISFAIT', 'MOYENNE', -2, NULL, NULL, NULL, NULL, NULL),
(15, 3, NULL, 'panne ', '2024-12-20 23:28:32', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1734733712207-OIP.jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, NULL, NULL, NULL, NULL),
(16, 3, NULL, 'panne urgente', '2024-12-20 23:33:16', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1734733996246-OIP.jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, '{\"analysis\": {\"quality\": \"Faible\", \"resolution\": \"Basse\"}, \"metadata\": {\"width\": 474, \"format\": \"jpeg\", \"height\": 632}, \"recommendedType\": \"TECHNIQUE\", \"technicalIssues\": [{\"type\": \"Qualité d\'image insuffisante\", \"confidence\": 0.8, \"description\": \"L\'image est de trop basse résolution pour une analyse détaillée\"}, {\"type\": \"Problème potentiel de pompe\", \"confidence\": 0.75, \"description\": \"Inspection visuelle recommandée\"}, {\"type\": \"Usure possible\", \"confidence\": 0.65, \"description\": \"Vérification de maintenance conseillée\"}]}', NULL, NULL),
(17, 3, NULL, 'panne', '2024-12-20 23:44:49', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1734734689421-OIP.jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, '{\"metadata\": {\"width\": 474, \"format\": \"jpeg\", \"height\": 632}, \"severity\": {\"level\": \"HAUTE\", \"mediumCount\": 1, \"totalIssues\": 7, \"urgentCount\": 2}, \"imageQuality\": {\"format\": \"jpeg\", \"quality\": \"Faible\", \"isAdequate\": false, \"resolution\": \"474x632\"}, \"recommendedType\": \"TECHNIQUE\", \"technicalAnalysis\": {\"issues\": [{\"type\": \"Problème de ventilation\", \"priority\": \"NORMAL\", \"confidence\": 0.5279091883148068, \"detectedAt\": \"2024-12-20T22:44:49.455Z\"}, {\"type\": \"Corrosion visible\", \"priority\": \"URGENT\", \"confidence\": 0.8310498337596681, \"detectedAt\": \"2024-12-20T22:44:49.455Z\"}, {\"type\": \"Fuite dans la tuyauterie\", \"priority\": \"NORMAL\", \"confidence\": 0.5571135704859556, \"detectedAt\": \"2024-12-20T22:44:49.455Z\"}, {\"type\": \"Panne d\'affichage\", \"priority\": \"NORMAL\", \"confidence\": 0.5077171781428681, \"detectedAt\": \"2024-12-20T22:44:49.455Z\"}, {\"type\": \"Panne d\'affichage\", \"priority\": \"NORMAL\", \"confidence\": 0.5000565065701147, \"detectedAt\": \"2024-12-20T22:44:49.455Z\"}, {\"type\": \"Problème d\'arrêt d\'urgence\", \"priority\": \"MOYEN\", \"confidence\": 0.7599139904614581, \"detectedAt\": \"2024-12-20T22:44:49.455Z\"}, {\"type\": \"Problème d\'arrêt d\'urgence\", \"priority\": \"URGENT\", \"confidence\": 0.8200099595654305, \"detectedAt\": \"2024-12-20T22:44:49.455Z\"}], \"timestamp\": \"2024-12-20T22:44:49.455Z\", \"categories\": [\"RESERVOIR\", \"TUYAUTERIE\", \"ELECTRONIQUE\", \"SECURITE\"]}, \"maintenanceRecommendations\": [{\"action\": \"Contrôle de routine des jauges et des systèmes de ventilation\", \"category\": \"RESERVOIR\", \"priority\": \"NORMAL\", \"estimatedTime\": 180, \"requiredExpertise\": \"Expert en systèmes de stockage\"}, {\"action\": \"Inspection immédiate des conduites et remplacement si nécessaire\", \"category\": \"TUYAUTERIE\", \"priority\": \"URGENT\", \"estimatedTime\": 135, \"requiredExpertise\": \"Plombier industriel\"}, {\"action\": \"Test des systèmes et mise à jour si nécessaire\", \"category\": \"ELECTRONIQUE\", \"priority\": \"NORMAL\", \"estimatedTime\": 90, \"requiredExpertise\": \"Électromécanicien\"}, {\"action\": \"Intervention immédiate - Mise en sécurité requise\", \"category\": \"SECURITE\", \"priority\": \"URGENT\", \"estimatedTime\": 67.5, \"requiredExpertise\": \"Technicien de sécurité\"}]}', NULL, NULL),
(18, 3, NULL, 'panne', '2024-12-21 15:12:36', 'COMMERCIALE', 'En instance', NULL, '/uploads/reclamations/1734790355781-OIP.jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, '{\"metadata\": {\"width\": 474, \"format\": \"jpeg\", \"height\": 632}, \"severity\": {\"level\": \"MOYENNE\", \"mediumCount\": 5, \"totalIssues\": 6, \"urgentCount\": 0}, \"imageQuality\": {\"format\": \"jpeg\", \"quality\": \"Faible\", \"isAdequate\": false, \"resolution\": \"474x632\"}, \"recommendedType\": \"COMMERCIALE\", \"technicalAnalysis\": {\"issues\": [{\"type\": \"Contamination possible\", \"priority\": \"MOYEN\", \"confidence\": 0.679424596885968, \"detectedAt\": \"2024-12-21T14:12:35.911Z\"}, {\"type\": \"Fuite potentielle\", \"priority\": \"MOYEN\", \"confidence\": 0.7078568999160919, \"detectedAt\": \"2024-12-21T14:12:35.911Z\"}, {\"type\": \"Corrosion visible\", \"priority\": \"MOYEN\", \"confidence\": 0.6999226818953832, \"detectedAt\": \"2024-12-21T14:12:35.911Z\"}, {\"type\": \"Problème de joint\", \"priority\": \"MOYEN\", \"confidence\": 0.7137187424789153, \"detectedAt\": \"2024-12-21T14:12:35.911Z\"}, {\"type\": \"Problème de mise à la terre\", \"priority\": \"NORMAL\", \"confidence\": 0.5180150915679863, \"detectedAt\": \"2024-12-21T14:12:35.911Z\"}, {\"type\": \"Dysfonctionnement des alarmes\", \"priority\": \"MOYEN\", \"confidence\": 0.6401280249160551, \"detectedAt\": \"2024-12-21T14:12:35.911Z\"}], \"timestamp\": \"2024-12-21T14:12:35.911Z\", \"categories\": [\"RESERVOIR\", \"TUYAUTERIE\", \"SECURITE\"]}, \"maintenanceRecommendations\": [{\"action\": \"Contrôle de routine des jauges et des systèmes de ventilation\", \"category\": \"RESERVOIR\", \"priority\": \"NORMAL\", \"estimatedTime\": 270, \"requiredExpertise\": \"Expert en systèmes de stockage\"}, {\"action\": \"Vérification des joints et de l\'état général\", \"category\": \"TUYAUTERIE\", \"priority\": \"NORMAL\", \"estimatedTime\": 135, \"requiredExpertise\": \"Plombier industriel\"}, {\"action\": \"Vérification des systèmes de sécurité\", \"category\": \"SECURITE\", \"priority\": \"NORMAL\", \"estimatedTime\": 67.5, \"requiredExpertise\": \"Technicien de sécurité\"}]}', NULL, NULL),
(19, 3, NULL, 'panne grave urgente', '2024-12-22 12:18:36', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1734866315866-OIP.jpg', 'MOYEN', 48, NULL, 'PEU_SATISFAIT', 'MOYENNE', -2, NULL, NULL, '{\"metadata\": {\"width\": 474, \"format\": \"jpeg\", \"height\": 632}, \"severity\": {\"level\": \"HAUTE\", \"mediumCount\": 3, \"totalIssues\": 4, \"urgentCount\": 1}, \"imageQuality\": {\"format\": \"jpeg\", \"quality\": \"Faible\", \"isAdequate\": false, \"resolution\": \"474x632\"}, \"recommendedType\": \"TECHNIQUE\", \"technicalAnalysis\": {\"issues\": [{\"type\": \"Problème de ventilation\", \"priority\": \"MOYEN\", \"confidence\": 0.7814977847330855, \"detectedAt\": \"2024-12-22T11:18:35.949Z\"}, {\"type\": \"Problème de circuit électrique\", \"priority\": \"MOYEN\", \"confidence\": 0.7076271710865283, \"detectedAt\": \"2024-12-22T11:18:35.949Z\"}, {\"type\": \"Problème de circuit électrique\", \"priority\": \"MOYEN\", \"confidence\": 0.7644353313286147, \"detectedAt\": \"2024-12-22T11:18:35.949Z\"}, {\"type\": \"Signalisation défectueuse\", \"priority\": \"URGENT\", \"confidence\": 0.9628847727132398, \"detectedAt\": \"2024-12-22T11:18:35.950Z\"}], \"timestamp\": \"2024-12-22T11:18:35.950Z\", \"categories\": [\"RESERVOIR\", \"ELECTRONIQUE\", \"SECURITE\"]}, \"maintenanceRecommendations\": [{\"action\": \"Contrôle de routine des jauges et des systèmes de ventilation\", \"category\": \"RESERVOIR\", \"priority\": \"NORMAL\", \"estimatedTime\": 180, \"requiredExpertise\": \"Expert en systèmes de stockage\"}, {\"action\": \"Test des systèmes et mise à jour si nécessaire\", \"category\": \"ELECTRONIQUE\", \"priority\": \"NORMAL\", \"estimatedTime\": 90, \"requiredExpertise\": \"Électromécanicien\"}, {\"action\": \"Intervention immédiate - Mise en sécurité requise\", \"category\": \"SECURITE\", \"priority\": \"URGENT\", \"estimatedTime\": 45, \"requiredExpertise\": \"Technicien de sécurité\"}]}', NULL, NULL),
(20, 3, 2, 'panne des pistolé', '2024-12-22 12:31:39', 'COMMERCIALE', 'En instance', NULL, '/uploads/reclamations/1734867098375-maxnewsfrthree.jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, '{\"metadata\": {\"width\": 5760, \"format\": \"jpeg\", \"height\": 3840}, \"severity\": {\"level\": \"MOYENNE\", \"mediumCount\": 3, \"totalIssues\": 5, \"urgentCount\": 0}, \"imageQuality\": {\"format\": \"jpeg\", \"quality\": \"Bonne\", \"isAdequate\": true, \"resolution\": \"5760x3840\"}, \"recommendedType\": \"COMMERCIALE\", \"technicalAnalysis\": {\"issues\": [{\"type\": \"Fuite potentielle\", \"priority\": \"MOYEN\", \"confidence\": 0.7178349890886876, \"detectedAt\": \"2024-12-22T11:31:38.784Z\"}, {\"type\": \"Problème de jauge\", \"priority\": \"MOYEN\", \"confidence\": 0.6402843834718142, \"detectedAt\": \"2024-12-22T11:31:38.784Z\"}, {\"type\": \"Problème de joint\", \"priority\": \"NORMAL\", \"confidence\": 0.5336765683338408, \"detectedAt\": \"2024-12-22T11:31:38.784Z\"}, {\"type\": \"Problème de joint\", \"priority\": \"NORMAL\", \"confidence\": 0.5829925898764249, \"detectedAt\": \"2024-12-22T11:31:38.784Z\"}, {\"type\": \"Signalisation défectueuse\", \"priority\": \"MOYEN\", \"confidence\": 0.7433062493593358, \"detectedAt\": \"2024-12-22T11:31:38.784Z\"}], \"timestamp\": \"2024-12-22T11:31:38.784Z\", \"categories\": [\"RESERVOIR\", \"TUYAUTERIE\", \"SECURITE\"]}, \"maintenanceRecommendations\": [{\"action\": \"Contrôle de routine des jauges et des systèmes de ventilation\", \"category\": \"RESERVOIR\", \"priority\": \"NORMAL\", \"estimatedTime\": 270, \"requiredExpertise\": \"Expert en systèmes de stockage\"}, {\"action\": \"Vérification des joints et de l\'état général\", \"category\": \"TUYAUTERIE\", \"priority\": \"NORMAL\", \"estimatedTime\": 135, \"requiredExpertise\": \"Plombier industriel\"}, {\"action\": \"Vérification des systèmes de sécurité\", \"category\": \"SECURITE\", \"priority\": \"NORMAL\", \"estimatedTime\": 45, \"requiredExpertise\": \"Technicien de sécurité\"}]}', 'ouiii', '2024-12-26 09:50:57'),
(23, 3, NULL, 'panne grave', '2024-12-30 10:32:07', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1735551126749-gaz.jpg', 'MOYEN', 48, NULL, 'PEU_SATISFAIT', 'MOYENNE', -2, NULL, NULL, NULL, NULL, NULL),
(24, 1, NULL, 'panne de paiment ', '2025-01-08 23:40:29', 'COMMERCIALE', 'En instance', NULL, '/uploads/reclamations/1736376024636-OIP (2).jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, NULL, NULL, NULL),
(21, 2, NULL, 'panne de jauge d essence ', '2024-12-22 12:49:42', 'TECHNIQUE', 'Validée', NULL, '/uploads/reclamations/1734868182053-maxnewsfrthree.jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, '{\"metadata\": {\"width\": 5760, \"format\": \"jpeg\", \"height\": 3840}, \"severity\": {\"level\": \"HAUTE\", \"mediumCount\": 2, \"totalIssues\": 8, \"urgentCount\": 4}, \"imageQuality\": {\"format\": \"jpeg\", \"quality\": \"Bonne\", \"isAdequate\": true, \"resolution\": \"5760x3840\"}, \"recommendedType\": \"TECHNIQUE\", \"technicalAnalysis\": {\"issues\": [{\"type\": \"Contamination possible\", \"priority\": \"MOYEN\", \"confidence\": 0.79377502132514, \"detectedAt\": \"2024-12-22T11:49:42.296Z\"}, {\"type\": \"Problème de jauge\", \"priority\": \"URGENT\", \"confidence\": 0.8689189133200741, \"detectedAt\": \"2024-12-22T11:49:42.297Z\"}, {\"type\": \"Corrosion visible\", \"priority\": \"URGENT\", \"confidence\": 0.8722830761041439, \"detectedAt\": \"2024-12-22T11:49:42.297Z\"}, {\"type\": \"Problème de joint\", \"priority\": \"URGENT\", \"confidence\": 0.9128138973683616, \"detectedAt\": \"2024-12-22T11:49:42.297Z\"}, {\"type\": \"Problème de circuit électrique\", \"priority\": \"URGENT\", \"confidence\": 0.8751091026155587, \"detectedAt\": \"2024-12-22T11:49:42.297Z\"}, {\"type\": \"Erreur de communication\", \"priority\": \"NORMAL\", \"confidence\": 0.5681755085616752, \"detectedAt\": \"2024-12-22T11:49:42.297Z\"}, {\"type\": \"Problème d\'arrêt d\'urgence\", \"priority\": \"NORMAL\", \"confidence\": 0.5799126020173094, \"detectedAt\": \"2024-12-22T11:49:42.297Z\"}, {\"type\": \"Signalisation défectueuse\", \"priority\": \"MOYEN\", \"confidence\": 0.6674826054094176, \"detectedAt\": \"2024-12-22T11:49:42.297Z\"}], \"timestamp\": \"2024-12-22T11:49:42.297Z\", \"categories\": [\"RESERVOIR\", \"TUYAUTERIE\", \"ELECTRONIQUE\", \"SECURITE\"]}, \"maintenanceRecommendations\": [{\"action\": \"Vérification immédiate de l\'étanchéité et des niveaux\", \"category\": \"RESERVOIR\", \"priority\": \"URGENT\", \"estimatedTime\": 270, \"requiredExpertise\": \"Expert en systèmes de stockage\"}, {\"action\": \"Inspection immédiate des conduites et remplacement si nécessaire\", \"category\": \"TUYAUTERIE\", \"priority\": \"URGENT\", \"estimatedTime\": 135, \"requiredExpertise\": \"Plombier industriel\"}, {\"action\": \"Diagnostic complet du système électronique requis\", \"category\": \"ELECTRONIQUE\", \"priority\": \"URGENT\", \"estimatedTime\": 90, \"requiredExpertise\": \"Électromécanicien\"}, {\"action\": \"Vérification des systèmes de sécurité\", \"category\": \"SECURITE\", \"priority\": \"NORMAL\", \"estimatedTime\": 67.5, \"requiredExpertise\": \"Technicien de sécurité\"}]}', 'Cher gérant,\n\nSuite à l\'analyse de votre réclamation #21, voici notre évaluation détaillée :\n\n1. Analyse Technique :\n   - URGENT: Dysfonctionnement du système de paiement (Confiance: 80.6%)\n   - Problème de débit (Confiance: 55%)\n   - Problème de ventilation (Confiance: 51.7%)\n\n2. Recommandations de Maintenance :\n   - POMPE: Inspection et maintenance préventive recommandée\n     Expert requis: Technicien spécialisé en pompes\n     Temps estimé: 120 minutes\n\n   - RESERVOIR: Contrôle de routine des jauges et des systèmes de ventilation\n     Expert requis: Expert en systèmes de stockage\n     Temps estimé: 180 minutes\n\n   - ELECTRONIQUE: Diagnostic complet du système électronique requis\n     Expert requis: Electromécanicien\n     Temps estimé: 90 minutes\n\n3. Plan d\'Action :\n   - Intervention immédiate requise pour le système de paiement\n   - Un électromécanicien sera envoyé en priorité\n   - Planification des maintenances préventives pour la pompe et le réservoir\n\nNous prenons en charge votre demande avec la plus grande attention. Notre équipe technique interviendra selon les priorités identifiées.\n\nCordialement,\nVotre Commercial', '2024-12-23 14:29:21'),
(22, 2, NULL, 'panne commercial', '2024-12-22 12:59:06', 'TECHNIQUE', 'Validée', NULL, '/uploads/reclamations/1734868745738-OIP (1).jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, '{\"metadata\": {\"width\": 474, \"format\": \"jpeg\", \"height\": 348}, \"severity\": {\"level\": \"HAUTE\", \"mediumCount\": 0, \"totalIssues\": 4, \"urgentCount\": 2}, \"imageQuality\": {\"format\": \"jpeg\", \"quality\": \"Faible\", \"isAdequate\": false, \"resolution\": \"474x348\"}, \"recommendedType\": \"TECHNIQUE\", \"technicalAnalysis\": {\"issues\": [{\"type\": \"Problème de débit\", \"priority\": \"NORMAL\", \"confidence\": 0.5496144200480843, \"detectedAt\": \"2024-12-22T11:59:05.820Z\"}, {\"type\": \"Problème de ventilation\", \"priority\": \"NORMAL\", \"confidence\": 0.5165086574548072, \"detectedAt\": \"2024-12-22T11:59:05.820Z\"}, {\"type\": \"Dysfonctionnement du système de paiement\", \"priority\": \"URGENT\", \"confidence\": 0.8056839099650854, \"detectedAt\": \"2024-12-22T11:59:05.820Z\"}, {\"type\": \"Dysfonctionnement du système de paiement\", \"priority\": \"URGENT\", \"confidence\": 0.8498449122556069, \"detectedAt\": \"2024-12-22T11:59:05.820Z\"}], \"timestamp\": \"2024-12-22T11:59:05.820Z\", \"categories\": [\"POMPE\", \"RESERVOIR\", \"ELECTRONIQUE\"]}, \"maintenanceRecommendations\": [{\"action\": \"Inspection et maintenance préventive recommandée\", \"category\": \"POMPE\", \"priority\": \"NORMAL\", \"estimatedTime\": 120, \"requiredExpertise\": \"Technicien spécialisé en pompes\"}, {\"action\": \"Contrôle de routine des jauges et des systèmes de ventilation\", \"category\": \"RESERVOIR\", \"priority\": \"NORMAL\", \"estimatedTime\": 180, \"requiredExpertise\": \"Expert en systèmes de stockage\"}, {\"action\": \"Diagnostic complet du système électronique requis\", \"category\": \"ELECTRONIQUE\", \"priority\": \"URGENT\", \"estimatedTime\": 90, \"requiredExpertise\": \"Électromécanicien\"}]}', 'traité', '2024-12-24 14:29:46'),
(25, 2, NULL, 'panne', '2025-01-09 23:43:54', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1736462628654-gaz.jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, NULL, NULL, NULL);

-- Insert initial data into Depot
INSERT INTO Depot (nomDepot, adresse) VALUES
('Depot Central', '123 Rue Principale, Tunis'),
('Depot Nord', '456 Avenue du Nord, Bizerte'),
('Depot Sud', '789 Boulevard du Sud, Sfax');

-- Insert initial data into Gerant
INSERT INTO Gerant (idGerant, nom, prenom, matricule, numGerant, idStation) VALUES
(3, 'rodrigo', 'rodriguez', 654321, 1001, 1),
(7, 'nidhal', 'boughanmi', 213456, 1002, 2),
(8, 'nidhal', 'boughanmi', 123455, 1003, 3),
(10, 'oussema', 'boughanmi', 124563, 1004, 4),
(12, 'boughanmi', 'nidhal', 987655, 1005, 5),
(14, 'aloui', 'omar', 254136, 1006, 6),
(16, 'ameur', 'atef', 257413, 1007, 1);

-- Insert initial data into Produit
INSERT INTO Produit (nom, disponibilite, prix, CODPRD, LIBPRD, CODEMB, LIBEMB, TYPPRD, quantite, seuil_alerte) VALUES
('Super Sans Plomb', 'dispo', 2100, 'SSP01', 'Essence Super Sans Plomb', 'L', 'Litre', 'CARBURANT', 5000, 1000),
('Gasoil', 'dispo', 1800, 'GAS01', 'Gasoil Standard', 'L', 'Litre', 'CARBURANT', 8000, 1500),
('GPL', 'dispo', 1000, 'GPL01', 'Gaz de Pétrole Liquéfié', 'L', 'Litre', 'GAZ', 3000, 800);

-- Insert initial data into Material
INSERT INTO Material (idStation, Actif, Description, Emplacement, status) VALUES
(1, 'Pompe 1', 'Pompe à essence principale', 'Zone A', 'Actif'),
(1, 'Pompe 2', 'Pompe à gasoil principale', 'Zone B', 'Actif'),
(2, 'Cuve 1', 'Cuve de stockage essence', 'Sous-sol', 'Actif'),
(2, 'Cuve 2', 'Cuve de stockage gasoil', 'Sous-sol', 'Actif');

-- Insert initial data into Commande
INSERT INTO Commande (montant, date, idProduit, idUtilisateur, etat, RefCommande, idDepot) VALUES
(5000.00, '2024-12-01 10:00:00', 1, 3, 'Validée', 'CMD001', 1),
(7500.00, '2024-12-02 11:30:00', 2, 7, 'En cours', 'CMD002', 2),
(3200.00, '2024-12-03 14:15:00', 3, 8, 'En instance', 'CMD003', 3);

-- Insert initial data into Livraison
INSERT INTO Livraison (idCommande, dateLivraison, numChauffeur, quantiteLv) VALUES
(1, '2024-12-02 15:00:00', 5001, 2500),
(2, '2024-12-03 16:30:00', 5002, 4000);

-- Insert initial data into Commandeproduit
INSERT INTO Commandeproduit (idCommande, idProduit, quantite, prix) VALUES
(1, 1, 100, 2100.00),
(2, 2, 150, 1800.00),
(3, 3, 80, 1000.00);

-- Insert initial data into Mouvementstock
INSERT INTO Mouvementstock (idProduit, quantite, type_mouvement, date_mouvement, idCommande, raison) VALUES
(1, 100, 'ENTREE', '2024-12-01 10:30:00', 1, 'Livraison fournisseur'),
(2, -50, 'RETRAIT', '2024-12-02 11:45:00', 2, 'Vente client'),
(3, 30, 'AJUSTEMENT', '2024-12-03 14:30:00', 3, 'Correction inventaire');

-- Change authentication method for root user
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
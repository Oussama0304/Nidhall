-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  ven. 17 jan. 2025 à 13:26
-- Version du serveur :  5.7.24
-- Version de PHP :  7.2.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `projetpfeagil`
--

-- --------------------------------------------------------

--
-- Structure de la table `Commande`
--

DROP TABLE IF EXISTS `Commande`;
CREATE TABLE IF NOT EXISTS `Commande` (
  `idCommande` bigint(20) NOT NULL AUTO_INCREMENT,
  `montant` float NOT NULL,
  `date` datetime NOT NULL,
  `idProduit` bigint(20) DEFAULT NULL,
  `idUtilisateur` bigint(20) DEFAULT NULL,
  `etat` enum('En instance','En cours','Validée') NOT NULL DEFAULT 'En instance',
  `RefCommande` varchar(50) NOT NULL,
  `depot_id` int(11) DEFAULT NULL,
  `note` text,
  PRIMARY KEY (`idCommande`),
  UNIQUE KEY `RefCommande` (`RefCommande`),
  KEY `idProduit` (`idProduit`),
  KEY `idUtilisateur` (`idUtilisateur`),
  KEY `depot_id` (`depot_id`)
) ENGINE=MyISAM AUTO_INCREMENT=26 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `Commande`
--

INSERT INTO `Commande` (`idCommande`, `montant`, `date`, `idProduit`, `idUtilisateur`, `etat`, `RefCommande`, `depot_id`, `note`) VALUES
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

-- --------------------------------------------------------

--
-- Structure de la table `CommandeProduit`
--

DROP TABLE IF EXISTS `CommandeProduit`;
CREATE TABLE IF NOT EXISTS `CommandeProduit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idCommande` int(11) NOT NULL,
  `idProduit` int(11) NOT NULL,
  `quantite` int(11) NOT NULL,
  `prix` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `CommandeProduit`
--

INSERT INTO `CommandeProduit` (`id`, `idCommande`, `idProduit`, `quantite`, `prix`) VALUES
(2, 4, 2, 1, '2800.00'),
(3, 5, 2, 2, '2800.00'),
(4, 6, 2, 1, '2800.00'),
(5, 7, 2, 1, '2800.00'),
(6, 8, 3, 1, '70000.00'),
(7, 9, 2, 1, '2800.00'),
(8, 10, 2, 3, '2800.00'),
(9, 11, 3, 2, '70000.00'),
(10, 12, 3, 1, '70000.00'),
(11, 13, 2, 1, '2800.00'),
(12, 14, 3, 2, '70000.00'),
(13, 15, 7, 3, '52000.00'),
(14, 16, 2, 3, '2800.00'),
(15, 17, 2, 4, '2800.00'),
(16, 18, 2, 4, '2800.00'),
(21, 23, 2, 1, '2800.00'),
(22, 24, 2, 3, '2800.00'),
(23, 24, 5, 1, '68000.00'),
(24, 25, 2, 6, '2800.00');

-- --------------------------------------------------------

--
-- Structure de la table `Depot`
--

DROP TABLE IF EXISTS `Depot`;
CREATE TABLE IF NOT EXISTS `Depot` (
  `idDepot` bigint(20) NOT NULL AUTO_INCREMENT,
  `nomDepot` varchar(100) NOT NULL,
  `adresse` text NOT NULL,
  PRIMARY KEY (`idDepot`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Equipmentsensors`
--

DROP TABLE IF EXISTS `Equipmentsensors`;
CREATE TABLE IF NOT EXISTS `Equipmentsensors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `equipment_id` int(11) DEFAULT NULL,
  `temperature` float DEFAULT NULL,
  `pressure` float DEFAULT NULL,
  `vibration` float DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `equipment_id` (`equipment_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Gerant`
--

DROP TABLE IF EXISTS `Gerant`;
CREATE TABLE IF NOT EXISTS `Gerant` (
  `idGerant` bigint(20) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `matricule` bigint(20) NOT NULL,
  `numGerant` bigint(20) NOT NULL,
  `idStation` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`idGerant`),
  UNIQUE KEY `matricule` (`matricule`),
  UNIQUE KEY `numGerant` (`numGerant`),
  KEY `idStation` (`idStation`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Livraison`
--

DROP TABLE IF EXISTS `Livraison`;
CREATE TABLE IF NOT EXISTS `Livraison` (
  `idLivraison` bigint(20) NOT NULL AUTO_INCREMENT,
  `idCommande` bigint(20) DEFAULT NULL,
  `dateLivraison` datetime NOT NULL,
  `numChauffeur` bigint(20) NOT NULL,
  `quantiteLv` float NOT NULL,
  PRIMARY KEY (`idLivraison`),
  KEY `idCommande` (`idCommande`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `Livraison`
--

INSERT INTO `Livraison` (`idLivraison`, `idCommande`, `dateLivraison`, `numChauffeur`, `quantiteLv`) VALUES
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

-- --------------------------------------------------------

--
-- Structure de la table `Maintenanceanalytics`
--

DROP TABLE IF EXISTS `Maintenanceanalytics`;
CREATE TABLE IF NOT EXISTS `Maintenanceanalytics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `equipment_id` int(11) DEFAULT NULL,
  `prediction_date` datetime DEFAULT NULL,
  `failure_probability` float DEFAULT NULL,
  `recommended_actions` text,
  `maintenance_priority` varchar(50) DEFAULT NULL,
  `estimated_costs` json DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `equipment_id` (`equipment_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Material`
--

DROP TABLE IF EXISTS `Material`;
CREATE TABLE IF NOT EXISTS `Material` (
  `idStation` bigint(20) DEFAULT NULL,
  `Actif` varchar(50) NOT NULL,
  `Description` text,
  `Emplacement` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  KEY `idStation` (`idStation`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Mouvementstock`
--

DROP TABLE IF EXISTS `Mouvementstock`;
CREATE TABLE IF NOT EXISTS `Mouvementstock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idProduit` int(11) DEFAULT NULL,
  `quantite` int(11) DEFAULT NULL,
  `type_mouvement` enum('ENTREE','RETRAIT','AJUSTEMENT') DEFAULT NULL,
  `date_mouvement` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `idCommande` int(11) DEFAULT NULL,
  `raison` text,
  PRIMARY KEY (`id`),
  KEY `idProduit` (`idProduit`),
  KEY `idCommande` (`idCommande`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `Mouvementstock`
--

INSERT INTO `Mouvementstock` (`id`, `idProduit`, `quantite`, `type_mouvement`, `date_mouvement`, `idCommande`, `raison`) VALUES
(1, 4, 10, 'ENTREE', '2024-12-27 14:23:48', NULL, 'Réapprovisionnement'),
(2, 5, 50, 'RETRAIT', '2024-12-27 14:25:43', NULL, 'Réapprovisionnement'),
(3, 2, 3, 'RETRAIT', '2024-12-27 22:42:27', 20, NULL),
(4, 2, 1, 'RETRAIT', '2024-12-27 22:43:56', 21, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `Performancemetrics`
--

DROP TABLE IF EXISTS `Performancemetrics`;
CREATE TABLE IF NOT EXISTS `Performancemetrics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `metric_date` date DEFAULT NULL,
  `resolution_times` json DEFAULT NULL,
  `satisfaction_rates` json DEFAULT NULL,
  `issue_patterns` json DEFAULT NULL,
  `cost_analysis` json DEFAULT NULL,
  `efficiency_scores` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Produit`
--

DROP TABLE IF EXISTS `Produit`;
CREATE TABLE IF NOT EXISTS `Produit` (
  `idProduit` bigint(20) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `disponibilite` varchar(50) DEFAULT NULL,
  `prix` float NOT NULL,
  `CODPRD` varchar(20) DEFAULT NULL,
  `LIBPRD` varchar(100) DEFAULT NULL,
  `CODEMB` varchar(20) DEFAULT NULL,
  `LIBEMB` varchar(100) DEFAULT NULL,
  `TYPPRD` varchar(50) DEFAULT NULL,
  `quantite` int(11) DEFAULT '0',
  `seuil_alerte` int(11) DEFAULT '10',
  PRIMARY KEY (`idProduit`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `Produit`
--

INSERT INTO `Produit` (`idProduit`, `nom`, `disponibilite`, `prix`, `CODPRD`, `LIBPRD`, `CODEMB`, `LIBEMB`, `TYPPRD`, `quantite`, `seuil_alerte`) VALUES
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

-- --------------------------------------------------------

--
-- Structure de la table `Reclamation`
--

DROP TABLE IF EXISTS `Reclamation`;
CREATE TABLE IF NOT EXISTS `Reclamation` (
  `idReclamation` bigint(20) NOT NULL AUTO_INCREMENT,
  `idGerant` bigint(20) DEFAULT NULL,
  `idCommercial` bigint(20) DEFAULT NULL,
  `description` text NOT NULL,
  `date` datetime NOT NULL,
  `type` enum('TECHNIQUE','COMMERCIALE') NOT NULL,
  `etat` varchar(20) DEFAULT NULL,
  `material` varchar(50) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `priority` enum('URGENT','MOYEN','NORMAL') DEFAULT 'NORMAL',
  `estimatedResolutionTime` int(11) DEFAULT NULL,
  `actualResolutionTime` int(11) DEFAULT NULL,
  `satisfaction` enum('TRES_SATISFAIT','SATISFAIT','NEUTRE','PEU_SATISFAIT','INSATISFAIT') DEFAULT 'NEUTRE',
  `gravite` enum('HAUTE','MOYENNE','FAIBLE') DEFAULT 'FAIBLE',
  `sentiment_score` float DEFAULT NULL,
  `suggestedActions` text,
  `aiConfidence` json DEFAULT NULL,
  `image_analysis` json DEFAULT NULL,
  `reponse` text,
  `date_reponse` datetime DEFAULT NULL,
  `categories` json DEFAULT NULL,
  `keywords` json DEFAULT NULL,
  `impact_score` float DEFAULT NULL,
  `related_issues` json DEFAULT NULL,
  `resolution_history` json DEFAULT NULL,
  `predicted_resolution_time` int(11) DEFAULT NULL,
  `maintenance_cost` float DEFAULT NULL,
  `analysis_results` json DEFAULT NULL,
  `last_analyzed` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`idReclamation`),
  KEY `idGerant` (`idGerant`),
  KEY `idCommercial` (`idCommercial`)
) ENGINE=MyISAM AUTO_INCREMENT=31 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `Reclamation`
--

INSERT INTO `Reclamation` (`idReclamation`, `idGerant`, `idCommercial`, `description`, `date`, `type`, `etat`, `material`, `image_url`, `priority`, `estimatedResolutionTime`, `actualResolutionTime`, `satisfaction`, `gravite`, `sentiment_score`, `suggestedActions`, `aiConfidence`, `image_analysis`, `reponse`, `date_reponse`, `categories`, `keywords`, `impact_score`, `related_issues`, `resolution_history`, `predicted_resolution_time`, `maintenance_cost`, `analysis_results`, `last_analyzed`) VALUES
(1, 3, NULL, 'hfhhfhfhhfh', '2024-12-08 23:53:39', 'COMMERCIALE', 'Validée', NULL, NULL, 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 3, NULL, 'hvgfchxdgwsdxgcfhgvj', '2024-12-18 11:10:10', 'TECHNIQUE', 'En instance', NULL, NULL, 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 3, NULL, 'lnbhgvfcxdxgchv', '2024-12-18 13:53:08', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1734526388342-images.png', 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 3, NULL, 'panne', '2024-12-18 14:13:37', 'COMMERCIALE', 'En instance', NULL, '/uploads/reclamations/1734527617578-usecom.PNG', 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 3, NULL, 'panne com', '2024-12-18 23:17:57', 'COMMERCIALE', 'Validée', NULL, '/uploads/reclamations/1734560277307-dashger4.PNG', 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 3, NULL, 'probleme de commande', '2024-12-19 00:37:32', 'COMMERCIALE', 'Validée', NULL, '/uploads/reclamations/1734565052432-etat.PNG', 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 3, NULL, 'probleme de prix', '2024-12-19 12:26:25', 'COMMERCIALE', 'Validée', NULL, '/uploads/reclamations/1734607585169-liv.PNG', 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 3, NULL, 'probleme de prix', '2024-12-19 12:36:21', 'COMMERCIALE', 'Validée', NULL, '/uploads/reclamations/1734608181964-liv.PNG', 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 3, NULL, 'panne technique', '2024-12-19 14:57:08', 'COMMERCIALE', 'En cours', NULL, '/uploads/reclamations/1734616628308-liv.PNG', 'NORMAL', NULL, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 3, NULL, '\"Retard de livraison de carburant, le délai habituel n\'a pas été respecté. Besoin d\'une solution rapidement.\"', '2024-12-20 14:28:05', 'COMMERCIALE', 'En cours', NULL, '/uploads/reclamations/1734701285247-str.PNG', 'MOYEN', 24, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(11, 3, NULL, '\"Panne urgente du système de pompage, équipement complètement arrêté ! Situation critique nécessitant une intervention immédiate.\"', '2024-12-20 14:41:34', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1734702094290-str.PNG', 'MOYEN', 48, NULL, 'NEUTRE', 'FAIBLE', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(12, 3, NULL, 'grave', '2024-12-20 21:26:20', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1734726380344-mern.jpg', 'MOYEN', 48, NULL, 'PEU_SATISFAIT', 'MOYENNE', -2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(13, 3, 2, 'URGENT ! Panne critique du système de distribution. Situation inacceptable, nous perdons des clients ! Intervention immédiate requise.', '2024-12-20 21:31:05', 'TECHNIQUE', 'En instance', NULL, NULL, 'URGENT', 24, NULL, 'INSATISFAIT', 'HAUTE', -3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(14, 3, NULL, 'panne grave', '2024-12-20 23:25:53', 'TECHNIQUE', 'En instance', NULL, NULL, 'MOYEN', 48, NULL, 'PEU_SATISFAIT', 'MOYENNE', -2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(15, 3, NULL, 'panne ', '2024-12-20 23:28:32', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1734733712207-OIP.jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(16, 3, NULL, 'panne urgente', '2024-12-20 23:33:16', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1734733996246-OIP.jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, '{\"analysis\": {\"quality\": \"Faible\", \"resolution\": \"Basse\"}, \"metadata\": {\"width\": 474, \"format\": \"jpeg\", \"height\": 632}, \"recommendedType\": \"TECHNIQUE\", \"technicalIssues\": [{\"type\": \"Qualité d\'image insuffisante\", \"confidence\": 0.8, \"description\": \"L\'image est de trop basse résolution pour une analyse détaillée\"}, {\"type\": \"Problème potentiel de pompe\", \"confidence\": 0.75, \"description\": \"Inspection visuelle recommandée\"}, {\"type\": \"Usure possible\", \"confidence\": 0.65, \"description\": \"Vérification de maintenance conseillée\"}]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(17, 3, NULL, 'panne', '2024-12-20 23:44:49', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1734734689421-OIP.jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, '{\"metadata\": {\"width\": 474, \"format\": \"jpeg\", \"height\": 632}, \"severity\": {\"level\": \"HAUTE\", \"mediumCount\": 1, \"totalIssues\": 7, \"urgentCount\": 2}, \"imageQuality\": {\"format\": \"jpeg\", \"quality\": \"Faible\", \"isAdequate\": false, \"resolution\": \"474x632\"}, \"recommendedType\": \"TECHNIQUE\", \"technicalAnalysis\": {\"issues\": [{\"type\": \"Problème de ventilation\", \"priority\": \"NORMAL\", \"confidence\": 0.5279091883148068, \"detectedAt\": \"2024-12-20T22:44:49.455Z\"}, {\"type\": \"Corrosion visible\", \"priority\": \"URGENT\", \"confidence\": 0.8310498337596681, \"detectedAt\": \"2024-12-20T22:44:49.455Z\"}, {\"type\": \"Fuite dans la tuyauterie\", \"priority\": \"NORMAL\", \"confidence\": 0.5571135704859556, \"detectedAt\": \"2024-12-20T22:44:49.455Z\"}, {\"type\": \"Panne d\'affichage\", \"priority\": \"NORMAL\", \"confidence\": 0.5077171781428681, \"detectedAt\": \"2024-12-20T22:44:49.455Z\"}, {\"type\": \"Panne d\'affichage\", \"priority\": \"NORMAL\", \"confidence\": 0.5000565065701147, \"detectedAt\": \"2024-12-20T22:44:49.455Z\"}, {\"type\": \"Problème d\'arrêt d\'urgence\", \"priority\": \"MOYEN\", \"confidence\": 0.7599139904614581, \"detectedAt\": \"2024-12-20T22:44:49.455Z\"}, {\"type\": \"Problème d\'arrêt d\'urgence\", \"priority\": \"URGENT\", \"confidence\": 0.8200099595654305, \"detectedAt\": \"2024-12-20T22:44:49.455Z\"}], \"timestamp\": \"2024-12-20T22:44:49.455Z\", \"categories\": [\"RESERVOIR\", \"TUYAUTERIE\", \"ELECTRONIQUE\", \"SECURITE\"]}, \"maintenanceRecommendations\": [{\"action\": \"Contrôle de routine des jauges et des systèmes de ventilation\", \"category\": \"RESERVOIR\", \"priority\": \"NORMAL\", \"estimatedTime\": 180, \"requiredExpertise\": \"Expert en systèmes de stockage\"}, {\"action\": \"Inspection immédiate des conduites et remplacement si nécessaire\", \"category\": \"TUYAUTERIE\", \"priority\": \"URGENT\", \"estimatedTime\": 135, \"requiredExpertise\": \"Plombier industriel\"}, {\"action\": \"Test des systèmes et mise à jour si nécessaire\", \"category\": \"ELECTRONIQUE\", \"priority\": \"NORMAL\", \"estimatedTime\": 90, \"requiredExpertise\": \"Électromécanicien\"}, {\"action\": \"Intervention immédiate - Mise en sécurité requise\", \"category\": \"SECURITE\", \"priority\": \"URGENT\", \"estimatedTime\": 67.5, \"requiredExpertise\": \"Technicien de sécurité\"}]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(18, 3, NULL, 'panne', '2024-12-21 15:12:36', 'COMMERCIALE', 'En instance', NULL, '/uploads/reclamations/1734790355781-OIP.jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, '{\"metadata\": {\"width\": 474, \"format\": \"jpeg\", \"height\": 632}, \"severity\": {\"level\": \"MOYENNE\", \"mediumCount\": 5, \"totalIssues\": 6, \"urgentCount\": 0}, \"imageQuality\": {\"format\": \"jpeg\", \"quality\": \"Faible\", \"isAdequate\": false, \"resolution\": \"474x632\"}, \"recommendedType\": \"COMMERCIALE\", \"technicalAnalysis\": {\"issues\": [{\"type\": \"Contamination possible\", \"priority\": \"MOYEN\", \"confidence\": 0.679424596885968, \"detectedAt\": \"2024-12-21T14:12:35.911Z\"}, {\"type\": \"Fuite potentielle\", \"priority\": \"MOYEN\", \"confidence\": 0.7078568999160919, \"detectedAt\": \"2024-12-21T14:12:35.911Z\"}, {\"type\": \"Corrosion visible\", \"priority\": \"MOYEN\", \"confidence\": 0.6999226818953832, \"detectedAt\": \"2024-12-21T14:12:35.911Z\"}, {\"type\": \"Problème de joint\", \"priority\": \"MOYEN\", \"confidence\": 0.7137187424789153, \"detectedAt\": \"2024-12-21T14:12:35.911Z\"}, {\"type\": \"Problème de mise à la terre\", \"priority\": \"NORMAL\", \"confidence\": 0.5180150915679863, \"detectedAt\": \"2024-12-21T14:12:35.911Z\"}, {\"type\": \"Dysfonctionnement des alarmes\", \"priority\": \"MOYEN\", \"confidence\": 0.6401280249160551, \"detectedAt\": \"2024-12-21T14:12:35.911Z\"}], \"timestamp\": \"2024-12-21T14:12:35.911Z\", \"categories\": [\"RESERVOIR\", \"TUYAUTERIE\", \"SECURITE\"]}, \"maintenanceRecommendations\": [{\"action\": \"Contrôle de routine des jauges et des systèmes de ventilation\", \"category\": \"RESERVOIR\", \"priority\": \"NORMAL\", \"estimatedTime\": 270, \"requiredExpertise\": \"Expert en systèmes de stockage\"}, {\"action\": \"Vérification des joints et de l\'état général\", \"category\": \"TUYAUTERIE\", \"priority\": \"NORMAL\", \"estimatedTime\": 135, \"requiredExpertise\": \"Plombier industriel\"}, {\"action\": \"Vérification des systèmes de sécurité\", \"category\": \"SECURITE\", \"priority\": \"NORMAL\", \"estimatedTime\": 67.5, \"requiredExpertise\": \"Technicien de sécurité\"}]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(19, 3, NULL, 'panne grave urgente', '2024-12-22 12:18:36', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1734866315866-OIP.jpg', 'MOYEN', 48, NULL, 'PEU_SATISFAIT', 'MOYENNE', -2, NULL, NULL, '{\"metadata\": {\"width\": 474, \"format\": \"jpeg\", \"height\": 632}, \"severity\": {\"level\": \"HAUTE\", \"mediumCount\": 3, \"totalIssues\": 4, \"urgentCount\": 1}, \"imageQuality\": {\"format\": \"jpeg\", \"quality\": \"Faible\", \"isAdequate\": false, \"resolution\": \"474x632\"}, \"recommendedType\": \"TECHNIQUE\", \"technicalAnalysis\": {\"issues\": [{\"type\": \"Problème de ventilation\", \"priority\": \"MOYEN\", \"confidence\": 0.7814977847330855, \"detectedAt\": \"2024-12-22T11:18:35.949Z\"}, {\"type\": \"Problème de circuit électrique\", \"priority\": \"MOYEN\", \"confidence\": 0.7076271710865283, \"detectedAt\": \"2024-12-22T11:18:35.949Z\"}, {\"type\": \"Problème de circuit électrique\", \"priority\": \"MOYEN\", \"confidence\": 0.7644353313286147, \"detectedAt\": \"2024-12-22T11:18:35.949Z\"}, {\"type\": \"Signalisation défectueuse\", \"priority\": \"URGENT\", \"confidence\": 0.9628847727132398, \"detectedAt\": \"2024-12-22T11:18:35.950Z\"}], \"timestamp\": \"2024-12-22T11:18:35.950Z\", \"categories\": [\"RESERVOIR\", \"ELECTRONIQUE\", \"SECURITE\"]}, \"maintenanceRecommendations\": [{\"action\": \"Contrôle de routine des jauges et des systèmes de ventilation\", \"category\": \"RESERVOIR\", \"priority\": \"NORMAL\", \"estimatedTime\": 180, \"requiredExpertise\": \"Expert en systèmes de stockage\"}, {\"action\": \"Test des systèmes et mise à jour si nécessaire\", \"category\": \"ELECTRONIQUE\", \"priority\": \"NORMAL\", \"estimatedTime\": 90, \"requiredExpertise\": \"Électromécanicien\"}, {\"action\": \"Intervention immédiate - Mise en sécurité requise\", \"category\": \"SECURITE\", \"priority\": \"URGENT\", \"estimatedTime\": 45, \"requiredExpertise\": \"Technicien de sécurité\"}]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(20, 3, 2, 'panne des pistolé', '2024-12-22 12:31:39', 'COMMERCIALE', 'En instance', NULL, '/uploads/reclamations/1734867098375-maxnewsfrthree.jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, '{\"metadata\": {\"width\": 5760, \"format\": \"jpeg\", \"height\": 3840}, \"severity\": {\"level\": \"MOYENNE\", \"mediumCount\": 3, \"totalIssues\": 5, \"urgentCount\": 0}, \"imageQuality\": {\"format\": \"jpeg\", \"quality\": \"Bonne\", \"isAdequate\": true, \"resolution\": \"5760x3840\"}, \"recommendedType\": \"COMMERCIALE\", \"technicalAnalysis\": {\"issues\": [{\"type\": \"Fuite potentielle\", \"priority\": \"MOYEN\", \"confidence\": 0.7178349890886876, \"detectedAt\": \"2024-12-22T11:31:38.784Z\"}, {\"type\": \"Problème de jauge\", \"priority\": \"MOYEN\", \"confidence\": 0.6402843834718142, \"detectedAt\": \"2024-12-22T11:31:38.784Z\"}, {\"type\": \"Problème de joint\", \"priority\": \"NORMAL\", \"confidence\": 0.5336765683338408, \"detectedAt\": \"2024-12-22T11:31:38.784Z\"}, {\"type\": \"Problème de joint\", \"priority\": \"NORMAL\", \"confidence\": 0.5829925898764249, \"detectedAt\": \"2024-12-22T11:31:38.784Z\"}, {\"type\": \"Signalisation défectueuse\", \"priority\": \"MOYEN\", \"confidence\": 0.7433062493593358, \"detectedAt\": \"2024-12-22T11:31:38.784Z\"}], \"timestamp\": \"2024-12-22T11:31:38.784Z\", \"categories\": [\"RESERVOIR\", \"TUYAUTERIE\", \"SECURITE\"]}, \"maintenanceRecommendations\": [{\"action\": \"Contrôle de routine des jauges et des systèmes de ventilation\", \"category\": \"RESERVOIR\", \"priority\": \"NORMAL\", \"estimatedTime\": 270, \"requiredExpertise\": \"Expert en systèmes de stockage\"}, {\"action\": \"Vérification des joints et de l\'état général\", \"category\": \"TUYAUTERIE\", \"priority\": \"NORMAL\", \"estimatedTime\": 135, \"requiredExpertise\": \"Plombier industriel\"}, {\"action\": \"Vérification des systèmes de sécurité\", \"category\": \"SECURITE\", \"priority\": \"NORMAL\", \"estimatedTime\": 45, \"requiredExpertise\": \"Technicien de sécurité\"}]}', 'ouiii', '2024-12-26 09:50:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(23, 3, NULL, 'panne grave', '2024-12-30 10:32:07', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1735551126749-gaz.jpg', 'MOYEN', 48, NULL, 'PEU_SATISFAIT', 'MOYENNE', -2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{\"raw\": {\"faultAnalysis\": [{\"label\": \"gas pump, gasoline pump, petrol pump, island dispenser\", \"score\": 0.9997554421424866}, {\"label\": \"pay-phone, pay-station\", \"score\": 0.000022879465177538805}, {\"label\": \"acoustic guitar\", \"score\": 0.000005061816409579478}, {\"label\": \"parking meter\", \"score\": 0.0000050613625717232935}, {\"label\": \"cash machine, cash dispenser, automated teller machine, automatic teller machine, automated teller, automatic teller, ATM\", \"score\": 0.000004366846951597836}], \"classification\": [{\"label\": \"gas pump, gasoline pump, petrol pump, island dispenser\", \"score\": 0.9967055916786194}, {\"label\": \"vending machine\", \"score\": 0.0004425408551469445}, {\"label\": \"cash machine, cash dispenser, automated teller machine, automatic teller machine, automated teller, automatic teller, ATM\", \"score\": 0.0003112129052169621}, {\"label\": \"cinema, movie theater, movie theatre, movie house, picture palace\", \"score\": 0.0002483577700331807}, {\"label\": \"pay-phone, pay-station\", \"score\": 0.00019211266771890223}], \"objectDetection\": [{\"box\": {\"xmax\": 463, \"xmin\": 41, \"ymax\": 606, \"ymin\": 418}, \"label\": \"car\", \"score\": 0.9991008043289183}]}, \"faultAnalysis\": {\"type\": \"pompe_defectueuse\", \"pieces\": [\"Pompe hydraulique\", \"Joint d\'étanchéité\", \"Roulement\"], \"gravite\": \"haute\", \"keywords\": [\"pump\", \"hydraulic\", \"water\", \"flow\"], \"solution\": \"Remplacer la pompe défectueuse et vérifier le circuit hydraulique\", \"confidence\": 0.272435766530841, \"maintenance\": {\"priority\": \"URGENT\", \"estimatedTime\": 120, \"requiredExpertise\": \"Technicien hydraulique\"}}, \"classification\": [{\"label\": \"gas pump, gasoline pump, petrol pump, island dispenser\", \"confidence\": 0.9967055916786194}, {\"label\": \"vending machine\", \"confidence\": 0.0004425408551469445}, {\"label\": \"cash machine, cash dispenser, automated teller machine, automatic teller machine, automated teller, automatic teller, ATM\", \"confidence\": 0.0003112129052169621}, {\"label\": \"cinema, movie theater, movie theatre, movie house, picture palace\", \"score\": 0.0002483577700331807}, {\"label\": \"pay-phone, pay-station\", \"confidence\": 0.00019211266771890223}], \"detectedObjects\": [{\"box\": {\"xmax\": 463, \"xmin\": 41, \"ymax\": 606, \"ymin\": 418}, \"label\": \"car\", \"confidence\": 0.9991008043289183}]}', '2025-01-16 21:02:09'),
(24, 1, NULL, 'panne de paiment ', '2025-01-08 23:40:29', 'COMMERCIALE', 'En instance', NULL, '/uploads/reclamations/1736376024636-OIP (2).jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{\"raw\": {\"faultAnalysis\": [{\"label\": \"solar dish, solar collector, solar furnace\", \"score\": 0.558073878288269}, {\"label\": \"electric fan, blower\", \"score\": 0.2003784477710724}, {\"label\": \"space shuttle\", \"score\": 0.030233291909098625}, {\"label\": \"lampshade, lamp shade\", \"score\": 0.015254564583301544}, {\"label\": \"bolo tie, bolo, bola tie, bola\", \"score\": 0.013289186172187328}], \"classification\": [{\"label\": \"switch, electric switch, electrical switch\", \"score\": 0.3936117887496948}, {\"label\": \"spotlight, spot\", \"score\": 0.0951634868979454}, {\"label\": \"oscilloscope, scope, cathode-ray oscilloscope, CRO\", \"score\": 0.09016034752130508}, {\"label\": \"modem\", \"score\": 0.06443137675523758}, {\"label\": \"projector\", \"score\": 0.06130140274763107}], \"objectDetection\": [{\"box\": {\"xmax\": 197, \"xmin\": 71, \"ymax\": 157, \"ymin\": 54}, \"label\": \"clock\", \"score\": 0.5825058817863464}, {\"box\": {\"xmax\": 154, \"xmin\": 71, \"ymax\": 152, \"ymin\": 55}, \"label\": \"clock\", \"score\": 0.6265724897384644}]}, \"faultAnalysis\": {\"type\": \"probleme_electrique\", \"pieces\": [\"Capteur\", \"Câblage\", \"Relais\"], \"gravite\": \"haute\", \"keywords\": [\"electric\", \"wire\", \"circuit\", \"power\", \"connection\"], \"solution\": \"Vérifier le circuit électrique et remplacer les composants défectueux\", \"confidence\": 0.22758134524337947, \"maintenance\": {\"priority\": \"URGENT\", \"estimatedTime\": 45, \"requiredExpertise\": \"Électricien\"}}, \"classification\": [{\"label\": \"switch, electric switch, electrical switch\", \"confidence\": 0.3936117887496948}, {\"label\": \"spotlight, spot\", \"confidence\": 0.0951634868979454}, {\"label\": \"oscilloscope, scope, cathode-ray oscilloscope, CRO\", \"confidence\": 0.09016034752130508}, {\"label\": \"modem\", \"confidence\": 0.06443137675523758}, {\"label\": \"projector\", \"confidence\": 0.06130140274763107}], \"detectedObjects\": [{\"box\": {\"xmax\": 197, \"xmin\": 71, \"ymax\": 157, \"ymin\": 54}, \"label\": \"clock\", \"confidence\": 0.5825058817863464}, {\"box\": {\"xmax\": 154, \"xmin\": 71, \"ymax\": 152, \"ymin\": 55}, \"label\": \"clock\", \"confidence\": 0.6265724897384644}]}', '2025-01-16 19:08:39'),
(21, 2, NULL, 'panne de jauge d essence ', '2024-12-22 12:49:42', 'TECHNIQUE', 'Validée', NULL, '/uploads/reclamations/1734868182053-maxnewsfrthree.jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, '{\"metadata\": {\"width\": 5760, \"format\": \"jpeg\", \"height\": 3840}, \"severity\": {\"level\": \"HAUTE\", \"mediumCount\": 2, \"totalIssues\": 8, \"urgentCount\": 4}, \"imageQuality\": {\"format\": \"jpeg\", \"quality\": \"Bonne\", \"isAdequate\": true, \"resolution\": \"5760x3840\"}, \"recommendedType\": \"TECHNIQUE\", \"technicalAnalysis\": {\"issues\": [{\"type\": \"Contamination possible\", \"priority\": \"MOYEN\", \"confidence\": 0.79377502132514, \"detectedAt\": \"2024-12-22T11:49:42.296Z\"}, {\"type\": \"Problème de jauge\", \"priority\": \"URGENT\", \"confidence\": 0.8689189133200741, \"detectedAt\": \"2024-12-22T11:49:42.297Z\"}, {\"type\": \"Corrosion visible\", \"priority\": \"URGENT\", \"confidence\": 0.8722830761041439, \"detectedAt\": \"2024-12-22T11:49:42.297Z\"}, {\"type\": \"Problème de joint\", \"priority\": \"URGENT\", \"confidence\": 0.9128138973683616, \"detectedAt\": \"2024-12-22T11:49:42.297Z\"}, {\"type\": \"Problème de circuit électrique\", \"priority\": \"URGENT\", \"confidence\": 0.8751091026155587, \"detectedAt\": \"2024-12-22T11:49:42.297Z\"}, {\"type\": \"Erreur de communication\", \"priority\": \"NORMAL\", \"confidence\": 0.5681755085616752, \"detectedAt\": \"2024-12-22T11:49:42.297Z\"}, {\"type\": \"Problème d\'arrêt d\'urgence\", \"priority\": \"NORMAL\", \"confidence\": 0.5799126020173094, \"detectedAt\": \"2024-12-22T11:49:42.297Z\"}, {\"type\": \"Signalisation défectueuse\", \"priority\": \"MOYEN\", \"confidence\": 0.6674826054094176, \"detectedAt\": \"2024-12-22T11:49:42.297Z\"}], \"timestamp\": \"2024-12-22T11:49:42.297Z\", \"categories\": [\"RESERVOIR\", \"TUYAUTERIE\", \"ELECTRONIQUE\", \"SECURITE\"]}, \"maintenanceRecommendations\": [{\"action\": \"Vérification immédiate de l\'étanchéité et des niveaux\", \"category\": \"RESERVOIR\", \"priority\": \"URGENT\", \"estimatedTime\": 270, \"requiredExpertise\": \"Expert en systèmes de stockage\"}, {\"action\": \"Inspection immédiate des conduites et remplacement si nécessaire\", \"category\": \"TUYAUTERIE\", \"priority\": \"URGENT\", \"estimatedTime\": 135, \"requiredExpertise\": \"Plombier industriel\"}, {\"action\": \"Diagnostic complet du système électronique requis\", \"category\": \"ELECTRONIQUE\", \"priority\": \"URGENT\", \"estimatedTime\": 90, \"requiredExpertise\": \"Électromécanicien\"}, {\"action\": \"Vérification des systèmes de sécurité\", \"category\": \"SECURITE\", \"priority\": \"NORMAL\", \"estimatedTime\": 67.5, \"requiredExpertise\": \"Technicien de sécurité\"}]}', 'Cher gérant,\n\nSuite à l\'analyse de votre réclamation #21, voici notre évaluation détaillée :\n\n1. Analyse Technique :\n   - URGENT: Dysfonctionnement du système de paiement (Confiance: 80.6%)\n   - Problème de débit (Confiance: 55%)\n   - Problème de ventilation (Confiance: 51.7%)\n\n2. Recommandations de Maintenance :\n   - POMPE: Inspection et maintenance préventive recommandée\n     Expert requis: Technicien spécialisé en pompes\n     Temps estimé: 120 minutes\n\n   - RESERVOIR: Contrôle de routine des jauges et des systèmes de ventilation\n     Expert requis: Expert en systèmes de stockage\n     Temps estimé: 180 minutes\n\n   - ELECTRONIQUE: Diagnostic complet du système électronique requis\n     Expert requis: Electromécanicien\n     Temps estimé: 90 minutes\n\n3. Plan d\'Action :\n   - Intervention immédiate requise pour le système de paiement\n   - Un électromécanicien sera envoyé en priorité\n   - Planification des maintenances préventives pour la pompe et le réservoir\n\nNous prenons en charge votre demande avec la plus grande attention. Notre équipe technique interviendra selon les priorités identifiées.\n\nCordialement,\nVotre Commercial', '2024-12-23 14:29:21', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(22, 2, NULL, 'panne commercial', '2024-12-22 12:59:06', 'TECHNIQUE', 'Validée', NULL, '/uploads/reclamations/1734868745738-OIP (1).jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, '{\"metadata\": {\"width\": 474, \"format\": \"jpeg\", \"height\": 348}, \"severity\": {\"level\": \"HAUTE\", \"mediumCount\": 0, \"totalIssues\": 4, \"urgentCount\": 2}, \"imageQuality\": {\"format\": \"jpeg\", \"quality\": \"Faible\", \"isAdequate\": false, \"resolution\": \"474x348\"}, \"recommendedType\": \"TECHNIQUE\", \"technicalAnalysis\": {\"issues\": [{\"type\": \"Problème de débit\", \"priority\": \"NORMAL\", \"confidence\": 0.5496144200480843, \"detectedAt\": \"2024-12-22T11:59:05.820Z\"}, {\"type\": \"Problème de ventilation\", \"priority\": \"NORMAL\", \"confidence\": 0.5165086574548072, \"detectedAt\": \"2024-12-22T11:59:05.820Z\"}, {\"type\": \"Dysfonctionnement du système de paiement\", \"priority\": \"URGENT\", \"confidence\": 0.8056839099650854, \"detectedAt\": \"2024-12-22T11:59:05.820Z\"}, {\"type\": \"Dysfonctionnement du système de paiement\", \"priority\": \"URGENT\", \"confidence\": 0.8498449122556069, \"detectedAt\": \"2024-12-22T11:59:05.820Z\"}], \"timestamp\": \"2024-12-22T11:59:05.820Z\", \"categories\": [\"POMPE\", \"RESERVOIR\", \"ELECTRONIQUE\"]}, \"maintenanceRecommendations\": [{\"action\": \"Inspection et maintenance préventive recommandée\", \"category\": \"POMPE\", \"priority\": \"NORMAL\", \"estimatedTime\": 120, \"requiredExpertise\": \"Technicien spécialisé en pompes\"}, {\"action\": \"Contrôle de routine des jauges et des systèmes de ventilation\", \"category\": \"RESERVOIR\", \"priority\": \"NORMAL\", \"estimatedTime\": 180, \"requiredExpertise\": \"Expert en systèmes de stockage\"}, {\"action\": \"Diagnostic complet du système électronique requis\", \"category\": \"ELECTRONIQUE\", \"priority\": \"URGENT\", \"estimatedTime\": 90, \"requiredExpertise\": \"Électromécanicien\"}]}', 'traité', '2024-12-24 14:29:46', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(25, 2, NULL, 'panne', '2025-01-09 23:43:54', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1736462628654-gaz.jpg', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(26, 3, NULL, 'panne pompe', '2025-01-14 11:29:24', 'TECHNIQUE', 'Validée', NULL, '/uploads/reclamations/1736850562976-pompe.PNG', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(27, 3, NULL, 'moteur', '2025-01-14 23:25:36', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1736893535343-moteur.PNG', 'NORMAL', 72, NULL, 'NEUTRE', 'FAIBLE', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{\"raw\": {\"faultAnalysis\": [{\"label\": \"disk brake, disc brake\", \"score\": 0.3548048436641693}, {\"label\": \"chain\", \"score\": 0.10178683698177338}, {\"label\": \"solar dish, solar collector, solar furnace\", \"score\": 0.07505951076745987}, {\"label\": \"electric fan, blower\", \"score\": 0.06977570801973343}, {\"label\": \"coil, spiral, volute, whorl, helix\", \"score\": 0.05049755424261093}], \"classification\": [{\"label\": \"drilling platform, offshore rig\", \"score\": 0.18550777435302737}, {\"label\": \"coil, spiral, volute, whorl, helix\", \"score\": 0.13260100781917572}, {\"label\": \"chain\", \"score\": 0.0635957345366478}, {\"label\": \"crane\", \"score\": 0.027849195525050163}, {\"label\": \"hook, claw\", \"score\": 0.02586141787469387}], \"objectDetection\": []}, \"faultAnalysis\": {\"type\": \"fuite_huile\", \"pieces\": [\"Joint torique\", \"Tuyau hydraulique\", \"Raccord\"], \"gravite\": \"moyenne\", \"keywords\": [\"leak\", \"oil\", \"fluid\", \"drip\"], \"solution\": \"Localiser la fuite, remplacer les joints et vérifier la pression\", \"confidence\": 0.10873395837843418, \"maintenance\": {\"priority\": \"MOYEN\", \"estimatedTime\": 60, \"requiredExpertise\": \"Technicien maintenance\"}}, \"classification\": [{\"label\": \"drilling platform, offshore rig\", \"confidence\": 0.18550777435302737}, {\"label\": \"coil, spiral, volute, whorl, helix\", \"confidence\": 0.13260100781917572}, {\"label\": \"chain\", \"confidence\": 0.0635957345366478}, {\"label\": \"crane\", \"confidence\": 0.027849195525050163}, {\"label\": \"hook, claw\", \"confidence\": 0.02586141787469387}], \"detectedObjects\": []}', '2025-01-16 23:26:25'),
(28, 3, NULL, 'panne ', '2025-01-16 15:19:43', 'TECHNIQUE', 'Validée', NULL, '/uploads/reclamations/1737037183486-carburant.PNG', 'MOYEN', 48, NULL, 'NEUTRE', 'MOYENNE', 0, NULL, NULL, '{\"width\": 797, \"format\": \"png\", \"height\": 402, \"quality\": \"FAIBLE\", \"suggestedIssues\": [\"Fuite au niveau de la pompe\", \"Problème de débit\", \"Affichage digital défectueux\", \"Problème de compteur\", \"Usure des joints\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{\"raw\": {\"faultAnalysis\": [{\"label\": \"cash machine, cash dispenser, automated teller machine, automatic teller machine, automated teller, automatic teller, ATM\", \"score\": 0.93997722864151}, {\"label\": \"gas pump, gasoline pump, petrol pump, island dispenser\", \"score\": 0.012763126753270626}, {\"label\": \"turnstile\", \"score\": 0.003440291155129671}, {\"label\": \"packet\", \"score\": 0.0027187871746718884}, {\"label\": \"library\", \"score\": 0.002194852102547884}], \"classification\": [{\"label\": \"gas pump, gasoline pump, petrol pump, island dispenser\", \"score\": 0.3801056146621704}, {\"label\": \"turnstile\", \"score\": 0.11387628316879272}, {\"label\": \"cash machine, cash dispenser, automated teller machine, automatic teller machine, automated teller, automatic teller, ATM\", \"score\": 0.11377602815628052}, {\"label\": \"vending machine\", \"score\": 0.06947778910398483}, {\"label\": \"library\", \"score\": 0.06391384452581406}], \"objectDetection\": []}, \"faultAnalysis\": {\"type\": \"pompe_defectueuse\", \"pieces\": [\"Pompe hydraulique\", \"Joint d\'étanchéité\", \"Roulement\"], \"gravite\": \"haute\", \"keywords\": [\"pump\", \"hydraulic\", \"water\", \"flow\"], \"solution\": \"Remplacer la pompe défectueuse et vérifier le circuit hydraulique\", \"confidence\": 0.17022438454441727, \"maintenance\": {\"priority\": \"URGENT\", \"estimatedTime\": 120, \"requiredExpertise\": \"Technicien hydraulique\"}}, \"classification\": [{\"label\": \"gas pump, gasoline pump, petrol pump, island dispenser\", \"confidence\": 0.3801056146621704}, {\"label\": \"turnstile\", \"confidence\": 0.11387628316879272}, {\"label\": \"cash machine, cash dispenser, automated teller machine, automatic teller machine, automated teller, automatic teller, ATM\", \"confidence\": 0.11377602815628052}, {\"label\": \"vending machine\", \"confidence\": 0.06947778910398483}, {\"label\": \"library\", \"confidence\": 0.06391384452581406}], \"detectedObjects\": []}', '2025-01-16 19:07:32'),
(29, 2, NULL, 'panne urgent', '2025-01-16 20:22:37', 'COMMERCIALE', 'En instance', NULL, '/uploads/reclamations/1737055357709-payme.PNG', 'MOYEN', 48, NULL, 'PEU_SATISFAIT', 'MOYENNE', -1, NULL, NULL, '{\"width\": 656, \"format\": \"png\", \"height\": 406, \"quality\": \"FAIBLE\", \"suggestedIssues\": [\"Fuite au niveau de la pompe\", \"Problème de débit\", \"Affichage digital défectueux\", \"Problème de compteur\", \"Usure des joints\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{\"raw\": {\"faultAnalysis\": [{\"label\": \"hand-held computer, hand-held microcomputer\", \"score\": 0.649480402469635}, {\"label\": \"cash machine, cash dispenser, automated teller machine, automatic teller machine, automated teller, automatic teller, ATM\", \"score\": 0.2539142668247223}, {\"label\": \"cellular telephone, cellular phone, cellphone, cell, mobile phone\", \"score\": 0.03300934284925461}, {\"label\": \"photocopier\", \"score\": 0.01267777569591999}, {\"label\": \"Band Aid\", \"score\": 0.005747293587774038}], \"classification\": [{\"label\": \"hand-held computer, hand-held microcomputer\", \"score\": 0.4958842396736145}, {\"label\": \"cash machine, cash dispenser, automated teller machine, automatic teller machine, automated teller, automatic teller, ATM\", \"score\": 0.460530161857605}, {\"label\": \"switch, electric switch, electrical switch\", \"score\": 0.002025771187618375}, {\"label\": \"joystick\", \"score\": 0.001944305724464357}, {\"label\": \"combination lock\", \"score\": 0.0019143893150612712}], \"objectDetection\": [{\"box\": {\"xmax\": 343, \"xmin\": 142, \"ymax\": 403, \"ymin\": 9}, \"label\": \"cell phone\", \"score\": 0.9945794343948364}, {\"box\": {\"xmax\": 557, \"xmin\": 300, \"ymax\": 121, \"ymin\": 0}, \"label\": \"person\", \"score\": 0.9973527193069458}]}, \"faultAnalysis\": {\"type\": \"probleme_electrique\", \"pieces\": [\"Capteur\", \"Câblage\", \"Relais\"], \"gravite\": \"haute\", \"keywords\": [\"electric\", \"wire\", \"circuit\", \"power\", \"connection\"], \"solution\": \"Vérifier le circuit électrique et remplacer les composants défectueux\", \"confidence\": 0.3257550085739543, \"maintenance\": {\"priority\": \"URGENT\", \"estimatedTime\": 45, \"requiredExpertise\": \"Électricien\"}}, \"classification\": [{\"label\": \"hand-held computer, hand-held microcomputer\", \"confidence\": 0.4958842396736145}, {\"label\": \"cash machine, cash dispenser, automated teller machine, automatic teller machine, automated teller, automatic teller, ATM\", \"confidence\": 0.460530161857605}, {\"label\": \"switch, electric switch, electrical switch\", \"confidence\": 0.002025771187618375}, {\"label\": \"joystick\", \"confidence\": 0.001944305724464357}, {\"label\": \"combination lock\", \"confidence\": 0.0019143893150612712}], \"detectedObjects\": [{\"box\": {\"xmax\": 343, \"xmin\": 142, \"ymax\": 403, \"ymin\": 9}, \"label\": \"cell phone\", \"confidence\": 0.9945794343948364}, {\"box\": {\"xmax\": 557, \"xmin\": 300, \"ymax\": 121, \"ymin\": 0}, \"label\": \"person\", \"confidence\": 0.9973527193069458}]}', '2025-01-16 19:23:36'),
(30, 4, NULL, 'panne urgent', '2025-01-16 22:20:40', 'TECHNIQUE', 'En instance', NULL, '/uploads/reclamations/1737062440053-ppj.PNG', 'MOYEN', 48, NULL, 'PEU_SATISFAIT', 'MOYENNE', -1, NULL, NULL, '{\"width\": 439, \"format\": \"png\", \"height\": 656, \"quality\": \"FAIBLE\", \"suggestedIssues\": [\"Fuite au niveau de la pompe\", \"Problème de débit\", \"Affichage digital défectueux\", \"Problème de compteur\", \"Usure des joints\"]}', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{\"raw\": {\"faultAnalysis\": [{\"label\": \"scoreboard\", \"score\": 0.9104426503181458}, {\"label\": \"street sign\", \"score\": 0.03207011893391609}, {\"label\": \"digital clock\", \"score\": 0.015554380603134632}, {\"label\": \"gas pump, gasoline pump, petrol pump, island dispenser\", \"score\": 0.0023693351540714502}, {\"label\": \"book jacket, dust cover, dust jacket, dust wrapper\", \"score\": 0.0014358686748892069}], \"classification\": [{\"label\": \"scoreboard\", \"score\": 0.8895787000656128}, {\"label\": \"gas pump, gasoline pump, petrol pump, island dispenser\", \"score\": 0.038885410875082016}, {\"label\": \"street sign\", \"score\": 0.02524496056139469}, {\"label\": \"digital clock\", \"score\": 0.015492488630115986}, {\"label\": \"menu\", \"score\": 0.0029625671450048685}], \"objectDetection\": [{\"box\": {\"xmax\": 407, \"xmin\": 213, \"ymax\": 403, \"ymin\": 244}, \"label\": \"clock\", \"score\": 0.7040842175483704}]}, \"faultAnalysis\": {\"type\": \"pompe_defectueuse\", \"pieces\": [\"Pompe hydraulique\", \"Joint d\'étanchéité\", \"Roulement\"], \"gravite\": \"haute\", \"keywords\": [\"pump\", \"hydraulic\", \"water\", \"flow\"], \"solution\": \"Remplacer la pompe défectueuse et vérifier le circuit hydraulique\", \"confidence\": 0.23982915440997615, \"maintenance\": {\"priority\": \"URGENT\", \"estimatedTime\": 120, \"requiredExpertise\": \"Technicien hydraulique\"}}, \"classification\": [{\"label\": \"scoreboard\", \"confidence\": 0.8895787000656128}, {\"label\": \"gas pump, gasoline pump, petrol pump, island dispenser\", \"confidence\": 0.038885410875082016}, {\"label\": \"street sign\", \"confidence\": 0.02524496056139469}, {\"label\": \"digital clock\", \"confidence\": 0.015492488630115986}, {\"label\": \"menu\", \"confidence\": 0.0029625671450048685}], \"detectedObjects\": [{\"box\": {\"xmax\": 407, \"xmin\": 213, \"ymax\": 403, \"ymin\": 244}, \"label\": \"clock\", \"confidence\": 0.7040842175483704}]}', '2025-01-16 22:17:52');

-- --------------------------------------------------------

--
-- Structure de la table `Reclamationanalytics`
--

DROP TABLE IF EXISTS `Reclamationanalytics`;
CREATE TABLE IF NOT EXISTS `Reclamationanalytics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idReclamation` bigint(20) DEFAULT NULL,
  `analysis_timestamp` datetime DEFAULT NULL,
  `text_analysis` json DEFAULT NULL,
  `image_analysis` json DEFAULT NULL,
  `sentiment_details` json DEFAULT NULL,
  `predicted_outcomes` json DEFAULT NULL,
  `maintenance_recommendations` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idReclamation` (`idReclamation`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `StationService`
--

DROP TABLE IF EXISTS `StationService`;
CREATE TABLE IF NOT EXISTS `StationService` (
  `idStation` bigint(20) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `adresse` text NOT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `capacite` int(11) DEFAULT NULL,
  PRIMARY KEY (`idStation`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `StationService`
--

INSERT INTO `StationService` (`idStation`, `nom`, `adresse`, `ville`, `telephone`, `email`, `capacite`) VALUES
(1, 'Station Test', '123 Rue Test\"', NULL, NULL, NULL, NULL),
(2, 'station bardo', '124 Rue ', NULL, NULL, NULL, NULL),
(3, 'station ariana', '124 Rue ', 'ariana', '1478526', 'station.test@pfe.tn', 500),
(4, 'station centre ville', '101 Rue ', 'Tunis', '1478526', 'station.test@pfe.tn', 500),
(5, 'station bizerte', '101 Rue ', 'Tunis', '2659375', 'station.test@pfe.tn', 500),
(6, 'station  nabeul', '101 Rue ', 'nabeul', '2659375', 'stationnabeul.test@pfe.tn', 300),
(7, 'station ben arous', '123 Rue Test\"', 'Tunis', '12345678', 'station.test@pfe.tn', 400);

-- --------------------------------------------------------

--
-- Structure de la table `Utilisateur`
--

DROP TABLE IF EXISTS `Utilisateur`;
CREATE TABLE IF NOT EXISTS `Utilisateur` (
  `identifiant` bigint(20) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `mail` varchar(100) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `matricule` bigint(20) NOT NULL,
  `roles` enum('ADMIN','GERANT','COMMERCIAL','DEPOT','ELECTROMECANIQUE','TECHNIQUE') NOT NULL,
  PRIMARY KEY (`identifiant`),
  UNIQUE KEY `mail` (`mail`),
  UNIQUE KEY `matricule` (`matricule`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `Utilisateur`
--

INSERT INTO `Utilisateur` (`identifiant`, `nom`, `prenom`, `telephone`, `mail`, `mot_de_passe`, `matricule`, `roles`) VALUES
(1, 'Admin', 'System', '21612345678', 'admin@pfe.tn', '$2a$10$2EZZzs0Gz9LCva1RU.3fDegZan0cQuLvMGr8zVEdypM6hz8UmcVVu', 9999, 'ADMIN'),
(2, 'neder', 'boughanmi', '26593757', 'commercial@agil.com', '$2a$10$xL5pVQknFxWtfiEVr2R7leBYmZr18HCD11MWRM9PN20OrhgstXwge', 123456, 'COMMERCIAL'),
(3, 'rodrigo', 'rodriguez', '23456781', 'gerant.test@station.com', '$2a$10$/IWjTxgiBry/8VIwuUsFu.2Bv0d.5uBIOCKgoNqRcdCHqb.CtpABC', 654321, 'GERANT'),
(4, 'mouldi', 'aifa', '28456934', 'depot.test@gmail.com', '$2a$10$Or1XUqCJ8cPWlQqeeILsLOgrohixpnwiWK.w/FT5gGuUfx2hkWD/2', 9876554, 'DEPOT'),
(5, 'brian', 'ruiz', '12365478', 'brian.depot@gmail.com', '$2a$10$qf9INIgYJsOKjLdhiArvA.VSQjme8M27UTumUcIsA1AGM9FBrSaUy', 471852, 'DEPOT'),
(6, 'oussema', 'boughan', '25693784', 'boughanmi.commercial@agil.com', '$2a$10$7he4/mlhVcwDso6exKbQx.tUEoxeK5POd1gioUGXvD.l9UeDJulNi', 14455, 'COMMERCIAL'),
(7, 'nidhal', 'boughanmi', '26593757', 'nidhal.boughanmi@gmail.com', '$2a$10$K2lK8692KeqV5LgHIC/YwOWiamSV/vNWpVPZ5Px723hM7BFmEHVU2', 213456, 'GERANT'),
(8, 'nidhal', 'boughanmi', '26593757', 'nidhal.boughanmi22@gmail.com', '$2a$10$uO1Jb5kaQejIkt3136LnXeW6Nu16h1oOF7/3I5eBn7rV2go0aAgTe', 123455, 'GERANT'),
(9, 'oussema', 'boughanmi', '25693757', 'oussema123@gmail.com', '$2a$10$/Fo0oONuwSRHlGz7tixR6.em9UsM/e.JLNB2Idbg2KJTiHVJaeNiG', 213654, 'COMMERCIAL'),
(10, 'oussema', 'boughanmi', '26593775', 'oussema.boughanmni22@gmail.com', '$2a$10$S5qK.FakZso2Q0ncUq6tm.VjjhIBMB1dMLga0mIhMCXxscGa4EdW6', 124563, 'GERANT'),
(11, 'oussema', 'boughanmi', '26593747', 'oussemaboughanmi@agil.com', '$2a$10$LgkAW6rBAsVO5RFtss/V3uEdrkZwziEB0tMMFZno0TF1T1fypVbVK', 124547, 'COMMERCIAL'),
(12, 'boughanmi', 'nidhal', '21345679', 'boughanmi123@gmail.com', '$2a$10$Rrx3Wq1fumdpWAZGJc9VC.8YYddfLFLbqMbx9jTovnlEzSqtjKpjq', 987655, 'GERANT'),
(13, 'boughanmi', 'oussema', '26593757', 'boughanmi.test@gmail.com', '$2a$10$YcUthi4NQzHvXJV5Lai.3u3vM5E7S6DEsacibV2YtyWSseLRwMS/e', 147852, 'DEPOT'),
(14, 'aloui', 'omar', '26593757', 'omar.aloui@gmail.com', '$2a$10$aupiVTuZTBA9oHeLumJZNuNkgDdITRSgskCd5QEGooj/xElABOoHS', 254136, 'GERANT'),
(15, 'neila', 'bouali', '28741367', 'neila.bou@gmail.com', '$2a$10$auBwaM4fBVH2IkVneNb40ui3JdbdhtIfHwFQBLAh1hgKcykesn/n2', 5468271, 'DEPOT'),
(16, 'ameur', 'atef', '26593754', 'amer.atef@gmail.com', '$2a$10$Ggz7f7Nnatb9kWNhDV.8XOEHJmt53NwCd1HQOcNfA4nzaKn9MWY8W', 257413, 'GERANT');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

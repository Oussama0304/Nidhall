SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- Désactiver les contraintes de clés étrangères
SET FOREIGN_KEY_CHECKS = 0;

-- Tables indépendantes d'abord
CREATE TABLE IF NOT EXISTS `Utilisateur` (
  `identifiant` bigint(20) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `telephone` varchar(255) NOT NULL,
  `mail` varchar(255) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `matricule` bigint(20) NOT NULL,
  `roles` varchar(255) NOT NULL,
  PRIMARY KEY (`identifiant`),
  UNIQUE KEY `mail` (`mail`),
  UNIQUE KEY `matricule` (`matricule`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `StationService` (
  `idStation` bigint(20) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `ville` varchar(255) NOT NULL,
  `telephone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `capacite` int(11) NOT NULL,
  PRIMARY KEY (`idStation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Depot` (
  `idDepot` bigint(20) NOT NULL AUTO_INCREMENT,
  `nomDepot` varchar(100) NOT NULL,
  `adresse` text NOT NULL,
  PRIMARY KEY (`idDepot`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  KEY `idStation` (`idStation`),
  CONSTRAINT `gerant_ibfk_1` FOREIGN KEY (`idStation`) REFERENCES `StationService` (`idStation`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Material` (
  `idMaterial` bigint(20) NOT NULL AUTO_INCREMENT,
  `idStation` bigint(20) DEFAULT NULL,
  `Actif` varchar(50) NOT NULL,
  `Description` text,
  `Emplacement` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idMaterial`),
  KEY `idStation` (`idStation`),
  CONSTRAINT `material_ibfk_1` FOREIGN KEY (`idStation`) REFERENCES `StationService` (`idStation`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tables avec dépendances ensuite
CREATE TABLE IF NOT EXISTS `Commande` (
  `idCommande` bigint(20) NOT NULL AUTO_INCREMENT,
  `montant` float NOT NULL,
  `date` datetime NOT NULL,
  `idProduit` bigint(20) DEFAULT NULL,
  `idUtilisateur` bigint(20) DEFAULT NULL,
  `etat` enum('En instance','En cours','Validée') NOT NULL DEFAULT 'En instance',
  `RefCommande` varchar(50) NOT NULL,
  `depot_id` bigint(20) DEFAULT NULL,
  `note` text,
  PRIMARY KEY (`idCommande`),
  UNIQUE KEY `RefCommande` (`RefCommande`),
  KEY `idProduit` (`idProduit`),
  KEY `idUtilisateur` (`idUtilisateur`),
  KEY `depot_id` (`depot_id`),
  CONSTRAINT `commande_ibfk_1` FOREIGN KEY (`idProduit`) REFERENCES `Produit` (`idProduit`) ON DELETE SET NULL,
  CONSTRAINT `commande_ibfk_2` FOREIGN KEY (`idUtilisateur`) REFERENCES `Utilisateur` (`identifiant`) ON DELETE SET NULL,
  CONSTRAINT `commande_ibfk_3` FOREIGN KEY (`depot_id`) REFERENCES `Depot` (`idDepot`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `CommandeProduit` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `idCommande` bigint(20) NOT NULL,
  `idProduit` bigint(20) NOT NULL,
  `quantite` int(11) NOT NULL,
  `prix` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idCommande` (`idCommande`),
  KEY `idProduit` (`idProduit`),
  CONSTRAINT `commandeproduit_ibfk_1` FOREIGN KEY (`idCommande`) REFERENCES `Commande` (`idCommande`) ON DELETE CASCADE,
  CONSTRAINT `commandeproduit_ibfk_2` FOREIGN KEY (`idProduit`) REFERENCES `Produit` (`idProduit`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Livraison` (
  `idLivraison` bigint(20) NOT NULL AUTO_INCREMENT,
  `idCommande` bigint(20) DEFAULT NULL,
  `dateLivraison` datetime NOT NULL,
  `numChauffeur` bigint(20) NOT NULL,
  `quantiteLv` float NOT NULL,
  PRIMARY KEY (`idLivraison`),
  KEY `idCommande` (`idCommande`),
  CONSTRAINT `livraison_ibfk_1` FOREIGN KEY (`idCommande`) REFERENCES `Commande` (`idCommande`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `MouvementStock` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `idProduit` bigint(20) DEFAULT NULL,
  `quantite` int(11) DEFAULT NULL,
  `type_mouvement` enum('ENTREE','RETRAIT','AJUSTEMENT') DEFAULT NULL,
  `date_mouvement` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `idCommande` bigint(20) DEFAULT NULL,
  `raison` text,
  PRIMARY KEY (`id`),
  KEY `idProduit` (`idProduit`),
  KEY `idCommande` (`idCommande`),
  CONSTRAINT `mouvementstock_ibfk_1` FOREIGN KEY (`idProduit`) REFERENCES `Produit` (`idProduit`) ON DELETE SET NULL,
  CONSTRAINT `mouvementstock_ibfk_2` FOREIGN KEY (`idCommande`) REFERENCES `Commande` (`idCommande`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  KEY `idCommercial` (`idCommercial`),
  CONSTRAINT `reclamation_ibfk_1` FOREIGN KEY (`idGerant`) REFERENCES `Utilisateur` (`identifiant`) ON DELETE SET NULL,
  CONSTRAINT `reclamation_ibfk_2` FOREIGN KEY (`idCommercial`) REFERENCES `Utilisateur` (`identifiant`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `ReclamationAnalytics` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `idReclamation` bigint(20) DEFAULT NULL,
  `analysis_timestamp` datetime DEFAULT NULL,
  `text_analysis` json DEFAULT NULL,
  `image_analysis` json DEFAULT NULL,
  `sentiment_details` json DEFAULT NULL,
  `predicted_outcomes` json DEFAULT NULL,
  `maintenance_recommendations` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idReclamation` (`idReclamation`),
  CONSTRAINT `reclamationanalytics_ibfk_1` FOREIGN KEY (`idReclamation`) REFERENCES `Reclamation` (`idReclamation`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `EquipmentSensors` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `equipment_id` bigint(20) DEFAULT NULL,
  `temperature` float DEFAULT NULL,
  `pressure` float DEFAULT NULL,
  `vibration` float DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `equipment_id` (`equipment_id`),
  CONSTRAINT `equipmentsensors_ibfk_1` FOREIGN KEY (`equipment_id`) REFERENCES `Material` (`idMaterial`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `MaintenanceAnalytics` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `equipment_id` bigint(20) DEFAULT NULL,
  `prediction_date` datetime DEFAULT NULL,
  `failure_probability` float DEFAULT NULL,
  `recommended_actions` text,
  `maintenance_priority` varchar(50) DEFAULT NULL,
  `estimated_costs` json DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `equipment_id` (`equipment_id`),
  CONSTRAINT `maintenanceanalytics_ibfk_1` FOREIGN KEY (`equipment_id`) REFERENCES `Material` (`idMaterial`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `PerformanceMetrics` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `metric_date` date DEFAULT NULL,
  `resolution_times` json DEFAULT NULL,
  `satisfaction_rates` json DEFAULT NULL,
  `issue_patterns` json DEFAULT NULL,
  `cost_analysis` json DEFAULT NULL,
  `efficiency_scores` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Réactiver les contraintes de clés étrangères
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

-- Créer et utiliser la base de données
CREATE DATABASE IF NOT EXISTS ProjetPfeAgil;
USE ProjetPfeAgil;

-- Créer les tables avec les noms en majuscules dès le départ
CREATE TABLE IF NOT EXISTS UTILISATEUR (
  identifiant bigint(20) NOT NULL AUTO_INCREMENT,
  nom varchar(100) NOT NULL,
  prenom varchar(100) NOT NULL,
  telephone varchar(20) NOT NULL,
  mail varchar(100) NOT NULL,
  mot_de_passe varchar(255) NOT NULL,
  matricule int(11) NOT NULL,
  roles varchar(50) NOT NULL,
  PRIMARY KEY (identifiant)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS PRODUIT (
  idProduit bigint(20) NOT NULL AUTO_INCREMENT,
  nom varchar(100) NOT NULL,
  disponibilite varchar(50) DEFAULT NULL,
  prix float NOT NULL,
  CODPRD varchar(50) DEFAULT NULL,
  LIBPRD varchar(50) DEFAULT NULL,
  CODEMB varchar(50) DEFAULT NULL,
  LIBEMB varchar(50) DEFAULT NULL,
  TYPPRD varchar(50) DEFAULT NULL,
  quantite int(11) DEFAULT NULL,
  seuil_alerte int(11) DEFAULT NULL,
  PRIMARY KEY (idProduit)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS COMMANDE (
  idCommande bigint(20) NOT NULL AUTO_INCREMENT,
  montant float NOT NULL,
  date datetime NOT NULL,
  idProduit bigint(20) DEFAULT NULL,
  idUtilisateur bigint(20) DEFAULT NULL,
  etat varchar(50) NOT NULL,
  RefCommande varchar(50) DEFAULT NULL,
  depot_id bigint(20) DEFAULT NULL,
  note text,
  PRIMARY KEY (idCommande)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS COMMANDEPRODUIT (
  id int(11) NOT NULL AUTO_INCREMENT,
  idCommande int(11) NOT NULL,
  idProduit int(11) NOT NULL,
  quantite int(11) NOT NULL,
  prix decimal(10,2) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS DEPOT (
  idDepot bigint(20) NOT NULL AUTO_INCREMENT,
  nomDepot varchar(100) NOT NULL,
  adresse text NOT NULL,
  PRIMARY KEY (idDepot)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS EQUIPMENTSSENSORS (
  id int(11) NOT NULL AUTO_INCREMENT,
  equipment_id int(11) DEFAULT NULL,
  temperature float DEFAULT NULL,
  pressure float DEFAULT NULL,
  vibration float DEFAULT NULL,
  timestamp datetime DEFAULT NULL,
  status varchar(50) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS GERANT (
  idGerant bigint(20) NOT NULL,
  nom varchar(100) NOT NULL,
  prenom varchar(100) NOT NULL,
  telephone varchar(20) NOT NULL,
  mail varchar(100) NOT NULL,
  mot_de_passe varchar(255) NOT NULL,
  matricule int(11) NOT NULL,
  roles varchar(50) NOT NULL,
  PRIMARY KEY (idGerant)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS LIVRAISON (
  idLivraison bigint(20) NOT NULL AUTO_INCREMENT,
  idCommande bigint(20) DEFAULT NULL,
  dateLivraison datetime NOT NULL,
  numChauffeur int(11) NOT NULL,
  quantiteLv int(11) NOT NULL,
  PRIMARY KEY (idLivraison)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS MAINTENANCEANALYTICS (
  id int(11) NOT NULL AUTO_INCREMENT,
  equipment_id int(11) DEFAULT NULL,
  prediction_date datetime DEFAULT NULL,
  failure_probability float DEFAULT NULL,
  maintenance_recommendation text,
  last_maintenance datetime DEFAULT NULL,
  next_maintenance datetime DEFAULT NULL,
  maintenance_cost decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS MATERIAL (
  idStation bigint(20) DEFAULT NULL,
  Actif varchar(50) NOT NULL,
  Description text,
  DateAcquisition date DEFAULT NULL,
  Etat varchar(50) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS MOUVEMENTSTOCK (
  id int(11) NOT NULL AUTO_INCREMENT,
  idProduit int(11) DEFAULT NULL,
  quantite int(11) DEFAULT NULL,
  type_mouvement varchar(50) DEFAULT NULL,
  date_mouvement datetime DEFAULT NULL,
  idCommande int(11) DEFAULT NULL,
  raison text,
  PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS PERFORMANCEMETRICS (
  id int(11) NOT NULL AUTO_INCREMENT,
  metric_date date DEFAULT NULL,
  resolution_times json DEFAULT NULL,
  customer_satisfaction json DEFAULT NULL,
  equipment_efficiency json DEFAULT NULL,
  maintenance_costs json DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS RECLAMATION (
  idReclamation bigint(20) NOT NULL AUTO_INCREMENT,
  idGerant bigint(20) DEFAULT NULL,
  idCommercial bigint(20) DEFAULT NULL,
  description text,
  date datetime DEFAULT NULL,
  type varchar(50) DEFAULT NULL,
  etat varchar(50) DEFAULT NULL,
  material varchar(255) DEFAULT NULL,
  image_url varchar(255) DEFAULT NULL,
  priority varchar(50) DEFAULT NULL,
  estimatedResolutionTime int(11) DEFAULT NULL,
  actualResolutionTime int(11) DEFAULT NULL,
  satisfaction varchar(50) DEFAULT NULL,
  gravite varchar(50) DEFAULT NULL,
  sentiment_score float DEFAULT NULL,
  suggestedActions text DEFAULT NULL,
  aiConfidence float DEFAULT NULL,
  image_analysis json DEFAULT NULL,
  reponse text DEFAULT NULL,
  date_reponse datetime DEFAULT NULL,
  categories json DEFAULT NULL,
  keywords json DEFAULT NULL,
  impact_score float DEFAULT NULL,
  related_issues json DEFAULT NULL,
  resolution_history json DEFAULT NULL,
  predicted_resolution_time int(11) DEFAULT NULL,
  maintenance_cost decimal(10,2) DEFAULT NULL,
  analysis_results json DEFAULT NULL,
  last_analyzed datetime DEFAULT NULL,
  PRIMARY KEY (idReclamation)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS RECLAMATIONANALYTICS (
  id int(11) NOT NULL AUTO_INCREMENT,
  idReclamation bigint(20) DEFAULT NULL,
  analysis_timestamp datetime DEFAULT NULL,
  sentiment_analysis json DEFAULT NULL,
  priority_score float DEFAULT NULL,
  category_prediction json DEFAULT NULL,
  resolution_time_prediction int DEFAULT NULL,
  similar_cases json DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS STATIONSERVICE (
  idStation bigint(20) NOT NULL AUTO_INCREMENT,
  nom varchar(100) NOT NULL,
  adresse text NOT NULL,
  ville varchar(100) DEFAULT NULL,
  telephone varchar(20) DEFAULT NULL,
  email varchar(100) DEFAULT NULL,
  capacite int(11) DEFAULT NULL,
  PRIMARY KEY (idStation)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

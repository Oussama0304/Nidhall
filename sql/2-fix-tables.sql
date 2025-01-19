-- Créer la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS ProjetPfeAgil;
USE ProjetPfeAgil;

-- Importer le schéma de la base de données
SOURCE /docker-entrypoint-initdb.d/1-schema.sql;

-- Fonction pour gérer le renommage des tables
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS RenameTableIfExists(
    IN old_name VARCHAR(50),
    IN new_name VARCHAR(50)
)
BEGIN
    SET @table_exists = (
        SELECT COUNT(*)
        FROM information_schema.tables
        WHERE table_schema = 'ProjetPfeAgil'
        AND table_name = old_name
    );

    IF @table_exists > 0 THEN
        SET @sql = CONCAT('RENAME TABLE ', old_name, ' TO ', new_name, ';');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END //

DELIMITER ;

-- Vérifier si les tables existent déjà dans leur format majuscule
SET @table_exists = (
    SELECT COUNT(*)
    FROM information_schema.tables 
    WHERE table_schema = 'ProjetPfeAgil' 
    AND table_name IN ('Utilisateur', 'Produit', 'Commande')
);

-- Si les tables en majuscules n'existent pas, on procède au renommage
IF @table_exists = 0 THEN
    -- Renommer les tables si elles existent en minuscules
    SET @sql = '';
    
    -- Vérifier et renommer chaque table
    SELECT IF(
        EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'ProjetPfeAgil' AND table_name = 'utilisateur'),
        'RENAME TABLE utilisateur TO Utilisateur;',
        ''
    ) INTO @sql;
    IF @sql != '' THEN
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;

    SELECT IF(
        EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'ProjetPfeAgil' AND table_name = 'produit'),
        'RENAME TABLE produit TO Produit;',
        ''
    ) INTO @sql;
    IF @sql != '' THEN
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;

    SELECT IF(
        EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'ProjetPfeAgil' AND table_name = 'commande'),
        'RENAME TABLE commande TO Commande;',
        ''
    ) INTO @sql;
    IF @sql != '' THEN
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;

    SELECT IF(
        EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'ProjetPfeAgil' AND table_name = 'commandeproduit'),
        'RENAME TABLE commandeproduit TO CommandeProduit;',
        ''
    ) INTO @sql;
    IF @sql != '' THEN
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;

    SELECT IF(
        EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'ProjetPfeAgil' AND table_name = 'depot'),
        'RENAME TABLE depot TO Depot;',
        ''
    ) INTO @sql;
    IF @sql != '' THEN
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;

    SELECT IF(
        EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'ProjetPfeAgil' AND table_name = 'equipmentsensors'),
        'RENAME TABLE equipmentsensors TO EquipmentSensors;',
        ''
    ) INTO @sql;
    IF @sql != '' THEN
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;

    SELECT IF(
        EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'ProjetPfeAgil' AND table_name = 'gerant'),
        'RENAME TABLE gerant TO Gerant;',
        ''
    ) INTO @sql;
    IF @sql != '' THEN
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;

    SELECT IF(
        EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'ProjetPfeAgil' AND table_name = 'livraison'),
        'RENAME TABLE livraison TO Livraison;',
        ''
    ) INTO @sql;
    IF @sql != '' THEN
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;

    SELECT IF(
        EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'ProjetPfeAgil' AND table_name = 'maintenanceanalytics'),
        'RENAME TABLE maintenanceanalytics TO MaintenanceAnalytics;',
        ''
    ) INTO @sql;
    IF @sql != '' THEN
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;

    SELECT IF(
        EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'ProjetPfeAgil' AND table_name = 'material'),
        'RENAME TABLE material TO Material;',
        ''
    ) INTO @sql;
    IF @sql != '' THEN
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;

    SELECT IF(
        EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'ProjetPfeAgil' AND table_name = 'mouvementstock'),
        'RENAME TABLE mouvementstock TO MouvementStock;',
        ''
    ) INTO @sql;
    IF @sql != '' THEN
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;

    SELECT IF(
        EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'ProjetPfeAgil' AND table_name = 'performancemetrics'),
        'RENAME TABLE performancemetrics TO PerformanceMetrics;',
        ''
    ) INTO @sql;
    IF @sql != '' THEN
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;

    SELECT IF(
        EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'ProjetPfeAgil' AND table_name = 'reclamation'),
        'RENAME TABLE reclamation TO Reclamation;',
        ''
    ) INTO @sql;
    IF @sql != '' THEN
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;

    SELECT IF(
        EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'ProjetPfeAgil' AND table_name = 'reclamationanalytics'),
        'RENAME TABLE reclamationanalytics TO ReclamationAnalytics;',
        ''
    ) INTO @sql;
    IF @sql != '' THEN
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;

    SELECT IF(
        EXISTS(SELECT 1 FROM information_schema.tables WHERE table_schema = 'ProjetPfeAgil' AND table_name = 'stationservice'),
        'RENAME TABLE stationservice TO StationService;',
        ''
    ) INTO @sql;
    IF @sql != '' THEN
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END IF;

-- Nettoyer
DROP PROCEDURE IF EXISTS RenameTableIfExists;

USE ProjetPfeAgil;

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

-- Renommer les tables si elles existent
CALL RenameTableIfExists('utilisateur', 'Utilisateur');
CALL RenameTableIfExists('produit', 'Produit');
CALL RenameTableIfExists('commande', 'Commande');
CALL RenameTableIfExists('commandeproduit', 'CommandeProduit');
CALL RenameTableIfExists('depot', 'Depot');
CALL RenameTableIfExists('equipmentsensors', 'EquipmentSensors');
CALL RenameTableIfExists('gerant', 'Gerant');
CALL RenameTableIfExists('livraison', 'Livraison');
CALL RenameTableIfExists('maintenanceanalytics', 'MaintenanceAnalytics');
CALL RenameTableIfExists('material', 'Material');
CALL RenameTableIfExists('mouvementstock', 'MouvementStock');
CALL RenameTableIfExists('performancemetrics', 'PerformanceMetrics');
CALL RenameTableIfExists('reclamation', 'Reclamation');
CALL RenameTableIfExists('reclamationanalytics', 'ReclamationAnalytics');
CALL RenameTableIfExists('stationservice', 'StationService');

-- Nettoyer
DROP PROCEDURE IF EXISTS RenameTableIfExists;

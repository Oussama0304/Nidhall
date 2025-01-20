const pool = require('../config/db');

// Fonction pour trouver des cas similaires
const findSimilarCases = async (description) => {
    try {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                'SELECT r.*, u.nom as nom_commercial, u.prenom as prenom_commercial ' +
                'FROM Reclamation r ' +
                'LEFT JOIN Utilisateur u ON r.idCommercial = u.identifiant ' +
                'WHERE r.etat = \'Validée\' ' +
                'AND r.description LIKE ? ' +
                'ORDER BY r.date DESC ' +
                'LIMIT 5',
                [`%${description.split(' ').join('%')}%`]
            );
            return rows;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error in findSimilarCases:', error);
        throw error;
    }
};

// Fonction pour recommander un commercial
const recommendCommercial = async (reclamationType) => {
    try {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                'SELECT ' +
                'u.identifiant, ' +
                'u.nom, ' +
                'u.prenom, ' +
                'COUNT(r.idReclamation) as total_reclamations, ' +
                'SUM(CASE WHEN r.etat = \'Validée\' THEN 1 ELSE 0 END) as reclamations_resolues, ' +
                'COUNT(CASE WHEN r.etat = \'Validée\' THEN 1 END) / COUNT(r.idReclamation) * 100 as taux_resolution ' +
                'FROM Utilisateur u ' +
                'LEFT JOIN Reclamation r ON u.identifiant = r.idCommercial ' +
                'WHERE u.roles = \'COMMERCIAL\' ' +
                'AND r.type = ? ' +
                'GROUP BY u.identifiant ' +
                'ORDER BY taux_resolution DESC, total_reclamations DESC ' +
                'LIMIT 1',
                [reclamationType]
            );
            return rows[0] || null;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error in recommendCommercial:', error);
        throw error;
    }
};

// Fonction pour suggérer des actions préventives
const suggestPreventiveActions = async (reclamationType) => {
    try {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(
                'SELECT ' +
                'type, ' +
                'COUNT(*) as occurrence_count, ' +
                'GROUP_CONCAT(description SEPARATOR \' | \') as descriptions ' +
                'FROM Reclamation ' +
                'WHERE type = ? ' +
                'GROUP BY type ' +
                'ORDER BY occurrence_count DESC',
                [reclamationType]
            );
            const suggestions = [];
            if (rows[0]) {
                if (reclamationType === 'TECHNIQUE') {
                    suggestions.push('Planifier une maintenance préventive régulière');
                    suggestions.push('Former le personnel sur les procédures de maintenance');
                    suggestions.push('Mettre en place un système de surveillance des équipements');
                } else if (reclamationType === 'COMMERCIALE') {
                    suggestions.push('Revoir les processus de service client');
                    suggestions.push('Organiser des formations sur la relation client');
                    suggestions.push('Mettre en place un suivi régulier de la satisfaction client');
                }
            }
            return suggestions;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error in suggestPreventiveActions:', error);
        throw error;
    }
};

module.exports = {
    findSimilarCases,
    recommendCommercial,
    suggestPreventiveActions
};

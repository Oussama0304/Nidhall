const jwt = require('jsonwebtoken');
const db = require('../config/db');

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: "Token manquant" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'votre_secret_jwt');
        console.log('Token décodé:', decodedToken);
        
        // Récupérer les informations de l'utilisateur
        const [rows] = await db.execute(
            'SELECT identifiant, nom, prenom, telephone, mail, matricule, roles FROM Utilisateur WHERE identifiant = ?',
            [decodedToken.identifiant || decodedToken.id] // Accepte les deux formats
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        req.user = rows[0];
        console.log('Utilisateur authentifié:', req.user);
        next();
    } catch (error) {
        console.error('Erreur d\'authentification:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token expiré" });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Token invalide" });
        }
        return res.status(401).json({ error: "Erreur d'authentification" });
    }
};

module.exports = auth;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;

        if (!email || !mot_de_passe) {
            return res.status(400).json({ error: "Email et mot de passe requis" });
        }

        // Vérifier si l'utilisateur existe
        const [rows] = await db.execute('SELECT * FROM Utilisateur WHERE mail = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }

        const user = rows[0];

        // Vérifier que le mot de passe existe
        if (!user || !user.mot_de_passe) {
            console.error('Erreur: utilisateur ou mot de passe manquant:', email);
            return res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }

        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        
        if (!validPassword) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }

        // Créer et signer le token JWT
        const token = jwt.sign(
            { 
                id: user.identifiant,
                role: user.roles
            },
            process.env.JWT_SECRET || 'votre_secret_jwt',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.identifiant,
                email: user.mail,
                role: user.roles,
                nom: user.nom,
                prenom: user.prenom,
                telephone: user.telephone,
                matricule: user.matricule
            }
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        console.error('Détails de l\'erreur:', error.message);
        if (error.sql) {
            console.error('Requête SQL:', error.sql);
        }
        res.status(500).json({ error: "Erreur lors de la connexion" });
    }
});

// Middleware de vérification du token
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: "Token manquant" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'votre_secret_jwt');
        
        // Récupérer les informations de l'utilisateur
        const [rows] = await db.execute(
            'SELECT identifiant, nom, prenom, telephone, mail, matricule, roles FROM Utilisateur WHERE identifiant = ?',
            [decodedToken.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        req.user = rows[0];
        next();
    } catch (error) {
        console.error('Erreur de vérification du token:', error);
        res.status(401).json({ error: "Token invalide" });
    }
};

// Route protégée pour vérifier le token
router.get('/verify', verifyToken, (req, res) => {
    res.json({ user: req.user });
});

// Registration route
router.post('/register', async (req, res) => {
    try {
        const { nom, prenom, telephone, email, mot_de_passe, matricule, roles } = req.body;
        
        // Validate required fields
        if (!nom || !prenom || !telephone || !email || !mot_de_passe || !matricule || !roles) {
            return res.status(400).json({ error: "Tous les champs sont requis" });
        }

        // Check if user already exists
        const checkQuery = 'SELECT * FROM Utilisateur WHERE mail = ?';
        const [results] = await db.execute(checkQuery, [email]);

        if (results.length > 0) {
            return res.status(400).json({ error: "Cet email est déjà utilisé" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(mot_de_passe, salt);

        // Insert new user
        const insertQuery = `
            INSERT INTO Utilisateur (nom, prenom, telephone, mail, mot_de_passe, matricule, roles)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        await db.execute(
            insertQuery,
            [nom, prenom, telephone, email, hashedPassword, matricule, roles]
        );

        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Test route to check users
router.get('/test-users', async (req, res) => {
    try {
        const query = 'SELECT identifiant, nom, prenom, mail, roles FROM Utilisateur';
        const [results] = await db.execute(query);
        
        res.json(results);
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: "Erreur de serveur" });
    }
});

// Route temporaire pour voir les utilisateurs
router.get('/check-users', async (req, res) => {
    try {
        const query = 'SELECT identifiant, nom, prenom, mail, roles FROM Utilisateur';
        const [results] = await db.execute(query);
        
        res.json(results);
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: "Erreur serveur" });
    }
});

// Route temporaire pour voir les utilisateurs
router.get('/check-users', async (req, res) => {
    try {
        const query = 'SELECT identifiant, nom, prenom, mail, roles FROM Utilisateur';
        const [results] = await db.execute(query);
        
        res.json(results);
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: "Erreur serveur" });
    }
});

// Test route to verify password hashing
router.get('/test-hash', async (req, res) => {
    try {
        const password = 'commercial123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Test the original stored hash
        const storedHash = '$2a$10$AfqJUAuuTCvRAiPCRiUj0e1lT.Qcr1RpdSIzHOGcehzKYEvtmSfgO';
        const isMatch = await bcrypt.compare(password, storedHash);
        
        res.json({
            newHash: hashedPassword,
            storedHash: storedHash,
            doTheyMatch: isMatch,
            passwordUsed: password
        });
    } catch (err) {
        console.error('Erreur lors de la vérification du hash:', err);
        res.status(500).json({ error: "Erreur lors de la vérification du hash" });
    }
});

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        console.error('Profile error:', error);
        res.status(401).json({ error: 'Token invalide' });
    }
});

module.exports = { router, verifyToken };

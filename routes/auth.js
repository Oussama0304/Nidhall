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
        const [users] = await db.execute('SELECT * FROM Utilisateur WHERE mail = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }

        const user = users[0];

        // Vérifier que le mot de passe existe dans la base
        if (!user.mot_de_passe) {
            console.error('Erreur: mot de passe manquant dans la base pour l\'utilisateur:', user.identifiant);
            return res.status(500).json({ error: "Erreur de configuration du compte" });
        }

        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        if (!validPassword) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }

        // Générer le token JWT
        const token = jwt.sign(
            { 
                userId: user.identifiant,
                role: user.roles
            },
            process.env.JWT_SECRET || 'votre_clé_secrète',
            { expiresIn: '24h' }
        );

        // Envoyer la réponse
        res.json({
            token,
            user: {
                id: user.identifiant,
                nom: user.nom,
                prenom: user.prenom,
                email: user.mail,
                role: user.roles
            }
        });

    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ error: "Erreur lors de la connexion" });
    }
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
router.get('/profile', async (req, res) => {
    try {
        // Extraire le token du header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, 'your_jwt_secret');
        
        // Récupérer les informations de l'utilisateur
        const query = 'SELECT identifiant, nom, prenom, telephone, mail, matricule, roles FROM Utilisateur WHERE identifiant = ?';
        const [results] = await db.execute(query, [decodedToken.userId]);
        
        if (results.length === 0) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }
        
        res.json(results[0]);
    } catch (error) {
        console.error('Profile error:', error);
        res.status(401).json({ error: 'Token invalide' });
    }
});

module.exports = router;

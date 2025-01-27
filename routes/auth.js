const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const auth = require('../middleware/auth');

// Middleware de vérification du token
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: "Token manquant" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'votre_secret_jwt');
        
        // Récupérer les informations de l'utilisateur
        const [users] = await db.execute(
            'SELECT identifiant, nom, prenom, telephone, mail, matricule, roles FROM Utilisateur WHERE identifiant = ?',
            [decodedToken.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        req.user = users[0];
        next();
    } catch (error) {
        console.error('Erreur de vérification du token:', error);
        res.status(401).json({ error: "Token invalide" });
    }
};

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;

        // Validation des données
        if (!email || !mot_de_passe) {
            return res.status(400).json({ 
                error: "Email et mot de passe sont requis",
                details: [
                    !email && "L'email est requis",
                    !mot_de_passe && "Le mot de passe est requis"
                ].filter(Boolean)
            });
        }

        // Récupérer l'utilisateur par email
        const [users] = await db.execute(
            'SELECT * FROM Utilisateur WHERE mail = ?',
            [email]
        );

        if (!users || users.length === 0) {
            console.log('Tentative de connexion avec email non trouvé:', email);
            return res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }

        const user = users[0];

        // Vérifier que le mot de passe existe dans la base de données
        if (!user.mot_de_passe) {
            console.error('Utilisateur trouvé mais pas de mot de passe en base:', email);
            return res.status(500).json({ 
                error: "Erreur de configuration du compte",
                details: "Veuillez contacter l'administrateur"
            });
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
                roles: user.roles 
            },
            process.env.JWT_SECRET || 'votre_secret_jwt',
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
        res.status(500).json({ 
            error: "Erreur lors de la connexion",
            details: error.message
        });
    }
});

// Get current user profile
router.get('/profile', auth, async (req, res) => {
    try {
        // req.user is already set by auth middleware
        res.json({
            id: req.user.id,
            nom: req.user.nom,
            prenom: req.user.prenom,
            email: req.user.mail,
            role: req.user.roles
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        res.status(500).json({ error: "Erreur lors de la récupération du profil" });
    }
});

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
        const [users] = await db.execute(checkQuery, [email]);

        if (users.length > 0) {
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
        const [users] = await db.execute(query);
        
        res.json(users);
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: "Erreur de serveur" });
    }
});

// Route temporaire pour voir les utilisateurs
router.get('/check-users', async (req, res) => {
    try {
        const query = 'SELECT identifiant, nom, prenom, mail, roles FROM Utilisateur';
        const [users] = await db.execute(query);
        
        res.json(users);
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

module.exports = router;

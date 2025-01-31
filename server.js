require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const auth = require('./middleware/auth');
const http = require('http');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? '*' : 'http://localhost:3001',
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(helmet());

// Configuration CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? '*' : 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Compression pour optimiser les performances
app.use(compression());

// Rate limiting pour prévenir les attaques par force brute
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limite chaque IP à 100 requêtes par fenêtre
});
app.use(limiter);

// Limite de taille pour les requêtes JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, path) => {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET');
        if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
            res.set('Content-Type', 'image/jpeg');
        } else if (path.endsWith('.png')) {
            res.set('Content-Type', 'image/png');
        }
    }
}));

// Health check endpoint
app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Health check endpoint
app.get('/health', async (req, res) => {
    console.log('Health check appelé');
    try {
        // Vérifier la connexion à la base de données
        const [result] = await db.promise().query('SELECT 1');
        console.log('Health check DB result:', result);
        res.status(200).json({ 
            status: 'OK',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(503).json({ 
            status: 'ERROR',
            database: 'disconnected',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Import routes
const authRoutes = require('./routes/auth');
const commandeRoutes = require('./routes/commandes');
const reclamationRoutes = require('./routes/reclamations');
const userRoutes = require('./routes/users');
const stationRoutes = require('./routes/stations');
const productRoutes = require('./routes/products');
const dashboardRoutes = require('./routes/admin/dashboard');
const exportRoutes = require('./routes/exportRoutes');  
const recommendationRoutes = require('./routes/recommendations');
const analysisRoutes = require('./routes/analysis');
const imageAnalysisRoutes = require('./routes/imageAnalysis');
const dashboardRoutesNew = require('./routes/dashboard');
const materialRoutes = require('./routes/material');


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/commandes', auth, commandeRoutes);
app.use('/api/reclamations', auth, reclamationRoutes);
app.use('/api/users', auth, userRoutes);
app.use('/api/stations', auth, stationRoutes);
app.use('/api/products', auth, productRoutes);
app.use('/api/admin/dashboard', auth, dashboardRoutes);
app.use('/api', auth, exportRoutes);  
app.use('/api/recommendations', auth, recommendationRoutes);
app.use('/api/analysis', auth, analysisRoutes);
app.use('/api/analysis/image', imageAnalysisRoutes);
app.use('/dashboard', dashboardRoutesNew);
app.use('/material', materialRoutes);

// Log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});

// Configuration de production
if (process.env.NODE_ENV === 'production') {
    // Désactiver les logs détaillés
    app.use((req, res, next) => {
        if (req.method === 'OPTIONS') {
            res.sendStatus(200);
        } else {
            next();
        }
    });

    // Gestion des erreurs en production
    app.use((err, req, res, next) => {
        console.error('Error:', err);
        res.status(500).json({ 
            message: 'Une erreur est survenue',
            error: process.env.NODE_ENV === 'production' ? {} : err
        });
    });
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Un client est connecté');

  socket.on('disconnect', () => {
    console.log('Un client est déconnecté');
  });
});

// Configuration de la base de données
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'database',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'ProjectPfeAgil',
    database: process.env.DB_NAME || 'ProjetPfeAgil',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    connectTimeout: 60000, // 60 secondes
    acquireTimeout: 60000,
    timeout: 60000,
    debug: process.env.NODE_ENV !== 'production'
});

// Promisify pour utilisation avec async/await
const promisePool = pool.promise();

// Test initial de la connexion avec retry
async function testDatabaseConnection(retries = 5, delay = 5000) {
    for (let i = 0; i < retries; i++) {
        try {
            const connection = await promisePool.getConnection();
            console.log('Successfully connected to the database');
            connection.release();
            return true;
        } catch (err) {
            console.error(`Attempt ${i + 1}/${retries} - Error connecting to the database:`, err);
            if (i < retries - 1) {
                console.log(`Retrying in ${delay/1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    return false;
}

// Initialiser les données après la connexion
const initializeAllData = require('./init/init');

// Attendre que la base de données soit prête avant d'initialiser les données
setTimeout(async () => {
    try {
        console.log('Tentative de connexion à la base de données...');
        const isConnected = await testDatabaseConnection();
        if (isConnected) {
            console.log('Démarrage de l\'initialisation des données...');
            try {
                await initializeAllData();
                console.log('✅ Initialisation des données terminée avec succès');
            } catch (initError) {
                console.error('❌ Erreur lors de l\'initialisation des données:', initError);
                // Ne pas arrêter le serveur, continuer avec les données existantes
            }
        } else {
            console.error('❌ Impossible d\'initialiser les données : échec de la connexion à la base de données après plusieurs tentatives');
        }
    } catch (error) {
        console.error('❌ Erreur lors de la vérification de la connexion:', error);
    }
}, process.env.NODE_ENV === 'production' ? 10000 : 5000); // Attendre plus longtemps en production

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ error: err.message || 'Une erreur est survenue' });
});

// Export pour utilisation dans d'autres fichiers
app.set('io', io);

// Gestion des erreurs 404
app.use((req, res, next) => {
    res.status(404).json({ error: "Route non trouvée" });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' 
            ? "Une erreur est survenue" 
            : err.message
    });
});

// Gestion des événements Socket.IO
io.on('connection', (socket) => {
    console.log('Nouveau client connecté');

    socket.on('disconnect', () => {
        console.log('Client déconnecté');
    });
});

// Gestion de la fermeture propre
async function shutdown() {
    console.log('Arrêt du serveur...');
    try {
        // Fermer le pool de connexions
        await promisePool.end();
        console.log('Connexions à la base de données fermées');
        
        // Fermer le serveur HTTP
        server.close(() => {
            console.log('Serveur HTTP fermé');
            process.exit(0);
        });
    } catch (err) {
        console.error('Erreur lors de la fermeture:', err);
        process.exit(1);
    }
}

// Gestion des signaux d'arrêt
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Gestion des erreurs non capturées
process.on('uncaughtException', (err) => {
    console.error('Erreur non capturée:', err);
    shutdown();
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Promesse rejetée non gérée:', reason);
    shutdown();
});

module.exports = app;

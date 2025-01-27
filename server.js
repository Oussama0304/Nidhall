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
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());

// Configuration CORS
app.use(cors({
    origin: '*',  // Permet toutes les origines en développement
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

// Fonction pour créer une connexion à la base de données
function createConnection() {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    // Gérer la reconnexion
    connection.on('error', function(err) {
        console.error('Erreur de base de données:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Tentative de reconnexion à la base de données...');
            handleDisconnect();
        } else {
            throw err;
        }
    });

    connection.connect(function(err) {
        if (err) {
            console.error('Erreur lors de la connexion à la base de données:', err);
            setTimeout(handleDisconnect, 2000);
        } else {
            console.log('Connecté à la base de données MySQL');
        }
    });

    return connection;
}

// Fonction pour gérer la déconnexion
function handleDisconnect() {
    console.log('Tentative de reconnexion à la base de données...');
    db = createConnection();
}

// Créer la connexion initiale
let db = createConnection();

db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        return;
    }
    console.log('Connecté à la base de données MySQL');
});

// Initialiser les données après la connexion
const initializeData = require('./init/initData');
const initializeGerantData = require('./init/initGerantData');
const initializeUtilisateurData = require('./init/initUtilisateurData');
const initializeDepotData = require('./init/initDepotData');
const initializeProduitData = require('./init/initProduitData');
const initializeMaterialData = require('./init/initMaterialData');
const initializeCommandeData = require('./init/initCommandeData');
const initializeLivraisonData = require('./init/initLivraisonData');
const initializeCommandeProduitData = require('./init/initCommandeProduitData');
const initializeMouvementStockData = require('./init/initMouvementStockData');

setTimeout(() => {
    // Initialiser les tables de base d'abord
    initializeUtilisateurData();
    initializeDepotData();
    initializeProduitData();
    
    // Puis les tables avec des clés étrangères
    setTimeout(() => {
        initializeGerantData();
        initializeMaterialData();
        
        // Puis les tables liées aux commandes
        setTimeout(() => {
            initializeCommandeData();
            
            // Enfin les tables dépendantes des commandes
            setTimeout(() => {
                initializeLivraisonData();
                initializeCommandeProduitData();
                initializeMouvementStockData();
                
                // Et les réclamations en dernier
                setTimeout(() => {
                    initializeData();
                }, 1000);
            }, 1000);
        }, 1000);
    }, 1000);
}, 5000); // Attendre 5 secondes pour s'assurer que la base de données est prête

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
const shutdown = async () => {
    console.log('Arrêt du serveur...');
    
    // Fermer le serveur HTTP
    server.close(() => {
        console.log('Serveur HTTP arrêté');
    });

    // Fermer Socket.IO
    io.close(() => {
        console.log('Socket.IO arrêté');
    });

    try {
        // Fermer la connexion à la base de données
        await db.end();
        console.log('Connexion à la base de données fermée');
    } catch (err) {
        console.error('Erreur lors de la fermeture de la base de données:', err);
    }

    // Sortir proprement
    process.exit(0);
};

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

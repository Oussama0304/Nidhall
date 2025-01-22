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

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ error: err.message || 'Une erreur est survenue' });
});

// Export pour utilisation dans d'autres fichiers
app.set('io', io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

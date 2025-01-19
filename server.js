require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const auth = require('./middleware/auth');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
        database: process.env.DB_NAME
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

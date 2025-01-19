require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const auth = require('./middleware/auth');
const http = require('http');
const path = require('path');
const db = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:8098",
    methods: ["GET", "POST"]
  }
});

// Health Check Endpoint
app.get('/health', (req, res) => {
  try {
    // Vérifier la connexion à la base de données
    db.query('SELECT 1', (err) => {
      if (err) {
        console.error('Database connection error:', err);
        res.status(500).send('Database connection error');
      } else {
        res.status(200).send('OK');
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).send('Health check failed');
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:8098",
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
app.use('/api/image-analysis', auth, imageAnalysisRoutes);

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

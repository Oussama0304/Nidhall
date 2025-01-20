require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const auth = require('./middleware/auth');
const http = require('http');
const path = require('path');
const pool = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.REACT_APP_API_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Health check endpoint (before any DB operations)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
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

// Root route
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'PFE Job API is running',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            commandes: '/api/commandes',
            reclamations: '/api/reclamations',
            users: '/api/users',
            stations: '/api/stations',
            products: '/api/products'
        }
    });
});

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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ error: err.message || 'Une erreur est survenue' });
});

// Export pour utilisation dans d'autres fichiers
app.set('io', io);

// Function to attempt database connection
const connectToDatabase = async (retries = 5) => {
  while (retries > 0) {
    try {
      const connection = await pool.getConnection();
      console.log('Successfully connected to the database.');
      connection.release();
      return true;
    } catch (err) {
      console.log(`Failed to connect to database. Retries left: ${retries - 1}`);
      retries--;
      if (retries === 0) {
        console.error('Could not connect to database after multiple attempts:', err);
        return false;
      }
      // Wait for 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  return false;
};

// Start server only after attempting database connection
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const dbConnected = await connectToDatabase();
  if (dbConnected) {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } else {
    console.error('Could not start server due to database connection issues');
    process.exit(1);
  }
};

startServer();

module.exports = app;

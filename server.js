require('dotenv').config();
const express = require('express');
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
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Health check endpoint (before any DB operations)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
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

// Function to attempt database connection with exponential backoff
const connectToDatabase = async (maxRetries = 10) => {
  let retries = 0;
  const maxDelay = 30000; // Maximum delay of 30 seconds

  while (retries < maxRetries) {
    try {
      console.log(`Attempting database connection (attempt ${retries + 1}/${maxRetries})...`);
      const connection = await pool.getConnection();
      console.log('Successfully connected to the database.');
      
      // Test the connection with a simple query
      await connection.query('SELECT 1');
      console.log('Database connection verified with test query.');
      
      connection.release();
      return true;
    } catch (err) {
      retries++;
      console.error(`Database connection attempt ${retries} failed:`, err.message);
      
      if (retries === maxRetries) {
        console.error('Max retries reached. Could not connect to database.');
        return false;
      }

      // Calculate delay with exponential backoff (1s, 2s, 4s, 8s, etc.)
      const delay = Math.min(1000 * Math.pow(2, retries - 1), maxDelay);
      console.log(`Waiting ${delay/1000} seconds before next attempt...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return false;
};

// Start server with proper error handling
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('Starting server initialization...');
    const dbConnected = await connectToDatabase();
    
    if (!dbConnected) {
      console.error('Failed to connect to database after all retries. Exiting...');
      process.exit(1);
    }

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Database host: ${process.env.DB_HOST}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error('Server error:', error);
      process.exit(1);
    });

  } catch (error) {
    console.error('Fatal error during server startup:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();

module.exports = app;

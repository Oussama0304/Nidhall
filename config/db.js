const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'projetpfeagil',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 60000, // Increased timeout
  acquireTimeout: 60000,
});

// Test the connection and create table if it doesn't exist
const initializeDatabase = async () => {
  let retries = 10;
  const retryInterval = 5000; // 5 seconds

  while (retries > 0) {
    try {
      const connection = await pool.getConnection();
      console.log('Successfully connected to database');

      // Check if Commande table exists
      const [tables] = await connection.query('SHOW TABLES LIKE "Commande"');
      if (tables.length === 0) {
        console.log('Creating Commande table...');
        await connection.query(`
          CREATE TABLE IF NOT EXISTS Commande (
            id INT PRIMARY KEY AUTO_INCREMENT,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            status VARCHAR(50) DEFAULT 'pending',
            idUtilisateur INT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        console.log('Commande table created successfully');
      }

      connection.release();
      return true;
    } catch (error) {
      console.error(`Database connection attempt failed (${retries} retries left):`, error.message);
      retries--;
      if (retries === 0) {
        console.error('Max retries reached. Could not connect to database.');
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, retryInterval));
    }
  }
};

// Initialize the database when this module is imported
initializeDatabase().catch(error => {
  console.error('Failed to initialize database:', error);
  process.exit(1); // Exit if database initialization fails
});

module.exports = pool;

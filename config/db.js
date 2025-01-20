const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'projetpfeagil',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database');
    connection.release();
    return true;
  } catch (error) {
    console.error('Error connecting to database:', error);
    return false;
  }
};

// Initialize database connection
testConnection();

module.exports = pool;

require('dotenv').config();
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'projetpfeagil',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test the connection and create table if it doesn't exist
const initializeDatabase = async () => {
  try {
    const connection = await db.getConnection();
    console.log('Database connection established');

    // Check if Commande table exists and has idUtilisateur column
    const [tables] = await connection.query('SHOW TABLES LIKE "Commande"');
    if (tables.length === 0) {
      console.log('Creating Commande table...');
      await connection.query(`
        CREATE TABLE Commande (
          id INT PRIMARY KEY AUTO_INCREMENT,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          status VARCHAR(50) DEFAULT 'pending',
          idUtilisateur INT,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Commande table created successfully');
    } else {
      // Check if idUtilisateur column exists
      const [columns] = await connection.query('SHOW COLUMNS FROM Commande LIKE "idUtilisateur"');
      if (columns.length === 0) {
        console.log('Adding idUtilisateur column to Commande table...');
        await connection.query('ALTER TABLE Commande ADD COLUMN idUtilisateur INT');
        console.log('Column added successfully');
      }
    }

    connection.release();
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
};

// Initialize the database when this module is imported
initializeDatabase().catch(console.error);

module.exports = db;

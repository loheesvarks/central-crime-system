const mysql = require('mysql2');
const config = require('./config');

const db = mysql.createConnection({
  host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  port: config.DB_PORT
});

db.connect(err => {
  if (err) {
    console.error('❌ MySQL Connection Error:', err);
    console.log('⚠️  App will continue without database connection');
    console.log('📝 Make sure to add MySQL service in Railway dashboard');
    
    // Don't crash the app, just log the error
    // The health check routes will still work
  } else {
    console.log('✅ MySQL Connected!');
    createTables();
  }
});

function createTables() {
  // Create tables
  db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'officer') DEFAULT 'officer',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating users table:', err);
  });

  db.query(`
    CREATE TABLE IF NOT EXISTS records (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      crime VARCHAR(100),
      born_date DATE,
      crime_date DATE,
      age INT,
      photo_url VARCHAR(255),
      sentence_years INT,
      sentence_details TEXT,
      case_status ENUM('pending', 'convicted', 'acquitted') DEFAULT 'pending',
      state VARCHAR(50),
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating records table:', err);
  });

  db.query(`
    CREATE TABLE IF NOT EXISTS evidences (
      id INT AUTO_INCREMENT PRIMARY KEY,
      record_id INT,
      evidence_type VARCHAR(50),
      description TEXT,
      file_url VARCHAR(255),
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (record_id) REFERENCES records(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) console.error('Error creating evidences table:', err);
  });
}

module.exports = db;

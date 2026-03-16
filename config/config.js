// Configuration file
module.exports = {
  // Get your free API key from https://newsapi.org
  NEWS_API_KEY: process.env.NEWS_API_KEY || '0ca31eee7bf642c0a3a28550c4181902',
  
  // Database configuration - Railway MySQL
  DB_HOST: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
  DB_USER: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || 'Priya@07',
  DB_NAME: process.env.MYSQLDATABASE || process.env.DB_NAME || 'crime_db',
  DB_PORT: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  
  // Server configuration
  PORT: process.env.PORT || 3000,
  
  // JWT Secret
  JWT_SECRET: process.env.JWT_SECRET || 'jpmc_crime_system_2026_secure_key',
  
  // File upload limits
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
};

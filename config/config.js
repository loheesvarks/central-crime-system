// Configuration file
module.exports = {
  // Get your free API key from https://newsapi.org
  NEWS_API_KEY: process.env.NEWS_API_KEY || '0ca31eee7bf642c0a3a28550c4181902',
  
  // Database configuration - Railway MySQL
  DB_HOST: process.env.MYSQLHOST,
  DB_USER: process.env.MYSQLUSER,
  DB_PASSWORD: process.env.MYSQLPASSWORD,
  DB_NAME: process.env.MYSQLDATABASE,
  DB_PORT: process.env.MYSQLPORT,
  
  // Server configuration
  PORT: process.env.PORT || 3000,
  
  // JWT Secret
  JWT_SECRET: process.env.JWT_SECRET,
  
  // File upload limits
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
};

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/auth');
const recordRoutes = require('./routes/records');
const uploadRoutes = require('./routes/upload');
const config = require('./config/config');

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/upload', uploadRoutes);

// News API proxy (to avoid CORS issues)
app.get('/api/news', async (req, res) => {
  const state = req.query.state || 'India';
  const query = `crime ${state}`;
  
  // Check if API key is configured
  if (config.NEWS_API_KEY === 'YOUR_NEWS_API_KEY') {
    return res.json({
      status: 'ok',
      articles: [
        {
          title: 'News API Key Not Configured',
          description: 'Please get a free API key from https://newsapi.org and update config/config.js',
          url: 'https://newsapi.org',
          urlToImage: 'https://via.placeholder.com/400x200?text=Configure+News+API',
          source: { name: 'System' },
          publishedAt: new Date().toISOString()
        }
      ]
    });
  }
  
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${config.NEWS_API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news', articles: [] });
  }
});

const PORT = config.PORT;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📱 Login page: http://localhost:${PORT}/login.html`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard.html`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  if (config.NEWS_API_KEY === 'YOUR_NEWS_API_KEY') {
    console.log('⚠️  News API key not configured. Get one from https://newsapi.org');
  }
});

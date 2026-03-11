# Railway Deployment Guide

## Prerequisites
- GitHub account
- Railway account (sign up at https://railway.app)

## Step 1: Push to GitHub

1. Initialize git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - Central Crime System Management"
```

2. Create a new repository on GitHub

3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy on Railway

### Option A: Deploy from GitHub (Recommended)

1. Go to https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub
5. Select your repository
6. Railway will automatically detect Node.js and deploy

### Option B: Deploy with Railway CLI

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login to Railway:
```bash
railway login
```

3. Initialize project:
```bash
railway init
```

4. Deploy:
```bash
railway up
```

## Step 3: Add MySQL Database

1. In your Railway project dashboard, click "New"
2. Select "Database" → "Add MySQL"
3. Railway will provision a MySQL database
4. Copy the connection details

## Step 4: Configure Environment Variables

In Railway project settings, add these variables:

```
PORT=3000
NODE_ENV=production

# Database (Railway will auto-populate these from MySQL service)
DB_HOST=<from Railway MySQL>
DB_USER=<from Railway MySQL>
DB_PASSWORD=<from Railway MySQL>
DB_NAME=<from Railway MySQL>
DB_PORT=<from Railway MySQL>

# News API
NEWS_API_KEY=0ca31eee7bf642c0a3a28550c4181902

# JWT Secret (change this!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

## Step 5: Connect Database to App

1. In Railway dashboard, click on your MySQL service
2. Go to "Variables" tab
3. Copy the connection variables
4. Go to your app service
5. Add the MySQL variables to your app

OR use Railway's automatic service linking:
1. Click on your app service
2. Go to "Settings" → "Service Variables"
3. Click "Add Reference" and select MySQL service
4. Railway will automatically inject database credentials

## Step 6: Generate Domain

1. Go to your app service in Railway
2. Click "Settings" → "Networking"
3. Click "Generate Domain"
4. Railway will provide a public URL like: `your-app.up.railway.app`

## Step 7: Update CORS and API URLs

After deployment, update these files:

### In `app.js`:
```javascript
app.use(cors({
  origin: ['https://your-app.up.railway.app', 'http://localhost:3000'],
  credentials: true
}));
```

### In `public/dashboard.js`, `public/login.html`, `public/register.html`:
```javascript
const API = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api'
  : 'https://your-app.up.railway.app/api';
```

## Step 8: Verify Deployment

1. Visit your Railway domain
2. Register a new account
3. Login and test all features
4. Add a test record with photo upload
5. Check news feed

## Troubleshooting

### Database Connection Issues
- Check environment variables are set correctly
- Verify MySQL service is running
- Check logs: `railway logs`

### File Upload Issues
- Railway has ephemeral filesystem
- Consider using cloud storage (AWS S3, Cloudinary) for production
- For now, uploads will work but may be lost on restart

### Port Issues
- Railway automatically assigns PORT via environment variable
- Make sure your app uses `process.env.PORT`

## Production Recommendations

1. **Use Cloud Storage for Files**
   - AWS S3
   - Cloudinary
   - Railway Volumes (persistent storage)

2. **Environment Variables**
   - Change JWT_SECRET to a strong random string
   - Use Railway's secret management

3. **Database Backups**
   - Railway MySQL includes automatic backups
   - Consider additional backup strategy

4. **Monitoring**
   - Use Railway's built-in logs
   - Set up error tracking (Sentry)

5. **Custom Domain**
   - Add your own domain in Railway settings
   - Configure DNS records

## Costs

- Railway Free Tier: $5 credit/month
- MySQL: ~$5/month
- App hosting: Based on usage
- Total: ~$5-10/month for small projects

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- GitHub Issues: Create issues in your repo

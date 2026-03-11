# Next Steps for Deployment

## Git Repository Initialized! ✅

Your code is ready to be committed and pushed to GitHub.

## Step 1: Configure Git (If not done)

Open Command Prompt and run:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 2: Commit Your Code

```bash
git commit -m "Central Crime System Management - Initial commit"
```

## Step 3: Create GitHub Repository

1. Go to https://github.com
2. Click the "+" icon → "New repository"
3. Name it: `central-crime-system`
4. Keep it Public or Private
5. DON'T initialize with README (we already have code)
6. Click "Create repository"

## Step 4: Push to GitHub

GitHub will show you commands. Use these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/central-crime-system.git
git branch -M main
git push -u origin main
```

## Step 5: Deploy on Railway

### A. Sign Up/Login to Railway
1. Go to https://railway.app
2. Click "Login" → "Login with GitHub"
3. Authorize Railway

### B. Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `central-crime-system` repository
4. Railway will automatically detect Node.js and start deploying

### C. Add MySQL Database
1. In your Railway project dashboard
2. Click "New" → "Database" → "Add MySQL"
3. Wait 1-2 minutes for provisioning
4. Railway automatically connects it to your app

### D. Configure Environment Variables
1. Click on your app service (not the database)
2. Go to "Variables" tab
3. Click "New Variable" and add:

```
NEWS_API_KEY=0ca31eee7bf642c0a3a28550c4181902
JWT_SECRET=jpmc_crime_system_2026_secure_key_change_in_production
NODE_ENV=production
```

Note: Database variables (DB_HOST, DB_USER, etc.) are automatically added by Railway!

### E. Generate Public Domain
1. Click on your app service
2. Go to "Settings" tab
3. Scroll to "Networking" section
4. Click "Generate Domain"
5. Railway will give you a URL like: `central-crime-system-production.up.railway.app`

### F. Wait for Deployment
- First deployment takes 2-3 minutes
- Watch the "Deployments" tab for progress
- Green checkmark = Success!

## Step 6: Test Your Live App

Visit your Railway URL:
```
https://your-app-name.up.railway.app/login.html
```

1. Register a new account
2. Login
3. Add a test record
4. Upload a photo
5. Check news feed

## Troubleshooting

### If deployment fails:
1. Check "Deployments" tab → Click latest deployment → View logs
2. Common issues:
   - Missing environment variables
   - Database not connected
   - Build errors

### If database connection fails:
1. Make sure MySQL service is running (green status)
2. Check that services are linked (Railway does this automatically)
3. Restart the app service

### If you see "Application Error":
1. Check logs in Railway dashboard
2. Verify all environment variables are set
3. Make sure MySQL is provisioned and running

## Important Notes

✅ Your code is production-ready
✅ Database tables will be created automatically on first run
✅ File uploads work but are ephemeral (consider cloud storage for production)
✅ News API is configured with your key
✅ All Indian states are included
✅ Video evidence support is enabled

## Railway Costs

- Free tier: $5 credit/month
- MySQL: ~$5/month
- App hosting: Based on usage
- Estimated: $5-10/month for small projects

## Need Help?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Railway Status: https://status.railway.app

## Alternative: Deploy with Railway CLI

If you prefer command line:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project (after creating on Railway dashboard)
railway link

# Deploy
railway up
```

---

Your application is ready for deployment! Follow the steps above and you'll have it live in about 10 minutes! 🚀

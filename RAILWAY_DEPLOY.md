# Quick Railway Deployment Steps

## 1. Push to GitHub

```bash
git init
git add .
git commit -m "Central Crime System Management - Ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/crime-system.git
git push -u origin main
```

## 2. Deploy on Railway

1. Go to https://railway.app and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will auto-detect and deploy

## 3. Add MySQL Database

1. In Railway project, click "New" → "Database" → "MySQL"
2. Wait for provisioning (1-2 minutes)
3. Railway auto-connects database to your app

## 4. Set Environment Variables

Click on your app service → Variables → Add these:

```
NEWS_API_KEY=0ca31eee7bf642c0a3a28550c4181902
JWT_SECRET=change_this_to_random_string_in_production
NODE_ENV=production
```

Database variables are auto-populated by Railway!

## 5. Generate Public URL

1. Click your app service
2. Settings → Networking
3. Click "Generate Domain"
4. Get URL like: `your-app.up.railway.app`

## 6. Test Your App

Visit: `https://your-app.up.railway.app/login.html`

Done! Your app is live! 🚀

## Important Notes

- First deployment takes 2-3 minutes
- Database tables are created automatically
- File uploads work but are ephemeral (lost on restart)
- For production, use cloud storage (S3, Cloudinary)

## Costs

- Railway: $5 free credit/month
- MySQL: ~$5/month after free tier
- Total: ~$5-10/month

## Troubleshooting

View logs in Railway dashboard:
- Click on your service
- Go to "Deployments" tab
- Click latest deployment
- View logs

Common issues:
- Database connection: Check MySQL service is running
- Port issues: Railway auto-assigns PORT
- Build fails: Check package.json dependencies

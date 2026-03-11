# Setup Instructions

## Step 1: Install Dependencies

Open Command Prompt (not PowerShell) and run:
```cmd
npm install bcryptjs jsonwebtoken node-fetch multer
```

Or if you have execution policy issues, run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
npm install bcryptjs jsonwebtoken node-fetch multer
```

## Step 2: Configure News API

1. Go to https://newsapi.org and sign up for a free API key
2. Open `app.js` file
3. Find line with `YOUR_NEWS_API_KEY`
4. Replace it with your actual API key

## Step 3: Verify MySQL

Make sure MySQL is running and the credentials in `config/db.js` are correct:
- Host: localhost
- User: root
- Password: Priya@07
- Database: crime_db

The tables will be created automatically when you start the server.

## Step 4: Start the Server

```cmd
npm start
```

## Step 5: Access the Application

Open your browser and go to:
```
http://localhost:3000/login.html
```

## First Time Usage

1. Click "Register here" to create an account
2. Fill in username, email, password, and select role (Officer/Admin)
3. After registration, login with your credentials
4. You'll be redirected to the dashboard

## Features to Test

### Crime News Tab
- Select different states from dropdown
- View real-time crime news articles
- Click "Read more" to view full articles

### Records Management Tab
- Click "+ Add New Record" to create a criminal record
- Fill in all details including photo URL (use any image URL)
- View records in card format
- Click on any card to view detailed information
- Add evidences to cases
- Edit or delete records
- Use filters to search records

## Sample Photo URLs for Testing

You can use these placeholder URLs:
- https://via.placeholder.com/300x400?text=Suspect+1
- https://via.placeholder.com/300x400?text=Suspect+2
- https://i.pravatar.cc/300

## Troubleshooting

### Port 3000 already in use
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### MySQL connection error
- Verify MySQL service is running
- Check credentials in config/db.js
- Ensure crime_db database exists

### News not loading
- Verify you've added your News API key in app.js
- Check internet connection
- Free tier has 100 requests/day limit

## For JPMC Interview

Key points to highlight:
- Full-stack architecture with separation of concerns
- RESTful API design with proper HTTP methods
- JWT-based authentication and authorization
- Database relationships (users, records, evidences)
- Real-time data integration with external APIs
- Responsive UI with modern design patterns
- Security best practices (password hashing, token validation)
- Scalable code structure with modular routes


## Photo Upload Feature

### How to Upload Photos

1. When adding/editing a record, click on the "Upload Photo" file input
2. Select an image from your device (JPG, PNG, GIF, WEBP)
3. Maximum file size: 5MB
4. Photo will be uploaded automatically and preview will be shown
5. Photos are stored in the `uploads/` folder on the server

### Evidence Upload

1. Click on any record card to view details
2. Click "Add Evidence" button
3. Fill in evidence type and description
4. Optionally upload a file (image or PDF)
5. Click "Submit Evidence"

### Supported File Types

- Photos: JPEG, JPG, PNG, GIF, WEBP
- Evidence files: Images and PDF documents
- Maximum size: 5MB per file

### File Storage

- All uploaded files are stored in the `uploads/` directory
- Files are automatically renamed with timestamps to avoid conflicts
- Access uploaded files via: `http://localhost:3000/uploads/filename.jpg`

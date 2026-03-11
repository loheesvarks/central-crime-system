# Quick Start Guide

## Installation (Run in Command Prompt)

```cmd
npm install bcryptjs jsonwebtoken node-fetch multer
```

## Start Server

```cmd
npm start
```

## Access Application

Open browser: `http://localhost:3000/login.html`

## How to Use Photo Upload

### Adding a Criminal Record with Photo:

1. Click "+ Add New Record" button
2. Fill in the form fields (Name, Crime, Dates, etc.)
3. Click on "Upload Photo" file input
4. Select an image from your computer (JPG, PNG, GIF, WEBP)
5. Wait for upload confirmation and preview
6. Complete other fields and click "Save Record"

### Photo Requirements:
- File types: JPEG, JPG, PNG, GIF, WEBP
- Maximum size: 5MB
- Photos are stored in `uploads/` folder

### Adding Evidence Files:

1. Click on any record card to view details
2. Scroll down to "Evidence Collection" section
3. Click "+ Add Evidence" button
4. Fill in evidence type and description
5. Click "Upload Evidence File" to select a file
6. Wait for upload confirmation
7. Click "Submit Evidence"

### Evidence File Requirements:
- File types: Images (JPEG, PNG, etc.) and PDF
- Maximum size: 5MB
- Files are stored in `uploads/` folder

## Features Overview

✅ Upload photos directly from your device
✅ Upload evidence files (images, PDFs)
✅ Preview uploaded images before saving
✅ Automatic file validation (type and size)
✅ Secure file storage with unique filenames
✅ View uploaded photos in record cards
✅ View evidence files in detail view

## Troubleshooting

### "No file uploaded" error
- Make sure you selected a file before submitting
- Check file size is under 5MB
- Verify file type is supported

### Photo not showing
- Wait for upload to complete (green checkmark)
- Check internet connection
- Verify server is running

### Upload folder missing
- The `uploads/` folder is created automatically
- If missing, create it manually in project root

## Next Steps

1. Get News API key from https://newsapi.org
2. Add key to `app.js` (replace YOUR_NEWS_API_KEY)
3. Test all features
4. Add sample records with photos
5. Practice for JPMC interview!

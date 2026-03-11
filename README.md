# Crime Management System

A professional full-stack web application for managing criminal records with authentication, real-time news, and evidence tracking.

## Features

- 🔐 **Secure Authentication** - Login/Register with JWT tokens
- 📰 **Real-Time Crime News** - State-wise crime news from News API
- 📋 **Records Management** - CRUD operations for criminal records
- 👤 **Detailed Profiles** - View accused photos, details, sentence info
- 📁 **Evidence Tracking** - Upload and manage case evidences
- 🔍 **Advanced Filters** - Filter by name, crime type, state, status
- 🎨 **Modern UI** - Attractive gradient design with smooth animations

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT, bcrypt
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **API Integration**: News API for real-time news

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up MySQL database:
- Create database `crime_db`
- Update credentials in `config/db.js` if needed

3. Get News API key:
- Sign up at https://newsapi.org
- Replace `YOUR_NEWS_API_KEY` in `app.js`

4. Start the server:
```bash
npm start
```

5. Open browser:
```
http://localhost:3000/login.html
```

## Project Structure

```
├── app.js                 # Main server file
├── config/
│   └── db.js             # Database configuration
├── middleware/
│   └── auth.js           # JWT authentication
├── routes/
│   ├── auth.js           # Authentication routes
│   └── records.js        # Records CRUD routes
└── public/
    ├── login.html        # Login page
    ├── register.html     # Registration page
    ├── dashboard.html    # Main dashboard
    ├── dashboard.js      # Dashboard logic
    └── styles.css        # Styling
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Records
- GET `/api/records` - Get all records (with filters)
- GET `/api/records/:id` - Get single record with evidences
- POST `/api/records` - Add new record
- PUT `/api/records/:id` - Update record
- DELETE `/api/records/:id` - Delete record
- POST `/api/records/:id/evidence` - Add evidence

### News
- GET `/api/news?state=StateName` - Get crime news by state

## Database Schema

### users
- id, username, email, password, role, created_at

### records
- id, name, crime, born_date, crime_date, age, photo_url
- sentence_years, sentence_details, case_status, state
- created_by, created_at

### evidences
- id, record_id, evidence_type, description, file_url, uploaded_at

## Usage

1. Register an account (Officer/Admin role)
2. Login with credentials
3. View real-time crime news by state
4. Manage criminal records with photos and details
5. Add evidences to cases
6. Filter and search records

## For JPMC Internship

This project demonstrates:
- Full-stack development skills
- RESTful API design
- Database modeling and relationships
- Authentication & authorization
- Modern UI/UX design
- Real-time data integration
- Clean code architecture

Built with scalability and best practices in mind.

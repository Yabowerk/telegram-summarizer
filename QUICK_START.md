# Quick Start Guide - Telegram Summarizer with Better Auth

## Prerequisites
- Node.js installed
- MongoDB running locally on port 27017
- Telegram API credentials (already configured in backend/.env)

## Setup Instructions

### 1. Start MongoDB
Make sure MongoDB is running on `localhost:27017`

### 2. Start Backend Server
```bash
cd backend
npm install  # if not already installed
npm run dev
```

The backend will run on `http://localhost:3000`

### 3. Start Frontend Development Server
```bash
cd frontend
npm install  # if not already installed
npm run dev
```

The frontend will run on `http://localhost:5173`

## Using the Application

### First Time Setup

1. **Create an Account**
   - Open `http://localhost:5173` in your browser
   - You'll be redirected to the login page
   - Click "Sign up" link
   - Fill in your name, email, and password (minimum 6 characters)
   - Click "Create account"
   - You'll be automatically logged in and redirected to the home page

2. **Summarize a Telegram Channel**
   - Enter a channel username (e.g., `@durov`, `@telegram`)
   - Select a date range (Today, Last 3 days, Last week, Last month, or Custom)
   - Click "Summarize"
   - Wait for the AI to generate the summary

3. **Save Channels**
   - After viewing a summary, click the bookmark icon to save the channel
   - Saved channels appear in the "Saved" tab at the top
   - Recent channels automatically appear in the "Recent" tab

4. **Logout**
   - Click your name in the top right
   - Click "Log out"

### Returning Users

1. **Login**
   - Open `http://localhost:5173`
   - Enter your email and password
   - Click "Log in"
   - Your saved channels and recent activity will be restored

2. **Session Persistence**
   - Your session persists even if you close the browser
   - You'll stay logged in until you explicitly log out

## Features

✅ **Authentication**
- Secure email/password authentication with Better Auth
- Session management with MongoDB
- Protected routes (must be logged in to use the app)

✅ **Channel Summarization**
- Summarize any public Telegram channel
- Multiple date range options
- AI-powered summaries using Google Gemini

✅ **Channel Management**
- Save favorite channels
- View recent channels
- Quick access to saved channels

✅ **User Experience**
- Clean, modern UI
- Loading states
- Empty states
- Error handling

## Architecture

### Frontend (React + Vite)
- **Better Auth React Client** - Authentication
- **React Router** - Routing
- **Custom Hooks** - State management

### Backend (Express + Node.js)
- **Better Auth** - Authentication server
- **MongoDB** - User data, sessions, channels, messages
- **Telegram API** - Fetch channel messages
- **Google Gemini AI** - Generate summaries

### Database Collections
1. `user` - User accounts
2. `session` - Active sessions
3. `channels` - Channel metadata (title, photo, username)
4. `channelmessages` - Cached channel messages
5. `userchannelactivities` - User's recent and saved channels

## Troubleshooting

### "Not authenticated" errors
- Make sure you're logged in
- Try logging out and logging back in
- Check browser console for errors

### Backend connection errors
- Verify MongoDB is running: `mongosh` or check MongoDB Compass
- Verify backend is running on port 3000
- Check backend terminal for errors

### Telegram API errors
- Verify TELEGRAM_API_ID, TELEGRAM_API_HASH, and TELEGRAM_SESSION in backend/.env
- Some channels may be private or restricted

### CORS errors
- Verify frontend is running on `http://localhost:5173`
- Verify backend CORS settings allow this origin

## Development Notes

### Running Tests
Currently no tests configured. To add tests:
- Frontend: Add Vitest or Jest
- Backend: Add Mocha or Jest

### Building for Production
```bash
# Frontend
cd frontend
npm run build
# Output in frontend/dist

# Backend
cd backend
# Deploy server.js with Node.js
```

### Environment Variables
See `backend/.env` for all required environment variables:
- Telegram credentials
- MongoDB connection string
- Google Gemini API key
- Better Auth settings

## Security Notes

🔒 **Password Security**
- Passwords are hashed using Better Auth (bcrypt)
- Never stored in plain text

🔒 **Session Security**
- Sessions stored in MongoDB
- HTTP-only cookies prevent XSS attacks
- CSRF protection enabled by Better Auth

🔒 **API Security**
- All endpoints except auth routes require authentication
- User can only access their own data
- MongoDB queries scoped to `req.user.id`

## Next Steps

Consider adding:
- [ ] Email verification
- [ ] Password reset
- [ ] OAuth (Google, GitHub)
- [ ] Two-factor authentication
- [ ] Export summaries as PDF
- [ ] Share summaries with other users
- [ ] Schedule automatic summaries
- [ ] Webhook notifications

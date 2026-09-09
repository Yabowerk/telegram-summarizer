# API Documentation

Base URL: `http://localhost:3000`

## Authentication Endpoints

All authentication endpoints are handled by Better Auth under `/api/auth/*`

### Sign Up
**POST** `/api/auth/sign-up/email`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "session": {
    "id": "session_123",
    "userId": "user_123",
    "expiresAt": "2024-02-01T00:00:00.000Z"
  }
}
```

### Sign In
**POST** `/api/auth/sign-in/email`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "session": {
    "id": "session_456",
    "userId": "user_123",
    "expiresAt": "2024-02-01T00:00:00.000Z"
  }
}
```

### Get Session
**GET** `/api/auth/get-session`

**Headers:**
```
Cookie: session_token=xxx
```

**Response:**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "session": {
    "id": "session_456",
    "userId": "user_123",
    "expiresAt": "2024-02-01T00:00:00.000Z"
  }
}
```

### Sign Out
**POST** `/api/auth/sign-out`

**Headers:**
```
Cookie: session_token=xxx
```

**Response:**
```json
{
  "success": true
}
```

---

## Application Endpoints

All endpoints below require authentication (session cookie must be present).

### Get User Channels
**GET** `/channels?type={recent|saved}`

Fetches user's recent or saved channels.

**Query Parameters:**
- `type` (optional): Filter by type
  - `recent` - Recently viewed channels
  - `saved` - User's saved/bookmarked channels
  - If omitted, returns all channels

**Headers:**
```
Cookie: session_token=xxx
```

**Response:**
```json
[
  {
    "channelUsername": "durov",
    "channelTitle": "Durov's Channel",
    "photoBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  },
  {
    "channelUsername": "telegram",
    "channelTitle": "Telegram",
    "photoBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  }
]
```

**Error Response (401):**
```json
{
  "error": "Not authenticated"
}
```

### Get Today's Summary
**POST** `/:channelUsername/today/summary`

Fetches and summarizes today's messages from a Telegram channel.

**URL Parameters:**
- `channelUsername`: The channel username (without @)

**Headers:**
```
Cookie: session_token=xxx
```

**Response (Success):**
```json
{
  "summarized": "Today's summary of the channel activity...",
  "postnumber": 14
}
```

**Response (No Messages):**
```json
{
  "summary": "No messages found for today."
}
```

**Error Response (500):**
```json
"username not found"
```

**Error Response (401):**
```json
{
  "error": "Not authenticated"
}
```

**Side Effects:**
1. Fetches latest 100 messages from Telegram API
2. Downloads and caches channel profile photo
3. Saves channel metadata to `channels` collection
4. Updates user's recent channels (`userchannelactivities` collection)
5. Saves messages to `channelmessages` collection
6. Generates AI summary using Google Gemini

### Get Date Range Summary
**POST** `/:channelUsername/range/summary?start={YYYY-MM-DD}&end={YYYY-MM-DD}`

Fetches and summarizes messages from a specific date range.

**URL Parameters:**
- `channelUsername`: The channel username (without @)

**Query Parameters:**
- `start`: Start date (ISO format: YYYY-MM-DD)
- `end`: End date (ISO format: YYYY-MM-DD)

**Headers:**
```
Cookie: session_token=xxx
```

**Example Request:**
```
POST /durov/range/summary?start=2024-01-01&end=2024-01-07
```

**Response (Success):**
```json
{
  "summary": "Summary of the channel activity from Jan 1 to Jan 7...",
  "postcount": 42
}
```

**Response (No Messages):**
```json
{
  "summary": "No messages found"
}
```

**Error Response (500):**
```json
"username not found"
```

**Error Response (401):**
```json
{
  "error": "Not authenticated"
}
```

**Side Effects:**
Same as "Get Today's Summary" endpoint

### Add/Save Channel
**POST** `/:channelusername/addingchannel?type={saved|recent}`

Adds a channel to user's saved or recent list.

**URL Parameters:**
- `channelusername`: The channel username (without @)

**Query Parameters:**
- `type` (optional): Type of channel list
  - `saved` - Add to saved channels
  - `recent` - Add to recent channels (default)

**Headers:**
```
Cookie: session_token=xxx
```

**Response (Success):**
```
HTTP 200 OK
```

**Error Response (500):**
```json
{
  "error": "Internal server error"
}
```

**Error Response (401):**
```json
{
  "error": "Not authenticated"
}
```

**Side Effects:**
Updates the `userchannelactivities` collection:
- Creates or updates entry for user + channel
- Sets `type` to "saved" or "recent"
- Updates `lastInteractedAt` timestamp

---

## Data Models

### User (MongoDB - `user` collection)
```javascript
{
  _id: ObjectId,
  id: String,           // Better Auth generated ID
  email: String,
  name: String,
  password: String,     // Hashed by Better Auth
  emailVerified: Boolean,
  image: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Session (MongoDB - `session` collection)
```javascript
{
  _id: ObjectId,
  id: String,           // Better Auth generated ID
  userId: String,       // Reference to user.id
  expiresAt: Date,
  ipAddress: String,
  userAgent: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Channel (MongoDB - `channels` collection)
```javascript
{
  _id: ObjectId,
  channelUsername: String,  // Unique index
  channelTitle: String,
  photoBase64: String       // Base64 encoded profile photo
}
```

### Channel Message (MongoDB - `channelmessages` collection)
```javascript
{
  _id: ObjectId,
  channelUsername: String,
  messageId: Number,       // Telegram message ID
  text: String,
  postedAt: Date
}
```

### User Channel Activity (MongoDB - `userchannelactivities` collection)
```javascript
{
  _id: ObjectId,
  userId: String,           // Reference to user.id
  channelUsername: String,
  type: String,            // "recent" or "saved"
  lastInteractedAt: Date
}
```

---

## Error Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 401 | Not authenticated - session missing or invalid |
| 404 | Resource not found (e.g., channel doesn't exist) |
| 500 | Server error (e.g., database error, Telegram API error) |

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting in production:
- Authentication endpoints: 5 requests per minute per IP
- Summary endpoints: 10 requests per minute per user
- Channel list endpoints: 30 requests per minute per user

---

## CORS Policy

CORS is configured to allow requests from:
- `http://localhost:5173` (frontend development server)

Credentials (cookies) are allowed for authentication.

To deploy to production, update CORS origin in `backend/server.js`:
```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

---

## Testing with cURL

### Sign Up
```bash
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}' \
  -c cookies.txt
```

### Sign In
```bash
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt
```

### Get Channels (requires auth)
```bash
curl -X GET "http://localhost:3000/channels?type=recent" \
  -b cookies.txt
```

### Get Today's Summary (requires auth)
```bash
curl -X POST http://localhost:3000/durov/today/summary \
  -b cookies.txt
```

### Get Range Summary (requires auth)
```bash
curl -X POST "http://localhost:3000/durov/range/summary?start=2024-01-01&end=2024-01-07" \
  -b cookies.txt
```

### Save Channel (requires auth)
```bash
curl -X POST "http://localhost:3000/durov/addingchannel?type=saved" \
  -b cookies.txt
```

---

## Frontend Integration

The frontend uses Better Auth React client for seamless integration:

```javascript
import { authClient } from './lib/auth-client';

// Sign up
const { data, error } = await authClient.signUp.email({
  email: 'user@example.com',
  password: 'password',
  name: 'John Doe'
});

// Sign in
const { data, error } = await authClient.signIn.email({
  email: 'user@example.com',
  password: 'password'
});

// Get session
const session = await authClient.getSession();

// Sign out
await authClient.signOut();
```

All API calls to application endpoints use `fetch` with `credentials: 'include'` to send session cookies:

```javascript
const response = await fetch('http://localhost:3000/channels?type=recent', {
  method: 'GET',
  credentials: 'include'
});
```

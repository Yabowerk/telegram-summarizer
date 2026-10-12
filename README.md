# Telegram Post Summarizer
A web app that summarizes any public Telegram channel. Enter a channel username, choose "today" or a custom date range, and get an AI-generated summary of what was posted — no bot admin access required.
<img width="900" height="700" alt="image" src="https://github.com/user-attachments/assets/ee4ebcc7-4510-40f9-b9ae-fd2332519c0f" />
## Features

- Search and summarize any public Telegram channel by username
- Summaries for today or a custom date range
- AI-generated summaries via Google Gemini
- Email/password authentication with persistent sessions
- Per-user recent and saved channel history, with channel profile photos
- Deduplicated message storage (re-fetching a channel won't create duplicate records)

## Architecture

The backend connects to Telegram using the MTProto protocol via GramJS, authenticated as a user account rather than a bot. This allows it to read any public channel's message history directly, without requiring the channel owner to add a bot or grant admin access.

Fetched messages are stored in MongoDB and deduplicated using a compound unique index on channel username and message ID. When a summary is requested, messages within the specified date range are queried, concatenated, and passed to the Gemini API with a system prompt instructing it to summarize the content.

Authentication is handled by Better Auth, backed by its own MongoDB adapter running alongside the application's primary Mongoose models. Protected routes use session-based middleware to attach the authenticated user to each request.

## Tech stack

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- GramJS (MTProto client)
- Google Gemini API
- Better Auth

**Frontend**
- React (Vite)
- Tailwind CSS
- react-markdown (summary rendering)

**Infrastructure**
- Backend hosting: Render
- Frontend hosting: Vercel
- Database: MongoDB Atlas (replica set, required for Better Auth's transactional operations)

## Data model

- **ChannelMessage** — individual posts (channel username, message ID, text, timestamp), deduplicated via a unique compound index
- **Channel** — channel profile metadata (username, display title, base64-encoded profile photo)
- **UserChannelActivity** — per-user relationship to a channel (`recent` or `saved`), with last-interaction timestamp

## API overview

| Method | Route | Description |
|---|---|---|
| `POST` | `/:channelUsername/today/summary` | Fetch, save, and summarize today's posts |
| `POST` | `/:channelUsername/range/summary?start=&end=` | Fetch, save, and summarize posts in a date range |
| `GET` | `/channels?type=recent\|saved` | Get the authenticated user's channel history |
| `POST` | `/:channelUsername/addingchannel?type=recent\|saved` | Add or update a channel in the user's history |
| `POST` | `/api/auth/sign-up/email` | Sign up |
| `POST` | `/api/auth/sign-in/email` | Log in |
| `POST` | `/api/auth/sign-out` | Log out |

## Running locally

1. Clone the repo, run `npm install` in both `backend` and `frontend`
2. Create a MongoDB Atlas cluster (free M0 tier works) and whitelist your IP
3. Register an app at [my.telegram.org](https://my.telegram.org) to get `TELEGRAM_API_ID` and `TELEGRAM_API_HASH`
4. Get a Gemini API key from Google AI Studio
5. Run a one-time interactive login script (`gramClient.js`) locally to generate a `TELEGRAM_SESSION` string
6. Populate `.env` in `backend` with: `MONGO_URL`, `TELEGRAM_API_ID`, `TELEGRAM_API_HASH`, `TELEGRAM_SESSION`, `GEMINI_API`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`
7. Start the backend: `npm start`
8. Start the frontend: `npm run dev`

## Notes on the Telegram session

The backend authenticates to Telegram as a real user account (via a saved MTProto session) rather than as a bot, since bots cannot read arbitrary public channels without being explicitly added. The session string must remain in use from a single active connection at a time — Telegram's servers will invalidate a session (`AUTH_KEY_DUPLICATED`) if it detects concurrent use from different network origins, which can occur during redeploys if overlapping server instances briefly hold the same session simultaneously.

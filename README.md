# Mahabharat

Mahabharat vocabulary, character, and Bhagavad Gita study application.

## Run locally

```sh
npm install
cp .env.example .env
npm run dev
```

The application listens on port 3000. Without MongoDB, it uses process-local in-memory storage; user and study changes do not persist across restarts. Local development seeds demo logins (`admin/admin123` and `student/student123`). Production mode omits these demo users and hides their login shortcuts.

## Deploy on Vercel

The Express app is detected from `src/app.ts`. Static browser assets are in `public/assets/`, where Vercel serves them from its CDN. Configure a strong `JWT_SECRET` in the Vercel project settings. Add a private `MONGODB_URI` for persistent users and study progress; without it, the built-in fallback is process-local and serverless instances may not share data.

Character portraits, art direction prompts, and textual references are documented in `docs/EPIC_AVATARS.md` and `docs/CHARACTER_ART_PROMPTS.json`.

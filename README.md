# Mahabharat

Mahabharat vocabulary, character, and Bhagavad Gita study application.

## Run locally

```sh
npm install
cp .env.example .env
npm run dev
```

The application listens on port 3000. Set `MONGODB_URI` to persist accounts, verification challenges, and study progress. Without it, development uses process-local data that disappears on restart. Set `RESEND_KEY` and `RESEND_FROM` to send real email OTPs locally; otherwise development prints them to the server console. Local development seeds demo logins (`admin/admin123` and `student/student123`). Production omits demo users and rejects API requests when MongoDB is unavailable.

Sign-up requires a username, full name, email, international-format mobile number, and a strong password. The app creates an account after the email code is verified. The mobile number is saved for the profile and is not verified. Password recovery requires the verified email. Pending challenges expire after 15 minutes; resend and failed-code attempts are limited. Existing accounts without a verified email can still sign in, but cannot use the password recovery flow.

To run the onboarding integration check locally, start the app with `OTP_DEV_CODE=123456`, then run `E2E_BASE_URL=http://127.0.0.1:3000 OTP_DEV_CODE=123456 npm run test:onboarding` in another terminal. Do not configure `OTP_DEV_CODE` in production.

## Deploy on Vercel

The Express app is detected from `src/app.ts`. Static browser assets are in `public/assets/`, where Vercel serves them from its CDN. Configure these production environment variables in the Vercel project before deploying:

- `JWT_SECRET`: a strong, private signing secret.
- `MONGODB_URI`: a hosted MongoDB connection string with read/write access and an allowed network path from Vercel.
- `RESEND_KEY` (or `RESEND_API_KEY`) and `RESEND_FROM`: a Resend sending key and an address on a verified sender domain for email codes.

Email codes use [Resend's email API](https://resend.com/docs/api-reference/emails/send-email). See the [MongoDB Atlas connection guide](https://www.mongodb.com/docs/atlas/driver-connection/) and [Vercel environment variable guide](https://vercel.com/docs/environment-variables). Keep all credentials out of Git.

Character portraits, art direction prompts, and textual references are documented in `docs/EPIC_AVATARS.md` and `docs/CHARACTER_ART_PROMPTS.json`.

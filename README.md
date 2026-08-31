# QI SSO Front

QI SSO Front is the identity portal of the Qavaa learning platform.
The user signs in and registers here.
The portal issues the session cookies that the other apps accept.

## Role in the platform

Five repos form the learning platform.

| Repo | Role | Dev port |
| ---- | ---- | ---- |
| qi-sso-front | Identity portal (this repo) | 3001 |
| contents-lab | Course catalog, cart, staff admin | 3000 |
| courses-api | Catalog, identity, and labs REST API | 8000 |
| pratice-lab | Coding practice workspace | 3002 |

Notes:

- The `pratice-lab` dev script starts on port 3002.

## What the portal does

The sign-in form posts the credentials to the courses-api backend at port 8000 (`/api/auth/login/`).
The backend validates the credentials.
It returns JWT access and refresh tokens.
The portal stores the tokens in cookies (`access_token` and `refresh_token`).
The portal reads the user profile from `/api/users/me/`.
Staff users go to the contents-lab admin area on port 3000.
Students go to `/home`.

The registration form posts to `/api/users/` on the same backend.

The portal protects the `/dashboard` and `/labs` routes.
The middleware in `proxy.ts` redirects a user without an `access_token` cookie to the sign-in page.

Logout deletes the two cookies.
Then the user goes to the contents-lab home page on port 3000.

## How the portal connects the apps

- The browser keeps cookies per-origin.
- The portal sets its cookie on port 3001.
- Staff sign-in passes the token to the contents-lab admin area on port 3000.
  Contents Lab adopts the token into its own cookie at `/auth/complete`.
- `courses-api` validates the same token with the shared JWT secret.
- The dashboard reads courses, labs, and stats from the single `courses-api` backend (port 8000).

## Requirements

- Node.js 20 or newer.
- npm.
- `courses-api` on port 8000 (the single backend for auth, catalog, and labs).

## Setup

1. Create the `.env` file.
   Copy `.env.example` to `.env`.
   Set `SSO_JWT_SECRET` to the same value that courses-api uses (see `courses-api/.sso-jwt-secret`).
   Keep `COURSES_API_URL=http://localhost:8000`.

2. Install the dependencies.

   ```bash
   npm install
   ```

3. Run the development server on port 3001.

   ```bash
   npx next dev -p 3001
   ```

   On Windows, double-click `start-dev.bat`.
   This starts the server on port 3001 and writes the log to `dev-server.log`.

## Environment variables

| Variable | Purpose | Default |
| ------- | ------ | ------- |
| `COURSES_API_URL` | Base URL of the courses-api service | `http://localhost:8000` |
| `SSO_JWT_SECRET` | JWT signing key shared with courses-api | (required) |
| `SSO_RETURN_ORIGIN` | Allowlisted return origin after sign-in | `http://localhost:3001` |
| `SSO_ADMIN_ORIGIN` | Staff admin origin | `http://localhost:3000` |
| `SSO_PUBLIC_HOME_ORIGIN` | Landing page after logout | `http://localhost:3000` |

`SSO_JWT_SECRET` is the shared signing key of the SSO ecosystem.
courses-api signs the tokens with this key.
The portal validates the tokens with the same key.
Set `SSO_JWT_SECRET` to the same value that courses-api uses (<code>courses-api/.sso-jwt-secret</code>).

The allowlist in `lib/sso.ts` stops open-redirect attacks.
A return origin must match one of the configured origins.
A disallowed origin sends the user to `/home` instead.

## Scripts

| Script | Command | Description |
| ------ | ------- | ----------- |
| Development | `npm run dev` | Start the dev server (port 3000 by default) |
| SSO port | `npx next dev -p 3001` | Start on the portal port |
| Windows start | `start-dev.bat` | Start on port 3001, log to `dev-server.log` |
| Build | `npm run build` | Create a production build |
| Start | `npm start` | Start the production server |
| Lint | `npm run lint` | Run the ESLint checks |

## Project structure

| Path | Purpose |
| ---- | ------- |
| `app/page.tsx` | The sign-in page |
| `components/auth/` | The sign-in and registration forms |
| `app/(dashboard)/` | The staff dashboard |
| `app/(student)/home` | The student home page |
| `app/labs/[lab_id]/` | The lab workspace pages |
| `actions/` | The server actions (auth, labs, stats, courses) |
| `lib/courses-api.ts` | The catalog fetches to `courses-api` |
| `lib/sso.ts` | The return-origin allowlist |
| `proxy.ts` | The route protection middleware |

## Related repos

- [contents-lab](https://github.com/teamqavaa/contents-lab.git)
- [courses-api](https://github.com/teamqavaa/courses-api.git)
- [pratice-lab](https://github.com/teamqavaa/pratice-lab.git)
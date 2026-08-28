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
| Digital-Readiness-Lab | User accounts, labs, code execution API | 8000 |
| courses-api | Course catalog REST API | 8001 |
| pratice-lab | Coding practice workspace | 3002 |

Notes:

- The `pratice-lab` dev script pins port 3001. Run that app on port 3002 when the portal runs on 3001.

## What the portal does

The sign-in form posts the credentials to the DRL backend at port 8000 (`/api/auth/login/`).
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

- One cookie set signs the user into `contents-lab` and `pratice-lab`.
- `courses-api` validates the same token with the shared JWT secret.
- The dashboard reads course data from `courses-api` (port 8001).
- The dashboard reads labs and stats from the DRL backend (port 8000).

## Requirements

- Node.js 20 or newer.
- npm.
- The DRL backend on port 8000.
- `courses-api` on port 8001 (for the dashboard catalog).

## Setup

1. Create the `.env` file.
   Copy `.env.example` to `.env`.
   Set `SSO_JWT_SECRET` to the `SECRET_KEY` value from `Digital-Readiness-Lab/backend/.env`.
   Keep `COURSES_API_URL=http://localhost:8001`.

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
| `COURSES_API_URL` | Base URL of the courses-api service | `http://localhost:8001` |
| `SSO_JWT_SECRET` | JWT signing key shared with courses-api | (required) |
| `SSO_RETURN_ORIGIN` | Allowlisted return origin after sign-in | `http://localhost:3001` |
| `SSO_ADMIN_ORIGIN` | Staff admin origin | `http://localhost:3000` |
| `SSO_PUBLIC_HOME_ORIGIN` | Landing page after logout | `http://localhost:3000` |

`SSO_JWT_SECRET` is the shared signing key of the SSO ecosystem.
The DRL backend signs the tokens with its `SECRET_KEY`.
`courses-api` validates the tokens with the same key.
Set `SSO_JWT_SECRET` to the DRL `SECRET_KEY` value.

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

- [Digital-Readiness-Lab](https://github.com/teamqavaa/Digital-Readiness-Lab.git)
- [contents-lab](https://github.com/teamqavaa/contents-lab.git)
- [courses-api](https://github.com/teamqavaa/courses-api.git)
- [pratice-lab](https://github.com/teamqavaa/pratice-lab.git)
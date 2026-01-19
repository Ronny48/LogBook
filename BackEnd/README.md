# Backend: Visitor Tracking System

## Overview

Node.js/Express backend for the Visitor & Package Tracking System. Implements authentication, role-based access, visits, destinations, and visit history in a local SQLite database (`database/visitor_tracking.db`).

## Tech Stack

- Node.js + Express
- better-sqlite3 (synchronous SQLite driver)
- CORS enabled for local development

## Project Structure

- `src/server.js`: Express app mounting routes
- `src/config/database.js`: DB init, schema, and seed
- `src/routes/auth.js`: Authentication routes
- `src/routes/visits.js`: Visits routes (create/list/detail/receive)
- `src/routes/destinations.js`: Destinations route (list)
- `src/routes/stats.js`: Stats endpoints
- `src/middleware/auth.js`: Auth middleware
- `database/visitor_tracking.db`: SQLite database file (auto-created)
- `package.json`: scripts and dependencies

## Getting Started

1. Prerequisites
   - Node.js 18+ installed
2. Install dependencies
   ```bash
   npm install
   ```
3. Seed the database (first time only):
   ```bash
   npm run seed
   ```
4. Run the server (dev)
   ```bash
   npm run dev
   ```
   You should see:
   ```
   Server running on port 3000
   ```
5. Production start
   ```bash
   npm start
   ```

## Database Seeding

Run `npm run seed` to populate the database with:

- **Destinations**: Reception, Office A, Office B, Accounts, HR
- **Test Users**: admin, officeA, officeB, Accounts, HR (all with their respective departments)

See `database/README.md` for more details.

## Environment

- `PORT` (optional): override the default 3000
  Create a `.env` file if needed:
  ```
  PORT=3000
  ```

## Database

- Tables auto-created on boot:
  - `destinations(id, name, created_at)` with seed values (Reception, Office A, ...)
  - `visits(id, name, purpose, telephone, status, current_destination_id, created_at, updated_at)`
  - `visit_history(id, visit_id, from_destination_id, to_destination_id, received_by, timestamp)`

## API Endpoints

Base URL: `http://localhost:3000`

- `POST /auth/login` - Login
- `POST /auth/register` - Register (admin only)
- `GET /visits` - List visits
- `POST /visits` - Create visit
- `PATCH /visits/:id/receive` - Finalize or redirect visit
- `GET /visits/:id` - Single visit with history
- `GET /destinations` - List offices/departments
- `GET /stats` - Global stats
- `GET /stats/office?destinationId=...` - Office-specific stats

## Deployment (Render)

1. Connect your GitHub repository to Render
2. Set **Build Command**: `npm install && npm run seed`
3. Set **Start Command**: `npm start`
4. Set environment variables as needed (PORT, etc.)

On each deploy, Render will install dependencies, seed the database, and start the server.

## Troubleshooting

- Port already in use: set a different `PORT` in `.env` and update the frontend fetch URL.
- Database write errors on Windows/OneDrive: ensure the process has write permission to this folder. Move the project to a non-synced directory if necessary.
- CORS issues: CORS is enabled globally with `app.use(cors())`.
- Seed errors: ensure bcryptjs is installed (`npm install bcryptjs`).

## Useful Commands

- Reinstall: `rm -rf node_modules package-lock.json && npm install` (PowerShell: `rmdir /s /q node_modules; del package-lock.json; npm install`)
- Inspect DB: open `visitor_tracking.db` with any SQLite GUI (e.g., DB Browser for SQLite).

## Notes

- Backend is intentionally minimal and synchronous for approachability.
- All endpoints require valid data; timestamps are set automatically.
  - Finalize or redirect: `{ receivedBy, nextDestination? }`

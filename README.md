# Visitor Tracking System

A full-stack application for tracking visitors and packages in an office environment. Built with Node.js/Express, SQLite, and a modern React frontend (Vite).

## Features

- Role-based authentication (admin, receptionist, staff)
- Visitor and package logging
- Office-specific dashboards
- Real-time stats and visit history
- SQLite database for persistence

## Architecture & Folder Structure

```
Data-Collection/
  BackEnd/
    package.json
    README.md
    src/
      server.js
      config/
        database.js
      routes/
        auth.js
        visits.js
        destinations.js
        stats.js
      middleware/
        auth.js
    database/
      visitor_tracking.db
  FrontEnd/
    my-app/
      package.json
      README.md
      src/
        App.jsx
        pages/
        components/
        assets/
      public/
      vite.config.js
```

## Prerequisites

- Node.js 18+
- Modern browser

## Setup & Installation

1. Install backend dependencies:
   ```bash
   cd BackEnd
   npm install
   ```
2. Install frontend dependencies:
   ```bash
   cd FrontEnd/my-app
   npm install
   ```

## Seed Database

Populate initial data (destinations and test users):

```bash
cd BackEnd
npm run seed
```

## Running the Project

- Start backend:
  ```bash
  cd BackEnd
  npm run dev
  ```
- Start frontend (new terminal):
  ```bash
  cd FrontEnd/my-app
  npm run dev
  ```
- Visit `http://localhost:5173` in your browser.

### Test Credentials

- **Receptionist**: `admin` / `secret123`
- **Office A**: `officeA` / `securet123`
- **Office B**: `officeB` / `securet123`
- **Accounts**: `Accounts` / `securet123`
- **HR**: `HR` / `securet123`

## How It Works

- Users log in with their role (admin, receptionist, staff).
- Receptionists/admins can create visits and assign destinations.
- Staff can view and receive visits assigned to their office.
- All actions are tracked in the database and shown in dashboards.

## API Endpoints

- `POST /auth/login` - Login
- `POST /auth/register` - Register (admin only)
- `GET /visits` - List visits
- `POST /visits` - Create visit
- `PATCH /visits/:id/receive` - Receive/redirect visit
- `GET /destinations` - List offices/departments
- `GET /stats` - Global stats
- `GET /stats/office?destinationId=...` - Office-specific stats

## Troubleshooting

- Ensure both backend and frontend are running.
- Check browser console and backend logs for errors.
- Database write errors: ensure write permission to `BackEnd/database/`.

## Future Advancements

- Add search, edit, and delete for visits
- Add automated tests
- Improve UI/UX and accessibility
- Add deployment scripts

---

See `BackEnd/README.md` and `FrontEnd/my-app/README.md` for more details.

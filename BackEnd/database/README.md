# Database Seeding Guide

This folder contains database files and seed scripts for the Visitor & Letter Tracking system.

## Files

- **schema.sql** - Database schema (table structure)
- **seed.js** - Node.js script to populate initial data
- **visitor_tracking.db** - SQLite database (gitignored - not in version control)

## Running the Seed Script

To populate the database with initial destinations and users:

```bash
cd BackEnd
node database/seed.js
```

## What Gets Seeded

### Destinations

- Reception
- Office A
- Office B
- Accounts
- HR

### Users (with hashed passwords)

- `admin` / `secret123` (Receptionist - Reception)
- `officeA` / `securet123` (Staff - Office A)
- `officeB` / `securet123` (Staff - Office B)
- `Accounts` / `securet123` (Staff - Accounts)
- `HR` / `securet123` (Staff - HR)

## Setup Instructions

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the seed script:

   ```bash
   node database/seed.js
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

## Notes

- Passwords are hashed with bcrypt before storing
- The `OR IGNORE` clause prevents duplicate inserts if you run the seed multiple times
- If you want to clear existing data before seeding, uncomment the DELETE statements in `seed.js`

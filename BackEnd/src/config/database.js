const path = require("path");
const Database = require("better-sqlite3");

const databaseDirectory = path.join(__dirname, "..", "..", "database");
const databaseFilePath = path.join(databaseDirectory, "visitor_tracking.db");

const db = new Database(databaseFilePath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Create tables if they do not exist
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS destinations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    purpose TEXT NOT NULL,
    telephone TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    current_destination_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (current_destination_id) REFERENCES destinations(id)
  );
`
).run();

// Safe migration: add telephone column if it does not exist yet
try {
  const columns = db.prepare("PRAGMA table_info(visits)").all();
  const hasTelephone = columns.some((c) => c.name === "telephone");
  if (!hasTelephone) {
    db.prepare("ALTER TABLE visits ADD COLUMN telephone TEXT").run();
  }
} catch (e) {
  // noop: best-effort migration
}

// Drop the old AFTER UPDATE trigger if present (avoid recursive UPDATE)
db.prepare(
  `
  DROP TRIGGER IF EXISTS visits_updated_at;
`
).run();

// Useful indices for performance on common queries
db.prepare(
  `
  CREATE INDEX IF NOT EXISTS idx_visits_created_at ON visits (created_at DESC);
`
).run();

db.prepare(
  `
  CREATE INDEX IF NOT EXISTS idx_visits_current_destination_id ON visits (current_destination_id);
`
).run();

db.prepare(
  `
  CREATE INDEX IF NOT EXISTS idx_visit_history_visit_id ON visit_history (visit_id);
`
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS visit_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visit_id INTEGER NOT NULL,
    from_destination_id INTEGER,
    to_destination_id INTEGER,
    received_by TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visit_id) REFERENCES visits(id),
    FOREIGN KEY (from_destination_id) REFERENCES destinations(id),
    FOREIGN KEY (to_destination_id) REFERENCES destinations(id)
  );
`
).run();

// Users for auth
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('receptionist','staff','admin')),
    destination_id INTEGER,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (destination_id) REFERENCES destinations(id)
  );
`
).run();

// Seed an admin user if none exist (password: admin123) - dev only
try {
  const userCount = db
    .prepare("SELECT COUNT(*) AS count FROM users")
    .get().count;
  if (userCount === 0) {
    const bcrypt = require("bcryptjs");
    const hash = bcrypt.hashSync("admin123", 10);
    db.prepare(
      "INSERT INTO users (name, role, destination_id, password_hash) VALUES (?, 'admin', NULL, ?)"
    ).run("Admin", hash);
  }
} catch (_) {}

// Seed destinations if empty
const destinationsCount = db
  .prepare("SELECT COUNT(*) as count FROM destinations")
  .get().count;
if (destinationsCount === 0) {
  const seed = db.prepare("INSERT INTO destinations (name) VALUES (?)");
  const defaultNames = ["Reception", "Office A", "Office B", "Accounts", "HR"];
  const insertMany = db.transaction((names) => {
    for (const n of names) seed.run(n);
  });
  insertMany(defaultNames);
}

module.exports = db;

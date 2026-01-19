-- Visitor & Letter Tracking System Database Schema
-- This file contains the table structure for the application

-- Destinations table (Office locations)
CREATE TABLE IF NOT EXISTS destinations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Visits table (Visitors/Letters)
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

-- Visit history table (Tracks journey of each visit through destinations)
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

-- Users table (Authentication & Authorization)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('receptionist','staff','admin')),
  destination_id INTEGER,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (destination_id) REFERENCES destinations(id)
);

-- Indices for performance optimization
CREATE INDEX IF NOT EXISTS idx_visits_created_at ON visits (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visits_current_destination_id ON visits (current_destination_id);
CREATE INDEX IF NOT EXISTS idx_visit_history_visit_id ON visit_history (visit_id);

-- Default seed data
INSERT OR IGNORE INTO destinations (name) VALUES ('Reception');
INSERT OR IGNORE INTO destinations (name) VALUES ('Office A');
INSERT OR IGNORE INTO destinations (name) VALUES ('Office B');
INSERT OR IGNORE INTO destinations (name) VALUES ('Accounts');
INSERT OR IGNORE INTO destinations (name) VALUES ('HR');

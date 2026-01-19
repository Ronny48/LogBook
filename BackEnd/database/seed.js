/**
 * Seed script to populate the database with initial data
 * Run: node database/seed.js
 */

const db = require("../src/config/database");
const bcrypt = require("bcryptjs");

// Seed data
const destinations = [
  { name: "Reception" },
  { name: "Office A" },
  { name: "Office B" },
  { name: "Accounts" },
  { name: "HR" },
];

const users = [
  {
    name: "admin",
    password: "secret123",
    role: "receptionist",
    destination_id: 1, // Reception
  },
  {
    name: "officeA",
    password: "securet123",
    role: "staff",
    destination_id: 2, // Office A
  },
  {
    name: "officeB",
    password: "securet123",
    role: "staff",
    destination_id: 3, // Office B
  },
  {
    name: "Accounts",
    password: "securet123",
    role: "staff",
    destination_id: 4, // Accounts
  },
  {
    name: "HR",
    password: "securet123",
    role: "staff",
    destination_id: 5, // HR
  },
];

try {
  console.log(" Starting database seed...");

  // Clear existing data (optional - comment out if you want to preserve)
  // db.prepare("DELETE FROM users").run();
  // db.prepare("DELETE FROM destinations").run();
  // console.log("✓ Cleared existing data");

  // Seed destinations
  const insertDestination = db.prepare(
    "INSERT OR IGNORE INTO destinations (name) VALUES (?)",
  );

  destinations.forEach((dest) => {
    insertDestination.run(dest.name);
  });
  console.log(`✓ Seeded ${destinations.length} destinations`);

  // Get destination IDs for mapping
  const getDestId = db.prepare("SELECT id FROM destinations WHERE name = ?");

  // Seed users with hashed passwords
  const insertUser = db.prepare(
    "INSERT OR IGNORE INTO users (name, role, destination_id, password_hash) VALUES (?, ?, ?, ?)",
  );

  users.forEach((user) => {
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    const destId = user.destination_id;

    insertUser.run(user.name, user.role, destId, hashedPassword);
  });
  console.log(`✓ Seeded ${users.length} users with hashed passwords`);

  console.log("\n Seed completed successfully!");
  console.log("\n Seeded Users:");
  users.forEach((u) => {
    console.log(`  - ${u.name} (${u.role}): ${u.password}`);
  });
} catch (error) {
  console.error(" Seed failed:", error.message);
  process.exit(1);
}

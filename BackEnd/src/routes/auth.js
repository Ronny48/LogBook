const express = require("express");
const db = require("../config/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      destinationId: user.destination_id,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
}

// Register (admin only) - simple guard via header token in dev; proper guard via middleware later
router.post(
  "/register",
  [
    body("name").isString().trim().isLength({ min: 2 }),
    body("password").isString().isLength({ min: 6 }),
    body("role").isIn(["receptionist", "staff", "admin"]),
    body("destinationId").optional({ nullable: true }).isInt({ min: 1 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, password, role, destinationId } = req.body;

    try {
      if (destinationId) {
        const dest = db
          .prepare("SELECT id FROM destinations WHERE id = ?")
          .get(destinationId);
        if (!dest)
          return res.status(400).json({ error: "Invalid destination" });
      }

      const exists = db
        .prepare("SELECT id FROM users WHERE name = ?")
        .get(name);
      if (exists) return res.status(409).json({ error: "User already exists" });

      const hash = bcrypt.hashSync(password, 10);
      const info = db
        .prepare(
          "INSERT INTO users (name, role, destination_id, password_hash) VALUES (?, ?, ?, ?)",
        )
        .run(name, role, destinationId || null, hash);

      const user = db
        .prepare(
          "SELECT id, name, role, destination_id FROM users WHERE id = ?",
        )
        .get(info.lastInsertRowid);
      const token = signToken(user);
      res.status(201).json({ user, token });
    } catch (e) {
      res.status(500).json({ error: "Failed to register" });
    }
  },
);

// Login
// routes/auth.js  (or wherever your login route lives)
router.post(
  "/login",
  [body("name").isString(), body("password").isString()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, password } = req.body;

    try {
      // 🔑 JOIN to pull the destination name
      const user = db
        .prepare(
          `SELECT u.id,
                u.name,
                u.role,
                u.destination_id,
                d.name AS destination_name,
                u.password_hash
         FROM users u
         LEFT JOIN destinations d ON u.destination_id = d.id
         WHERE u.name = ?`,
        )
        .get(name);

      if (!user) return res.status(401).json({ error: "Invalid credentials" });
      if (!bcrypt.compareSync(password, user.password_hash))
        return res.status(401).json({ error: "Invalid credentials" });

      const token = signToken(user);
      res.json({
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          destination_id: user.destination_id,
          destination_name: user.destination_name, // 👈 send it!
        },
        token,
      });
    } catch (e) {
      res.status(500).json({ error: "Failed to login" });
    }
  },
);

// Me
// UNUSED ENDPOINT: GET /auth/me - defined but never called from frontend
router.get("/me", (req, res) => {
  const auth = req.headers.authorization || "";
  const [, token] = auth.split(" ");
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = db
      .prepare("SELECT id, name, role, destination_id FROM users WHERE id = ?")
      .get(payload.id);
    if (!user) return res.status(401).json({ error: "Invalid token" });
    res.json({ user });
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
});

module.exports = router;

const express = require("express");
const db = require("../config/database");

const router = express.Router();

router.get("/", (req, res) => {
  try {
    const rows = db.prepare("SELECT id, name, created_at FROM destinations ORDER BY name ASC").all();
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch destinations" });
  }
});

module.exports = router;



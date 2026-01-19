// routes/stats.js
const express = require("express");
const db = require("../config/database");
const { requireAuth } = require("../middleware/auth");
const router = express.Router();

router.get("/", requireAuth, (req, res) => {
  try {
    const today = db
      .prepare(
        `SELECT COUNT(*) AS total,
    COALESCE(SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END), 0) AS pending,
    COALESCE(SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END), 0) AS completed
   FROM visits
   WHERE DATE(created_at) = DATE('now','localtime')`
      )
      .get();
    res.json(today);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Office-specific stats endpoint
router.get("/office", (req, res) => {
  const destinationId = req.query.destinationId;
  if (!destinationId) {
    return res.status(400).json({ error: "Missing destinationId parameter" });
  }
  try {
    const today = db
      .prepare(
        `SELECT COUNT(*) AS total,
    COALESCE(SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END), 0) AS pending,
    COALESCE(SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END), 0) AS completed
   FROM visits
   WHERE current_destination_id = ? AND DATE(created_at) = DATE('now','localtime')`
      )
      .get(destinationId);
    res.json(today);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch office stats" });
  }
});

module.exports = router;

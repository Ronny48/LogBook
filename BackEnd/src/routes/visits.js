const express = require("express");
const db = require("../config/database");
const { body, param, query, validationResult } = require("express-validator");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// Create a new visit
router.post(
  "/",
  requireAuth,
  requireRole("receptionist", "admin"),
  [
    body("name").isString().trim().isLength({ min: 2 }),
    body("purpose").isString().trim().isLength({ min: 2 }),
    body("telephone").isString().trim().isLength({ min: 5, max: 32 }),
    body("initialDestination").optional({ nullable: true }).isInt({ min: 1 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { name, purpose, telephone, initialDestination } = req.body;
    if (!name || !purpose || !telephone) {
      return res
        .status(400)
        .json({ error: "name, purpose and telephone are required" });
    }

    const destinationId = initialDestination || null;

    try {
      if (destinationId !== null) {
        const dest = db
          .prepare("SELECT id FROM destinations WHERE id = ?")
          .get(destinationId);
        if (!dest)
          return res.status(400).json({ error: "Invalid destination" });
      }

      const info = db
        .prepare(
          "INSERT INTO visits (name, purpose, telephone, status, current_destination_id) VALUES (?, ?, ?, 'pending', ?)",
        )
        .run(name, purpose, telephone, destinationId);

      // If an initial destination is provided, record history from Reception (NULL)
      if (destinationId) {
        db.prepare(
          "INSERT INTO visit_history (visit_id, from_destination_id, to_destination_id, received_by) VALUES (?, NULL, ?, ?)",
        ).run(info.lastInsertRowid, destinationId, "receptionist");
      }

      res.status(201).json({ id: info.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: "Failed to create visit" });
    }
  },
);

// List visits with optional filters and pagination
router.get(
  "/",
  requireAuth,
  [query("name").optional().isString(), query("status").optional().isString()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { name, status } = req.query;
    const limitRaw = Number(req.query.limit ?? 50);
    const offsetRaw = Number(req.query.offset ?? 0);
    const limit = Number.isFinite(limitRaw)
      ? Math.min(Math.max(limitRaw, 1), 200)
      : 50;
    const offset = Number.isFinite(offsetRaw) ? Math.max(offsetRaw, 0) : 0;

    const where = [];
    const params = [];
    if (name) {
      where.push("LOWER(name) LIKE ?");
      params.push(`%${name.toLowerCase()}%`);
    }
    if (status) {
      where.push("status = ?");
      params.push(status);
    }
    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
    try {
      const rows = db
        .prepare(
          `SELECT v.id, v.name, v.purpose, v.telephone, v.status, v.current_destination_id, v.created_at, v.updated_at,
                d.name AS current_destination
         FROM visits v
         LEFT JOIN destinations d ON d.id = v.current_destination_id
         ${whereClause}
         ORDER BY v.created_at DESC
         LIMIT ? OFFSET ?`,
        )
        .all(...params, limit, offset);

      const total = db
        .prepare(
          `SELECT COUNT(*) as count
         FROM visits v
         ${whereClause}`,
        )
        .get(...params).count;

      res.json({ data: rows, pagination: { limit, offset, total } });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch visits" });
    }
  },
);

router.get(
  "/office",
  requireAuth,
  [
    query("status").optional().isString(),
    query("limit").optional().isInt({ min: 1, max: 200 }),
    query("offset").optional().isInt({ min: 0 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // 🏢 Destination ID comes from the token
    const destinationId = req.user.destinationId;
    const { status } = req.query;

    const limit = Number(req.query.limit ?? 50);
    const offset = Number(req.query.offset ?? 0);

    // build WHERE clause
    const where = ["v.current_destination_id = ?"];
    const params = [destinationId];

    if (status) {
      where.push("v.status = ?");
      params.push(status);
    }

    const whereClause = `WHERE ${where.join(" AND ")}`;

    try {
      const rows = db
        .prepare(
          `SELECT v.id, v.name, v.purpose, v.telephone, v.status,
                  v.current_destination_id, v.created_at, v.updated_at,
                  d.name AS current_destination
           FROM visits v
           LEFT JOIN destinations d ON d.id = v.current_destination_id
           ${whereClause}
           ORDER BY v.created_at DESC
           LIMIT ? OFFSET ?`,
        )
        .all(...params, limit, offset);

      const total = db
        .prepare(
          `SELECT COUNT(*) AS count
             FROM visits v
             ${whereClause}`,
        )
        .get(...params).count;

      res.json({ data: rows, pagination: { limit, offset, total } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch office visits" });
    }
  },
);

// Get a single visit with history
// UNUSED ENDPOINT: GET /visits/:id - defined but never called from frontend
router.get("/:id", requireAuth, [param("id").isInt({ min: 1 })], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const id = Number(req.params.id);
  try {
    const visit = db
      .prepare(
        `SELECT v.id, v.name, v.purpose, v.telephone, v.status, v.current_destination_id, v.created_at, v.updated_at,
                d.name AS current_destination
         FROM visits v
         LEFT JOIN destinations d ON d.id = v.current_destination_id
         WHERE v.id = ?`,
      )
      .get(id);
    if (!visit) return res.status(404).json({ error: "Visit not found" });
    const history = db
      .prepare(
        `SELECT h.id, h.visit_id, h.from_destination_id, h.to_destination_id, h.received_by, h.timestamp,
                fd.name AS from_destination, td.name AS to_destination
         FROM visit_history h
         LEFT JOIN destinations fd ON fd.id = h.from_destination_id
         LEFT JOIN destinations td ON td.id = h.to_destination_id
         WHERE h.visit_id = ?
         ORDER BY h.timestamp ASC`,
      )
      .all(id);
    res.json({ data: { ...visit, history } });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch visit" });
  }
});

// Receive a visit (finalize or redirect)
router.patch(
  "/:id/receive",
  requireAuth,
  requireRole("staff", "admin"),
  [
    param("id").isInt({ min: 1 }),
    body("receivedBy").isString().trim().isLength({ min: 2 }),
    body("nextDestination").optional({ nullable: true }).isInt({ min: 1 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const id = Number(req.params.id);
    const { receivedBy, nextDestination } = req.body || {};
    if (!receivedBy)
      return res.status(400).json({ error: "receivedBy is required" });

    try {
      const existing = db.prepare("SELECT * FROM visits WHERE id = ?").get(id);
      if (!existing) return res.status(404).json({ error: "Visit not found" });

      if (nextDestination) {
        const dest = db
          .prepare("SELECT id FROM destinations WHERE id = ?")
          .get(nextDestination);
        if (!dest)
          return res.status(400).json({ error: "Invalid destination" });

        const runTx = db.transaction(() => {
          db.prepare(
            "UPDATE visits SET status = 'pending', current_destination_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
          ).run(nextDestination, id);
          db.prepare(
            "INSERT INTO visit_history (visit_id, from_destination_id, to_destination_id, received_by) VALUES (?, ?, ?, ?)",
          ).run(
            id,
            existing.current_destination_id,
            nextDestination,
            receivedBy,
          );
        });

        runTx();
        return res.json({ status: "redirected", visitId: id, nextDestination });
      } else {
        const runTx = db.transaction(() => {
          db.prepare(
            "UPDATE visits SET status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE id = ?",
          ).run(id);
          db.prepare(
            "INSERT INTO visit_history (visit_id, from_destination_id, to_destination_id, received_by) VALUES (?, ?, NULL, ?)",
          ).run(id, existing.current_destination_id, receivedBy);
        });

        runTx();
        return res.json({ status: "completed", visitId: id });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to update visit" });
    }
  },
);

module.exports = router;

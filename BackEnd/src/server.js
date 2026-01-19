const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();

// Middlewares
// Support multiple comma-separated origins via CORS_ORIGINS env; fallback to sensible local defaults
const corsEnv = process.env.CORS_ORIGIN || "http://localhost:5173";

const allowedOrigins = corsEnv.split(",").map((s) => s.trim());

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like curl/Postman) or if origin is in our list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// UNUSED: Commented out - unnecessary since app.use(cors(corsOptions)) above already enables CORS for all routes
// app.options("*", cors(corsOptions));

app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database (creates tables and seeds if needed)
require("./config/database");

// Routes
app.use("/visits", require("./routes/visits"));
app.use("/stats", require("./routes/stats"));
app.use("/destinations", require("./routes/destinations"));
app.use("/auth", require("./routes/auth"));

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

// Centralized error handler
// UNUSED: Disabled ESLint warning for 'next' parameter - it IS actually unused in this error handler (not passed to another middleware)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ error: message });
  next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

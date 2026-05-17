const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const allowedOrigins = (
  process.env.CORS_ORIGIN ||
  process.env.FRONTEND_URL ||
  "http://localhost:3000"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    uptime: process.uptime(),
  });
});

let server;

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// 404 for missing routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Global error handler (must be last)
app.use(errorHandler);

async function startServer() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is required before starting the server.");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

async function shutdown(signal) {
  console.log(`${signal} received, shutting down gracefully...`);

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  await mongoose.connection.close();
  process.exit(0);
}

process.on("SIGINT", () => {
  shutdown("SIGINT").catch((err) => {
    console.error("Graceful shutdown failed:", err.message);
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  shutdown("SIGTERM").catch((err) => {
    console.error("Graceful shutdown failed:", err.message);
    process.exit(1);
  });
});

startServer();

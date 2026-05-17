const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

function createApp() {
  const app = express();

  app.use(
    cors({
      origin: true,
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

  app.use("/api/auth", authRoutes);
  app.use("/api/jobs", jobRoutes);

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
      path: req.originalUrl,
    });
  });

  app.use(errorHandler);

  return app;
}

module.exports = createApp;

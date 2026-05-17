const mongoose = require("mongoose");
require("dotenv").config();

const createApp = require("./serverApp");

const app = createApp();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

let server;

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

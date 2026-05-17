const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createApp = require("../serverApp");
const User = require("../models/User");
const Job = require("../models/Job");

let mongoServer;
let app;
let homeownerToken;
let tradespersonToken;
let homeownerUser;
let tradespersonUser;

beforeAll(async () => {
  process.env.JWT_SECRET = "test_secret_key";

  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  app = createApp();

  const password = await bcrypt.hash("Password123", 10);

  homeownerUser = await User.create({
    name: "Test Homeowner",
    email: "homeowner.test@example.com",
    password,
    role: "homeowner",
  });

  tradespersonUser = await User.create({
    name: "Test Tradesperson",
    email: "tradesperson.test@example.com",
    password,
    role: "tradesperson",
  });

  homeownerToken = jwt.sign(
    { id: homeownerUser._id.toString(), role: homeownerUser.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  tradespersonToken = jwt.sign(
    { id: tradespersonUser._id.toString(), role: tradespersonUser.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
});

afterEach(async () => {
  await Job.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Job API", () => {
  test("POST /api/jobs creates a job for a homeowner", async () => {
    const response = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${homeownerToken}`)
      .send({
        title: "Need a plumber for a leaking tap",
        description: "Water is leaking under the kitchen sink.",
        category: "Plumbing",
        location: "Glasgow",
        contactName: "Kasuni Disara",
        contactEmail: "kasuni.disara@example.com",
      });

    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe("Need a plumber for a leaking tap");
    expect(response.body.data.status).toBe("Open");
  });

  test("PATCH /api/jobs/:id updates status to In Progress for a tradesperson", async () => {
    const job = await Job.create({
      title: "Need an electrician",
      description: "Bedroom light is flickering.",
      category: "Electrical",
      location: "Edinburgh",
      contactName: "Vishwa Perera",
      contactEmail: "vishwa.perera@example.com",
      homeowner: homeownerUser._id,
      status: "Open",
    });

    const response = await request(app)
      .patch(`/api/jobs/${job._id}`)
      .set("Authorization", `Bearer ${tradespersonToken}`)
      .send({
        status: "In Progress",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe("In Progress");
    expect(response.body.data.assignedTradesperson._id).toBe(
      tradespersonUser._id.toString(),
    );
  });
});

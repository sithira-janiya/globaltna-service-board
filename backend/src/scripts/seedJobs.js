const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Job = require("../models/Job");
const User = require("../models/User");

const MONGODB_URI = process.env.MONGODB_URI;

const sampleJobs = [
  {
    title: "Need a plumber for a leaking kitchen tap",
    description:
      "The kitchen tap has been leaking continuously since yesterday evening. Water is dripping under the sink and the pipe connection looks loose. I need a plumber to inspect the issue and repair it as soon as possible.",
    category: "Plumbing",
    location: "Glasgow",
    contactName: "Kasuni Disara",
    contactEmail: "kasuni.disara@example.com",
    status: "Open",
  },
  {
    title: "Need an electrician to fix a faulty bedroom light",
    description:
      "The bedroom light is flickering and sometimes does not turn on. The switch also feels loose. I need an electrician to check the wiring and repair the issue safely.",
    category: "Electrical",
    location: "Edinburgh",
    contactName: "Vishwa Perera",
    contactEmail: "vishwa.perera@example.com",
    status: "Open",
  },
  {
    title: "Need a painter for bedroom wall repainting",
    description:
      "One bedroom wall has paint peeling and visible damp stains near the window area. I need a painter to prepare the surface properly and repaint the wall with a clean finish.",
    category: "Painting",
    location: "Glasgow",
    contactName: "Nethmi Fernando",
    contactEmail: "nethmi.fernando@example.com",
    status: "Open",
  },
  {
    title: "Need a joiner to repair a broken wardrobe door",
    description:
      "The wardrobe sliding door is stuck and one side has come off the rail. The fitting may need repair or replacement. I need a joiner to inspect and fix it.",
    category: "Joinery",
    location: "Edinburgh",
    contactName: "Ravindu Silva",
    contactEmail: "ravindu.silva@example.com",
    status: "Open",
  },
  {
    title: "Need help fixing a leaking bathroom pipe",
    description:
      "There is a small leak under the bathroom sink, and water collects on the floor after using the tap. I need a plumber to repair the pipe connection and check for any hidden leakage.",
    category: "Plumbing",
    location: "Glasgow",
    contactName: "Amaya Perera",
    contactEmail: "amaya.perera@example.com",
    status: "Open",
  },
  {
    title: "Need an electrician to install two ceiling lights",
    description:
      "I need two new ceiling lights installed in the living room and hallway. The wiring points are already available, but the fittings need to be safely connected and tested.",
    category: "Electrical",
    location: "Paisley",
    contactName: "Dilan Jayawardena",
    contactEmail: "dilan.jayawardena@example.com",
    status: "Open",
  },
];

async function seedJobs() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }

  await mongoose.connect(MONGODB_URI);

  const hashedPassword = await bcrypt.hash("Password123", 10);

  const homeowner = await User.findOneAndUpdate(
    { email: "homeowner.demo@example.com" },
    {
      name: "Demo Homeowner",
      email: "homeowner.demo@example.com",
      password: hashedPassword,
      role: "homeowner",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  await Job.deleteMany({
    contactEmail: {
      $in: sampleJobs.map((job) => job.contactEmail),
    },
  });

  const jobsWithOwner = sampleJobs.map((job) => ({
    ...job,
    homeowner: homeowner._id,
  }));

  await Job.insertMany(jobsWithOwner);

  console.log(`Seeded ${jobsWithOwner.length} sample job requests`);
  console.log("Demo homeowner login:");
  console.log("Email: homeowner.demo@example.com");
  console.log("Password: Password123");

  await mongoose.disconnect();
}

seedJobs().catch(async (error) => {
  console.error("Seeding failed:", error.message);
  await mongoose.disconnect();
  process.exit(1);
});

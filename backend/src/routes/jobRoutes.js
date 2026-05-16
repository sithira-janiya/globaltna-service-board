const express = require("express");
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJobStatus,
  deleteJob,
} = require("../controllers/jobController");

const router = express.Router();

/**
 * Job Routes
 * GET    /api/jobs           - List all jobs with optional filters
 * GET    /api/jobs/:id       - Fetch single job
 * POST   /api/jobs           - Create job
 * PATCH  /api/jobs/:id       - Update job status
 * DELETE /api/jobs/:id       - Delete job
 */

router.get("/", getAllJobs);
router.post("/", createJob);
router.get("/:id", getJobById);
router.patch("/:id", updateJobStatus);
router.delete("/:id", deleteJob);

module.exports = router;

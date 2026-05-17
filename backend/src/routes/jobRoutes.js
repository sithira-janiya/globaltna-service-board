const express = require("express");
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJobStatus,
  deleteJob,
} = require("../controllers/jobController");

const router = express.Router();


router.get("/", getAllJobs);
router.post("/", createJob);
router.get("/:id", getJobById);
router.patch("/:id", updateJobStatus);
router.delete("/:id", deleteJob);

module.exports = router;

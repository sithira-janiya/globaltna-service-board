const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
  getAllJobs,
  getJobById,
  createJob,
  updateJobStatus,
  deleteJob,
} = require("../controllers/jobController");

const router = express.Router();


router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.post("/", protect, createJob);
router.patch("/:id", protect, updateJobStatus);
router.delete("/:id", protect, deleteJob);

module.exports = router;

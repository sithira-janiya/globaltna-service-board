const express = require("express");
const Job = require("../models/Job");
const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("homeowner", "name email")
      .populate("assignedTradesperson", "name email")
      .sort({ createdAt: -1 });

    res.json({ data: jobs });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch requests" });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("homeowner", "name email")
      .populate("assignedTradesperson", "name email");

    if (!job) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ data: job });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch request details" });
  }
});

router.post("/", protect, allowRoles("homeowner"), async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const job = await Job.create({
      title,
      description,
      category,
      location,
      homeowner: req.user.id,
      status: "open",
    });

    res.status(201).json({
      message: "Service request created successfully",
      data: job,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create request" });
  }
});

router.patch(
  "/:id/in-progress",
  protect,
  allowRoles("tradesperson"),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);

      if (!job) {
        return res.status(404).json({ message: "Request not found" });
      }

      if (job.status !== "open") {
        return res.status(400).json({
          message: "Only open requests can be marked as in progress",
        });
      }

      job.status = "in_progress";
      job.assignedTradesperson = req.user.id;

      await job.save();

      res.json({
        message: "Request marked as in progress",
        data: job,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update request" });
    }
  },
);

router.patch(
  "/:id/closed",
  protect,
  allowRoles("tradesperson"),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);

      if (!job) {
        return res.status(404).json({ message: "Request not found" });
      }

      if (!job.assignedTradesperson) {
        return res.status(400).json({
          message: "Request must be in progress before closing",
        });
      }

      if (job.assignedTradesperson.toString() !== req.user.id) {
        return res.status(403).json({
          message: "Only the assigned tradesperson can close this request",
        });
      }

      job.status = "closed";

      await job.save();

      res.json({
        message: "Request closed successfully",
        data: job,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to close request" });
    }
  },
);

router.delete("/:id", protect, allowRoles("homeowner"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (job.homeowner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only delete your own requests",
      });
    }

    await job.deleteOne();

    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete request" });
  }
});

module.exports = router;

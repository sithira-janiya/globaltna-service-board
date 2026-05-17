const express = require("express");
const Job = require("../models/Job");
const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const {
      search = "",
      category = "",
      status = "",
      location = "",
    } = req.query;

    const filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (status && status !== "All") {
      filter.status = status;
    }

    if (location && location.trim() !== "") {
      filter.location = { $regex: location.trim(), $options: "i" };
    }

    let jobs = await Job.find(filter)
      .populate("homeowner", "name email")
      .populate("assignedTradesperson", "name email")
      .sort({ createdAt: -1 });

    if (search && search.trim() !== "") {
      const searchTerm = search.trim().toLowerCase();

      jobs = jobs.filter((job) => {
        const title = job.title?.toLowerCase() || "";
        const description = job.description?.toLowerCase() || "";
        const jobLocation = job.location?.toLowerCase() || "";
        const homeownerName = job.homeowner?.name?.toLowerCase() || "";
        const contactName = job.contactName?.toLowerCase() || "";
        const contactEmail = job.contactEmail?.toLowerCase() || "";

        return (
          title.includes(searchTerm) ||
          description.includes(searchTerm) ||
          jobLocation.includes(searchTerm) ||
          homeownerName.includes(searchTerm) ||
          contactName.includes(searchTerm) ||
          contactEmail.includes(searchTerm)
        );
      });
    }

    res.json({ data: jobs });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch requests",
      error: error.message,
    });
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
    res.status(500).json({
      message: "Failed to fetch request details",
      error: error.message,
    });
  }
});

router.post("/", protect, allowRoles("homeowner"), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      contactName,
      contactEmail,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !location ||
      !contactName ||
      !contactEmail
    ) {
      return res.status(400).json({
        message:
          "Title, description, category, location, contact name, and contact email are required",
      });
    }

    const job = await Job.create({
      title,
      description,
      category,
      location,
      contactName,
      contactEmail,
      homeowner: req.user.id,
      status: "Open",
    });

    const populatedJob = await Job.findById(job._id)
      .populate("homeowner", "name email")
      .populate("assignedTradesperson", "name email");

    res.status(201).json({
      message: "Service request created successfully",
      data: populatedJob,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: Object.values(error.errors)
          .map((validationError) => validationError.message)
          .join(", "),
      });
    }

    res.status(500).json({
      message: "Failed to create request",
      error: error.message,
    });
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

      if (job.status !== "Open") {
        return res.status(400).json({
          message: "Only open requests can be marked as in progress",
        });
      }

      job.status = "In Progress";
      job.assignedTradesperson = req.user.id;

      await job.save();

      const updatedJob = await Job.findById(job._id)
        .populate("homeowner", "name email")
        .populate("assignedTradesperson", "name email");

      res.json({
        message: "Request marked as in progress",
        data: updatedJob,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update request",
        error: error.message,
      });
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

      job.status = "Closed";

      await job.save();

      const updatedJob = await Job.findById(job._id)
        .populate("homeowner", "name email")
        .populate("assignedTradesperson", "name email");

      res.json({
        message: "Request closed successfully",
        data: updatedJob,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to close request",
        error: error.message,
      });
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
    res.status(500).json({
      message: "Failed to delete request",
      error: error.message,
    });
  }
});

module.exports = router;

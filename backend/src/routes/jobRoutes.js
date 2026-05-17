const express = require("express");
const Job = require("../models/Job");
const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

const VALID_STATUSES = ["Open", "In Progress", "Closed"];
const VALID_CATEGORIES = [
  "Plumbing",
  "Electrical",
  "Painting",
  "Joinery",
  "Other",
];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validateJobInput(body) {
  const errors = [];

  const title = normalizeString(body.title);
  const description = normalizeString(body.description);
  const category = normalizeString(body.category);
  const location = normalizeString(body.location);
  const contactName = normalizeString(body.contactName);
  const contactEmail = normalizeString(body.contactEmail).toLowerCase();

  if (!title) {
    errors.push("Title is required");
  }

  if (!description) {
    errors.push("Description is required");
  }

  if (!category) {
    errors.push("Category is required");
  } else if (!VALID_CATEGORIES.includes(category)) {
    errors.push(
      "Category must be Plumbing, Electrical, Painting, Joinery, or Other",
    );
  }

  if (!location) {
    errors.push("Location is required");
  }

  if (!contactName) {
    errors.push("Contact name is required");
  }

  if (!contactEmail) {
    errors.push("Contact email is required");
  } else if (!emailRegex.test(contactEmail)) {
    errors.push("Contact email must be a valid email address");
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      title,
      description,
      category,
      location,
      contactName,
      contactEmail,
    },
  };
}

function validateStatusInput(body) {
  const status = normalizeString(body.status);
  const errors = [];

  if (!status) {
    errors.push("Status is required");
  } else if (!VALID_STATUSES.includes(status)) {
    errors.push("Status must be Open, In Progress, or Closed");
  }

  return {
    isValid: errors.length === 0,
    errors,
    status,
  };
}

async function getPopulatedJob(id) {
  return Job.findById(id)
    .populate("homeowner", "name email")
    .populate("assignedTradesperson", "name email");
}

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
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          message: "Status filter must be Open, In Progress, or Closed",
        });
      }

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
    const job = await getPopulatedJob(req.params.id);

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
    const validation = validateJobInput(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        message: validation.errors.join(", "),
        errors: validation.errors,
      });
    }

    const job = await Job.create({
      ...validation.data,
      homeowner: req.user.id,
      status: "Open",
    });

    const populatedJob = await getPopulatedJob(job._id);

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

/**
 * Required assessment endpoint:
 * PATCH /api/jobs/:id
 * Updates status only.
 */
router.patch("/:id", protect, allowRoles("tradesperson"), async (req, res) => {
  try {
    const validation = validateStatusInput(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        message: validation.errors.join(", "),
        errors: validation.errors,
      });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (validation.status === "Open") {
      return res.status(400).json({
        message: "Closed or in-progress requests cannot be reopened",
      });
    }

    if (validation.status === "In Progress") {
      if (job.status !== "Open") {
        return res.status(400).json({
          message: "Only open requests can be marked as in progress",
        });
      }

      job.status = "In Progress";
      job.assignedTradesperson = req.user.id;
    }

    if (validation.status === "Closed") {
      if (job.status !== "In Progress") {
        return res.status(400).json({
          message: "Only in-progress requests can be closed",
        });
      }

      if (!job.assignedTradesperson) {
        return res.status(400).json({
          message: "Request must be assigned before closing",
        });
      }

      if (job.assignedTradesperson.toString() !== req.user.id) {
        return res.status(403).json({
          message: "Only the assigned tradesperson can close this request",
        });
      }

      job.status = "Closed";
    }

    await job.save();

    const updatedJob = await getPopulatedJob(job._id);

    res.json({
      message: "Request status updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update request status",
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

      const updatedJob = await getPopulatedJob(job._id);

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

      if (job.status !== "In Progress") {
        return res.status(400).json({
          message: "Only in-progress requests can be closed",
        });
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

      const updatedJob = await getPopulatedJob(job._id);

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

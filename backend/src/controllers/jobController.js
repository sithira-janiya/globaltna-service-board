const JobRequest = require("../models/JobRequest");

exports.getAllJobs = async (req, res, next) => {
  try {
    const { category, status } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const jobs = await JobRequest.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (err) {
    next(err);
  }
};


exports.getJobById = async (req, res, next) => {
  try {
    const job = await JobRequest.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job request not found",
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (err) {
    next(err);
  }
};


exports.createJob = async (req, res, next) => {
  try {
    const job = await JobRequest.create(req.body);

    res.status(201).json({
      success: true,
      message: "Job request created successfully",
      data: job,
    });
  } catch (err) {
    next(err);
  }
};


exports.updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    // Validate that status is provided
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Please provide a status",
      });
    }

    const job = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job status updated successfully",
      data: job,
    });
  } catch (err) {
    next(err);
  }
};


exports.deleteJob = async (req, res, next) => {
  try {
    const job = await JobRequest.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job request deleted successfully",
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

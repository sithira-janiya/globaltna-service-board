const mongoose = require("mongoose");

const jobRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a job title"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a job description"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
    },
    category: {
      type: String,
      enum: {
        values: ["Plumbing", "Electrical", "Painting", "Joinery", "Other"],
        message:
          "Category must be one of: Plumbing, Electrical, Painting, Joinery, or Other",
      },
      required: [true, "Please select a category"],
    },
    location: {
      type: String,
      trim: true,
    },
    contactName: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    status: {
      type: String,
      enum: {
        values: ["Open", "In Progress", "Closed"],
        message: "Status must be one of: Open, In Progress, or Closed",
      },
      default: "Open",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    collection: "jobRequests",
    timestamps: { createdAt: false, updatedAt: true },
  },
);

module.exports = mongoose.model("JobRequest", jobRequestSchema);

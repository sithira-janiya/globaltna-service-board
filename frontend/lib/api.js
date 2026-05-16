import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const jobApi = {
  // Get all jobs with optional filters
  getAllJobs: async (filters = {}) => {
    try {
      const response = await axiosInstance.get("/jobs", { params: filters });
      return {
        success: true,
        data: response.data.data || [],
        count: response.data.count,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch jobs",
      };
    }
  },

  // Get single job by ID
  getJobById: async (id) => {
    try {
      const response = await axiosInstance.get(`/jobs/${id}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch job",
      };
    }
  },

  // Create new job
  createJob: async (jobData) => {
    try {
      const response = await axiosInstance.post("/jobs", jobData);
      return { success: true, data: response.data.data };
    } catch (error) {
      const errors = error.response?.data?.errors || [
        error.response?.data?.message || "Failed to create job",
      ];
      return { success: false, error: errors[0], errors };
    }
  },

  // Update job status
  updateJobStatus: async (id, status) => {
    try {
      const response = await axiosInstance.patch(`/jobs/${id}`, { status });
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update job",
      };
    }
  },

  // Delete job
  deleteJob: async (id) => {
    try {
      await axiosInstance.delete(`/jobs/${id}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete job",
      };
    }
  },
};

export default axiosInstance;

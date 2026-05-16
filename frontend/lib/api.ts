import axios, { AxiosError } from "axios";
import { Job, ApiResponse, CreateJobInput } from "@/types/job";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const jobApi = {
  async getAllJobs(filters?: {
    category?: string;
    status?: string;
  }): Promise<{
    success: boolean;
    data: Job[];
    error?: string;
    count: number;
  }> {
    try {
      const response = await axiosInstance.get<ApiResponse<Job[]>>("/jobs", {
        params: filters,
      });
      return {
        success: true,
        data: response.data.data || [],
        count: response.data.count || 0,
      };
    } catch (error) {
      const message =
        (error as AxiosError<ApiResponse<null>>)?.response?.data?.message ||
        "Failed to fetch jobs";
      return {
        success: false,
        error: message,
        data: [],
        count: 0,
      };
    }
  },

  async getJobById(
    id: string,
  ): Promise<{ success: boolean; data?: Job; error?: string }> {
    try {
      const response = await axiosInstance.get<ApiResponse<Job>>(`/jobs/${id}`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      const message =
        (error as AxiosError<ApiResponse<null>>)?.response?.data?.message ||
        "Failed to fetch job";
      return {
        success: false,
        error: message,
      };
    }
  },

  async createJob(jobData: CreateJobInput): Promise<{
    success: boolean;
    data?: Job;
    error?: string;
    errors?: string[];
  }> {
    try {
      const response = await axiosInstance.post<ApiResponse<Job>>(
        "/jobs",
        jobData,
      );
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      const apiError = error as AxiosError<ApiResponse<null>>;
      const errors = apiError?.response?.data?.errors || [];
      const message =
        apiError?.response?.data?.message || "Failed to create job";
      return {
        success: false,
        error: message,
        errors,
      };
    }
  },

  async updateJobStatus(
    id: string,
    status: Job["status"],
  ): Promise<{ success: boolean; data?: Job; error?: string }> {
    try {
      const response = await axiosInstance.patch<ApiResponse<Job>>(
        `/jobs/${id}`,
        { status },
      );
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      const message =
        (error as AxiosError<ApiResponse<null>>)?.response?.data?.message ||
        "Failed to update job";
      return {
        success: false,
        error: message,
      };
    }
  },

  async deleteJob(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      await axiosInstance.delete(`/jobs/${id}`);
      return { success: true };
    } catch (error) {
      const message =
        (error as AxiosError<ApiResponse<null>>)?.response?.data?.message ||
        "Failed to delete job";
      return {
        success: false,
        error: message,
      };
    }
  },
};

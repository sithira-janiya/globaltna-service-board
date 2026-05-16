"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import JobCard from "@/components/JobCard";
import { jobApi } from "@/lib/api";
import { Job } from "@/types/job";

const CATEGORIES = [
  "All",
  "Plumbing",
  "Electrical",
  "Painting",
  "Joinery",
  "Other",
];
const STATUSES = ["All", "Open", "In Progress", "Closed"];

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    fetchJobs();
  }, [selectedCategory, selectedStatus]);

  const fetchJobs = async () => {
    setLoading(true);
    setError("");

    const filters: { category?: string; status?: string } = {};
    if (selectedCategory !== "All") filters.category = selectedCategory;
    if (selectedStatus !== "All") filters.status = selectedStatus;

    const result = await jobApi.getAllJobs(filters);

    if (result.success) {
      setJobs(result.data);
    } else {
      setError(result.error || "Failed to load jobs");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Header with Gradient Background */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-5xl font-bold">Service Requests</h1>
            <p className="text-blue-100 mt-3 text-lg">
              Manage and track all your service requests in one place
            </p>
          </div>
          <Link
            href="/jobs/new"
            className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-md hover:shadow-lg whitespace-nowrap text-lg"
          >
            + New Request
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Filters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Category Filter */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-semibold text-gray-900 mb-3"
            >
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-semibold text-gray-900 mb-3"
            >
              Status
            </label>
            <select
              id="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <p className="text-red-900 font-bold text-lg">
            ⚠️ Error Loading Jobs
          </p>
          <p className="text-red-700 mt-2">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16 bg-white rounded-2xl">
          <div className="inline-block">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 mt-4 text-lg font-medium">
            Loading service requests...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && jobs.length === 0 && !error && (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-gray-600 text-lg font-medium mb-6">
            No service requests found
          </p>
          <Link
            href="/jobs/new"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            Create First Request
          </Link>
        </div>
      )}

      {/* Jobs Grid */}
      {!loading && jobs.length > 0 && (
        <div>
          <p className="text-gray-700 mb-6 text-lg font-medium">
            📋 Showing{" "}
            <span className="font-bold text-blue-600">{jobs.length}</span>{" "}
            request
            {jobs.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

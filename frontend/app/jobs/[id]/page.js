"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { jobApi } from "@/lib/api";

const STATUS_OPTIONS = ["Open", "In Progress", "Closed"];

export default function JobDetailPage({ params }) {
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [statusSuccess, setStatusSuccess] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [params.id]);

  const fetchJob = async () => {
    setLoading(true);
    setError("");

    const result = await jobApi.getJobById(params.id);

    if (result.success) {
      setJob(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatusError("");
    setStatusSuccess("");
    setStatusUpdating(true);

    const result = await jobApi.updateJobStatus(params.id, newStatus);

    if (result.success) {
      setJob(result.data);
      setStatusSuccess("Status updated successfully");
    } else {
      setStatusError(result.error);
      // Revert the select to previous value
      e.target.value = job.status;
    }
    setStatusUpdating(false);
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this request? This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsDeleting(true);
    const result = await jobApi.deleteJob(params.id);

    if (result.success) {
      router.push("/");
    } else {
      setError(result.error);
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600 mt-4">Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="space-y-6">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          ← Back to Requests
        </Link>
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-semibold text-lg">Error</p>
          <p className="text-red-700 mt-2">{error || "Job not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/"
        className="text-blue-600 hover:text-blue-700 font-semibold inline-block"
      >
        ← Back to Requests
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-900">{job.title}</h1>
          <p className="text-gray-600 mt-2">
            Created on {new Date(job.createdAt).toLocaleDateString()}
          </p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      {/* Messages */}
      {statusSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">{statusSuccess}</p>
        </div>
      )}
      {statusError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{statusError}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Description
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Category</p>
                <p className="text-gray-900 mt-1 px-3 py-1 bg-blue-50 inline-block rounded w-fit">
                  {job.category}
                </p>
              </div>
              {job.location && (
                <div>
                  <p className="text-gray-600 text-sm font-semibold">
                    Location
                  </p>
                  <p className="text-gray-900 mt-1">{job.location}</p>
                </div>
              )}
              {job.contactName && (
                <div>
                  <p className="text-gray-600 text-sm font-semibold">
                    Contact Name
                  </p>
                  <p className="text-gray-900 mt-1">{job.contactName}</p>
                </div>
              )}
              {job.contactEmail && (
                <div>
                  <p className="text-gray-600 text-sm font-semibold">
                    Contact Email
                  </p>
                  <a
                    href={`mailto:${job.contactEmail}`}
                    className="text-blue-600 hover:text-blue-700 mt-1 block"
                  >
                    {job.contactEmail}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status Update */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Update Status
            </h2>
            <select
              value={job.status}
              onChange={handleStatusChange}
              disabled={statusUpdating}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {statusUpdating && (
              <p className="text-gray-600 text-sm mt-2">Updating...</p>
            )}
          </div>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition ${
              isDeleting
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isDeleting ? "Deleting..." : "Delete Request"}
          </button>
        </div>
      </div>
    </div>
  );
}

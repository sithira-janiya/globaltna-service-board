"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { jobApi } from "@/lib/api";
import { Job } from "@/types/job";

const STATUS_OPTIONS: Job["status"][] = ["Open", "In Progress", "Closed"];

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [statusSuccess, setStatusSuccess] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    setLoading(true);
    setError("");

    const result = await jobApi.getJobById(id);

    if (result.success) {
      setJob(result.data || null);
    } else {
      setError(result.error || "Failed to load job");
    }
    setLoading(false);
  };

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newStatus = e.target.value as Job["status"];
    setStatusError("");
    setStatusSuccess("");
    setStatusUpdating(true);

    const result = await jobApi.updateJobStatus(id, newStatus);

    if (result.success && result.data) {
      setJob(result.data);
      setStatusSuccess("Status updated successfully");
    } else {
      setStatusError(result.error || "Failed to update status");
      // Revert the select to previous value
      if (job) {
        e.target.value = job.status;
      }
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
    const result = await jobApi.deleteJob(id);

    if (result.success) {
      router.push("/");
    } else {
      setError(result.error || "Failed to delete job");
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl">
        <div className="inline-block">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-700 mt-6 text-lg font-medium">Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="space-y-6">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-700 font-bold text-lg inline-block"
        >
          ← Back to Requests
        </Link>
        <div className="p-8 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <p className="text-red-900 font-bold text-2xl">❌ Error</p>
          <p className="text-red-700 mt-3 text-lg">
            {error || "Job request not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/"
        className="text-blue-600 hover:text-blue-700 font-bold inline-block text-lg"
      >
        ← Back to Requests
      </Link>

      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-5xl font-bold">{job.title}</h1>
            <p className="text-purple-100 mt-3">
              📅 Created on {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <StatusBadge status={job.status} />
          </div>
        </div>
      </div>

      {/* Messages */}
      {statusSuccess && (
        <div className="p-5 bg-green-50 border-l-4 border-green-500 rounded-lg">
          <p className="text-green-900 font-bold text-lg">✅ Success</p>
          <p className="text-green-700 mt-2">{statusSuccess}</p>
        </div>
      )}
      {statusError && (
        <div className="p-5 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <p className="text-red-900 font-bold text-lg">⚠️ Error</p>
          <p className="text-red-700 mt-2">{statusError}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📝 Description
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 text-sm font-bold uppercase tracking-wide">Category</p>
                <p className="text-gray-900 mt-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 inline-block rounded-full font-bold border border-blue-200">
                  {job.category}
                </p>
              </div>
              {job.location && (
                <div>
                  <p className="text-gray-600 text-sm font-bold uppercase tracking-wide">
                    📍 Location
                  </p>
                  <p className="text-gray-900 mt-3 text-lg font-medium">{job.location}</p>
                </div>
              )}
              {job.contactName && (
                <div>
                  <p className="text-gray-600 text-sm font-bold uppercase tracking-wide">
                    👤 Contact Name
                  </p>
                  <p className="text-gray-900 mt-3 text-lg font-medium">{job.contactName}</p>
                </div>
              )}
              {job.contactEmail && (
                <div>
                  <p className="text-gray-600 text-sm font-bold uppercase tracking-wide">
                    📧 Contact Email
                  </p>
                  <a
                    href={`mailto:${job.contactEmail}`}
                    className="text-blue-600 hover:text-blue-700 mt-3 block text-lg font-medium hover:underline"
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
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Update Status
            </h2>
            <select
              value={job.status}
              onChange={handleStatusChange}
              disabled={statusUpdating}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium bg-white disabled:bg-gray-100 transition"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {statusUpdating && (
              <p className="text-gray-600 text-sm mt-3 font-medium">🔄 Updating...</p>
            )}
          </div>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all ${
              isDeleting
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 hover:shadow-lg"
            }`}
          >
            {isDeleting ? "🗑️ Deleting..." : "🗑️ Delete Request"}
          </button>
        </div>
      </div>
    </div>
  );
}

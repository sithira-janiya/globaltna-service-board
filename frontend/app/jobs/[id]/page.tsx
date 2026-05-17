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
      <div className="rounded-[2rem] border border-white/70 bg-white/85 py-16 text-center shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
        <div className="inline-block">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-100 border-t-sky-500"></div>
        </div>
        <p className="mt-6 text-base font-medium text-slate-600">
          Loading request details...
        </p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="space-y-6">
        <Link
          href="/"
          className="inline-block text-sm font-semibold text-sky-700 hover:text-sky-800"
        >
          ← Back to Requests
        </Link>
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-700">
            Request not available
          </p>
          <p className="mt-2 text-sm leading-6 text-red-800">
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
        className="inline-block text-sm font-semibold text-sky-700 hover:text-sky-800"
      >
        ← Back to Requests
      </Link>

      <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)] sm:p-10">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
              Request overview
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
              {job.title}
            </h1>
            <p className="mt-3 text-sm text-slate-300">
              Created {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <StatusBadge status={job.status} />
          </div>
        </div>
      </div>

      {/* Messages */}
      {statusSuccess && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Updated
          </p>
          <p className="mt-2 text-sm leading-6 text-emerald-800">
            {statusSuccess}
          </p>
        </div>
      )}
      {statusError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
            Update failed
          </p>
          <p className="mt-2 text-sm leading-6 text-red-800">{statusError}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
            <h2 className="mb-4 text-xl font-semibold tracking-tight text-slate-950">
              Description
            </h2>
            <p className="whitespace-pre-wrap text-base leading-8 text-slate-600">
              {job.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
            <h2 className="mb-6 text-xl font-semibold tracking-tight text-slate-950">
              Details
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Category
                </p>
                <p className="mt-3 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-inset ring-slate-200">
                  {job.category}
                </p>
              </div>
              {job.location && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Location
                  </p>
                  <p className="mt-3 text-base font-medium text-slate-900">
                    {job.location}
                  </p>
                </div>
              )}
              {job.contactName && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Contact name
                  </p>
                  <p className="mt-3 text-base font-medium text-slate-900">
                    {job.contactName}
                  </p>
                </div>
              )}
              {job.contactEmail && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Contact email
                  </p>
                  <a
                    href={`mailto:${job.contactEmail}`}
                    className="mt-3 block text-base font-medium text-sky-700 hover:text-sky-800 hover:underline"
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
          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
            <h2 className="mb-4 text-lg font-semibold tracking-tight text-slate-950">
              Update Status
            </h2>
            <select
              value={job.status}
              onChange={handleStatusChange}
              disabled={statusUpdating}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-slate-900 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500/30 disabled:bg-slate-100"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {statusUpdating && (
              <p className="mt-3 text-sm font-medium text-slate-500">
                Updating...
              </p>
            )}
          </div>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`w-full rounded-2xl px-6 py-4 text-base font-semibold text-white transition-all ${
              isDeleting
                ? "cursor-not-allowed bg-red-300"
                : "bg-red-600 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-lg"
            }`}
          >
            {isDeleting ? "Deleting..." : "Delete request"}
          </button>
        </div>
      </div>
    </div>
  );
}

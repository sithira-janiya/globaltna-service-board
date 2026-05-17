"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import { deleteJob, getJobById, updateJobStatus } from "@/lib/api";
import { JobRequest, JobStatus } from "@/types/job";

const statuses: JobStatus[] = ["Open", "In Progress", "Closed"];

function formatDate(date?: string) {
  if (!date) return "Not available";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [job, setJob] = useState<JobRequest | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<JobStatus>("Open");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("service_board_token");
    setIsAuthenticated(Boolean(token));
  }, []);

  async function loadJob() {
    try {
      setIsLoading(true);
      setError("");

      const data = await getJobById(id);

      setJob(data);
      setSelectedStatus(data.status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load request");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      loadJob();
    }
  }, [id]);

  async function handleStatusUpdate() {
    if (!job || !isAuthenticated) return;

    try {
      setIsUpdating(true);
      setError("");

      const updatedJob = await updateJobStatus(job._id, selectedStatus);
      setJob(updatedJob);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete() {
    if (!job || !isAuthenticated) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this request?",
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);

      await deleteJob(job._id);

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete request");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="font-bold text-slate-950">
            ← Service Board
          </Link>

          {!isAuthenticated && (
            <Link
              href="/login"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {isLoading && (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="font-semibold text-slate-700">Loading request...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <h1 className="text-xl font-bold text-red-700">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-red-600">{error}</p>

            <Link
              href="/"
              className="mt-5 inline-flex rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white"
            >
              Back to Home
            </Link>
          </div>
        )}

        {!isLoading && !error && job && (
          <>
            <div className="mb-8">
              <span className="inline-flex rounded-full bg-indigo-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-indigo-700">
                Request Details
              </span>

              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950">
                    {job.title}
                  </h1>

                  <p className="mt-3 text-slate-600">
                    Created {formatDate(job.createdAt)}
                  </p>
                </div>

                <StatusBadge status={job.status} />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-xl font-bold text-slate-950">
                  Description
                </h2>

                <p className="mt-4 whitespace-pre-line leading-7 text-slate-600">
                  {job.description}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <InfoCard label="Category" value={job.category} />

                  <InfoCard
                    label="Location"
                    value={job.location || "Not specified"}
                  />

                  <InfoCard
                    label="Contact Name"
                    value={job.contactName || "Not specified"}
                  />

                  <InfoCard
                    label="Contact Email"
                    value={job.contactEmail || "Not specified"}
                  />
                </div>
              </section>

              <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-950">
                  Manage request
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  Update the progress status or remove this request.
                </p>

                {!isAuthenticated && (
                  <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    Please log in to update or delete this request.
                  </div>
                )}

                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Status
                  </label>

                  <select
                    value={selectedStatus}
                    onChange={(event) =>
                      setSelectedStatus(event.target.value as JobStatus)
                    }
                    disabled={!isAuthenticated}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    {statuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleStatusUpdate}
                  disabled={
                    isUpdating ||
                    selectedStatus === job.status ||
                    !isAuthenticated
                  }
                  className="mt-4 w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUpdating ? "Updating..." : "Update Status"}
                </button>

                <button
                  onClick={handleDelete}
                  disabled={isDeleting || !isAuthenticated}
                  className="mt-3 w-full rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeleting ? "Deleting..." : "Delete Request"}
                </button>

                {!isAuthenticated && (
                  <Link
                    href="/login"
                    className="mt-4 inline-flex w-full justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Login to Manage
                  </Link>
                )}
              </aside>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-semibold text-slate-900">{value}</p>
    </div>
  );
}

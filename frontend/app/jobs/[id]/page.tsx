"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import {
  deleteJob,
  getJobById,
  getStoredUser,
  logoutUser,
  markJobClosed,
  markJobInProgress,
} from "@/lib/api";
import { AuthUser, JobRequest } from "@/types/job";

function formatDate(date?: string) {
  if (!date) return "Not available";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function getOwnerId(job: JobRequest) {
  return job.homeowner?._id || job.homeowner?.id;
}

function getAssignedTradespersonId(job: JobRequest) {
  return job.assignedTradesperson?._id || job.assignedTradesperson?.id;
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [user, setUser] = useState<AuthUser | null>(null);
  const [job, setJob] = useState<JobRequest | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      router.push("/login");
      return;
    }

    setUser(storedUser);
  }, [router]);

  useEffect(() => {
    if (id) {
      loadJob();
    }
  }, [id]);

  async function loadJob() {
    try {
      setIsLoading(true);
      setError("");

      const data = await getJobById(id);
      setJob(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load request");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMarkInProgress() {
    if (!job || !user || user.role !== "tradesperson") return;

    try {
      setIsUpdating(true);
      setError("");

      const updatedJob = await markJobInProgress(job._id);
      setJob(updatedJob);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update request");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleMarkClosed() {
    if (!job || !user || user.role !== "tradesperson") return;

    try {
      setIsUpdating(true);
      setError("");

      const updatedJob = await markJobClosed(job._id);
      setJob(updatedJob);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to close request");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete() {
    if (!job || !user || user.role !== "homeowner") return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this request?",
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setError("");

      await deleteJob(job._id);

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete request");
    } finally {
      setIsDeleting(false);
    }
  }

  function handleLogout() {
    logoutUser();
    router.push("/login");
  }

  const isOwner =
    user && job && user.role === "homeowner" && getOwnerId(job) === user.id;

  const isAssignedTradesperson =
    user &&
    job &&
    user.role === "tradesperson" &&
    getAssignedTradespersonId(job) === user.id;

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="font-bold text-slate-950">
            ← Service Board
          </Link>

          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-slate-950">{user.name}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {user.role}
                </p>
              </div>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Login
              </Link>
            )}
          </div>
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
                    label="Homeowner"
                    value={job.homeowner?.name || "Not available"}
                  />

                  <InfoCard
                    label="Assigned Tradesperson"
                    value={job.assignedTradesperson?.name || "Not assigned"}
                  />
                </div>
              </section>

              <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-950">
                  Manage request
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  Actions are controlled by your account role.
                </p>

                {!user && (
                  <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    Please log in to manage this request.
                  </div>
                )}

                {user?.role === "homeowner" && (
                  <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    Homeowners can create and delete only their own service
                    requests.
                  </div>
                )}

                {user?.role === "tradesperson" && (
                  <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    Tradespeople can move open requests to in progress and close
                    their assigned requests.
                  </div>
                )}

                {user?.role === "tradesperson" && job.status === "open" && (
                  <button
                    onClick={handleMarkInProgress}
                    disabled={isUpdating}
                    className="mt-6 w-full rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isUpdating ? "Updating..." : "Mark In Progress"}
                  </button>
                )}

                {user?.role === "tradesperson" &&
                  job.status === "in_progress" &&
                  isAssignedTradesperson && (
                    <button
                      onClick={handleMarkClosed}
                      disabled={isUpdating}
                      className="mt-6 w-full rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isUpdating ? "Closing..." : "Mark Closed"}
                    </button>
                  )}

                {user?.role === "tradesperson" &&
                  job.status === "in_progress" &&
                  !isAssignedTradesperson && (
                    <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                      This request is already assigned to another tradesperson.
                    </div>
                  )}

                {isOwner && (
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="mt-6 w-full rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isDeleting ? "Deleting..." : "Delete Request"}
                  </button>
                )}

                {user?.role === "homeowner" && !isOwner && (
                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    You can only delete requests created by your own account.
                  </div>
                )}

                {job.status === "closed" && (
                  <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                    This request is already closed.
                  </div>
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

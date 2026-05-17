"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import JobCard from "@/components/JobCard";
import { getJobs } from "@/lib/api";
import { JobRequest } from "@/types/job";

const categories = [
  "All",
  "Plumbing",
  "Electrical",
  "Painting",
  "Joinery",
  "Other",
];
const statuses = ["All", "Open", "In Progress", "Closed"];


export default function HomePage() {
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("service_board_user");

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("service_board_token");
    localStorage.removeItem("service_board_user");
    setCurrentUser(null);
  }


  async function loadJobs() {
    try {
      setIsLoading(true);
      setError("");
      const data = await getJobs({ category, status });
      setJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load requests");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, [category, status]);

  const stats = useMemo(() => {
    return {
      total: jobs.length,
      open: jobs.filter((job) => job.status === "Open").length,
      progress: jobs.filter((job) => job.status === "In Progress").length,
      closed: jobs.filter((job) => job.status === "Closed").length,
    };
  }, [jobs]);

  function clearFilters() {
    setCategory("All");
    setStatus("All");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              <span className="hidden text-sm font-medium text-slate-600 sm:inline">
                Hi, {currentUser.name}
              </span>

              <button
                onClick={handleLogout}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Logout
              </button>

              <Link
                href="/jobs/new"
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                New Request
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full bg-indigo-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-indigo-700 ring-1 ring-indigo-100">
              Service Requests
            </span>

            <h2 className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Manage homeowner requests with clarity.
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Post service requests, track progress, and keep tradespeople
              updated through a simple full-stack request board.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/jobs/new"
                className="inline-flex justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Create Request
              </Link>
              <button
                onClick={clearFilters}
                className="inline-flex justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <StatCard label="Total Requests" value={stats.total} dark />
            <StatCard label="Open" value={stats.open} />
            <StatCard label="In Progress" value={stats.progress} amber />
            <StatCard label="Closed" value={stats.closed} />
          </div>
        </div>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h3 className="text-xl font-bold text-slate-950">
                Filter requests
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Narrow the list by trade category or current status.
              </p>
            </div>

            <p className="text-sm font-medium text-slate-500">
              Showing {jobs.length} request{jobs.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Category
              </label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Status
              </label>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              >
                {statuses.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {isLoading && (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="font-semibold text-slate-700">Loading requests...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <h3 className="text-lg font-bold text-red-700">
              Could not load requests
            </h3>
            <p className="mt-2 text-sm text-red-600">{error}</p>
            <button
              onClick={loadJobs}
              className="mt-5 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !error && jobs.length > 0 && (
          <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </section>
        )}

        {!isLoading && !error && jobs.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-slate-950">
              No requests found
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              There are no requests matching the current filters. Create a new
              request or clear the filters to see everything.
            </p>
            <Link
              href="/jobs/new"
              className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Create First Request
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  dark = false,
  amber = false,
}: {
  label: string;
  value: number;
  dark?: boolean;
  amber?: boolean;
}) {
  const styles = dark
    ? "bg-slate-950 text-white"
    : amber
      ? "bg-amber-50 text-amber-900 ring-1 ring-amber-100"
      : "bg-white text-slate-950 ring-1 ring-slate-200";

  return (
    <div className={`rounded-3xl p-6 shadow-sm ${styles}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="mt-3 text-4xl font-black">{value}</p>
    </div>
  );
}

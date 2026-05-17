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

  const statusCounts = jobs.reduce(
    (acc, job) => {
      acc[job.status] += 1;
      return acc;
    },
    {
      Open: 0,
      "In Progress": 0,
      Closed: 0,
    },
  );

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedStatus("All");
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 lg:space-y-10">
      <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.8fr)] xl:items-start">
          <div className="space-y-5">
            <div className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white">
              Service requests
            </div>
            <div className="space-y-3">
              <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Keep requests visible, clear, and moving.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base lg:text-lg">
                Track new work, spot what needs attention, and update progress
                in a few clicks.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/jobs/new"
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-transform hover:-translate-y-0.5"
              >
                Create request
              </Link>
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Clear filters
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-lg shadow-slate-950/10">
              <p className="text-sm text-slate-300">Total requests</p>
              <p className="mt-2 text-3xl font-semibold">{jobs.length}</p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5 text-sky-950">
              <p className="text-sm text-sky-700">Open</p>
              <p className="mt-2 text-3xl font-semibold">{statusCounts.Open}</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-emerald-950">
              <p className="text-sm text-emerald-700">Completed</p>
              <p className="mt-2 text-3xl font-semibold">
                {statusCounts.Closed}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">
              Filter requests
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Narrow the list by trade or status.
            </p>
          </div>
          <p className="text-sm text-slate-500">
            Showing {jobs.length} request{jobs.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="category"
              className="block text-sm font-semibold text-slate-900"
            >
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-slate-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-sky-500/30"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="status"
              className="block text-sm font-semibold text-slate-900"
            >
              Status
            </label>
            <select
              id="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-slate-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-sky-500/30"
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
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-700">
            Unable to load requests
          </p>
          <p className="mt-2 text-sm leading-6 text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="rounded-[2rem] border border-white/70 bg-white/85 py-16 text-center shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
          <div className="inline-block">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-100 border-t-sky-500"></div>
          </div>
          <p className="mt-4 text-base font-medium text-slate-600">
            Loading requests...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && jobs.length === 0 && !error && (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/85 px-6 py-14 text-center shadow-[0_18px_40px_rgba(15,23,42,0.05)] sm:px-10">
          <p className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            No requests yet
          </p>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600">
            There are no requests matching these filters. Create the first one
            or clear the filters to see everything.
          </p>
          <Link
            href="/jobs/new"
            className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-transform hover:-translate-y-0.5"
          >
            Create first request
          </Link>
        </div>
      )}

      {/* Jobs Grid */}
      {!loading && jobs.length > 0 && (
        <div>
          <p className="mb-6 text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
            Showing <span className="text-slate-900">{jobs.length}</span>{" "}
            request
            {jobs.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

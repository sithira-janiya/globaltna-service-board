"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import JobCard from "@/components/JobCard";
import StatusBadge from "@/components/StatusBadge";
import {
  createJob,
  deleteJob,
  getJobs,
  getStoredUser,
  logoutUser,
  markJobClosed,
  markJobInProgress,
} from "@/lib/api";
import {
  AuthUser,
  JobFilters,
  JobFormData,
  JobRequest,
  JobStatusFilter,
} from "@/types/job";

const initialFormData: JobFormData = {
  title: "",
  description: "",
  category: "",
  location: "",
};

const statusOptions: { label: string; value: JobStatusFilter }[] = [
  { label: "All Statuses", value: "All" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Closed", value: "closed" },
];

export default function HomePage() {
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [formData, setFormData] = useState<JobFormData>(initialFormData);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<JobStatusFilter>("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [locationFilter, setLocationFilter] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobRequest | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const totals = useMemo(() => {
    return {
      total: jobs.length,
      open: jobs.filter((job) => job.status === "open").length,
      inProgress: jobs.filter((job) => job.status === "in_progress").length,
      closed: jobs.filter((job) => job.status === "closed").length,
    };
  }, [jobs]);

  const categoryOptions = useMemo(() => {
    const categories = jobs
      .map((job) => job.category)
      .filter((category) => Boolean(category));

    return ["All", ...Array.from(new Set(categories)).sort()];
  }, [jobs]);

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    selectedStatus !== "All" ||
    selectedCategory !== "All" ||
    locationFilter.trim() !== "";

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      router.push("/login");
      return;
    }

    setUser(storedUser);
  }, [router]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      loadJobs({
        search: searchTerm,
        status: selectedStatus,
        category: selectedCategory,
        location: locationFilter,
      });
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [user, searchTerm, selectedStatus, selectedCategory, locationFilter]);

  async function loadJobs(filters?: JobFilters) {
    try {
      setLoading(true);
      setError("");

      const data = await getJobs(filters);
      setJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateJob(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user || user.role !== "homeowner") {
      setError("Only homeowners can create service requests");
      return;
    }

    try {
      setError("");

      await createJob(formData);

      setFormData(initialFormData);
      setShowForm(false);

      await loadJobs({
        search: searchTerm,
        status: selectedStatus,
        category: selectedCategory,
        location: locationFilter,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create request");
    }
  }

  async function handleMarkInProgress(id: string) {
    try {
      setError("");
      await markJobInProgress(id);

      await loadJobs({
        search: searchTerm,
        status: selectedStatus,
        category: selectedCategory,
        location: locationFilter,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update request");
    }
  }

  async function handleMarkClosed(id: string) {
    try {
      setError("");
      await markJobClosed(id);

      await loadJobs({
        search: searchTerm,
        status: selectedStatus,
        category: selectedCategory,
        location: locationFilter,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to close request");
    }
  }

  async function handleDelete(id: string) {
    try {
      setError("");
      await deleteJob(id);
      setSelectedJob(null);

      await loadJobs({
        search: searchTerm,
        status: selectedStatus,
        category: selectedCategory,
        location: locationFilter,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete request");
    }
  }

  function handleRefresh() {
    loadJobs({
      search: searchTerm,
      status: selectedStatus,
      category: selectedCategory,
      location: locationFilter,
    });
  }

  function handleClearFilters() {
    setSearchTerm("");
    setSelectedStatus("All");
    setSelectedCategory("All");
    setLocationFilter("");
  }

  function handleLogout() {
    logoutUser();
    router.push("/login");
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-lg font-bold text-white shadow-sm">
              SB
            </div>

            <div>
              <p className="text-sm font-black uppercase tracking-[0.4em] text-indigo-600">
                Operations
              </p>
              <h1 className="text-2xl font-black">Service Board</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold text-slate-950">{user.name}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {user.role}
              </p>
            </div>

            {user.role === "homeowner" && (
              <button
                onClick={() => setShowForm(true)}
                className="rounded-2xl bg-indigo-600 px-5 py-3 font-bold text-white shadow-sm hover:bg-indigo-700"
              >
                New Request
              </button>
            )}

            <button
              onClick={handleLogout}
              className="rounded-2xl border border-slate-300 px-5 py-3 font-bold text-slate-700 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div className="pt-8">
          <div className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-5 py-2 text-sm font-black uppercase tracking-[0.4em] text-indigo-600">
            Service Requests
          </div>

          <h2 className="mt-8 max-w-3xl text-5xl font-black leading-tight tracking-tight sm:text-6xl">
            Find the right request faster.
          </h2>

          <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-600">
            Search by request title, description, homeowner name, or location.
            Filter requests by status, category, and location in real time.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            {user.role === "homeowner" && (
              <button
                onClick={() => setShowForm(true)}
                className="rounded-2xl bg-indigo-600 px-6 py-4 font-bold text-white shadow-sm hover:bg-indigo-700"
              >
                Create Request
              </button>
            )}

            <button
              onClick={handleRefresh}
              className="rounded-2xl border border-slate-300 bg-white px-6 py-4 font-bold text-slate-700 hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>

          {error && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 font-semibold text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <SummaryCard title="Results Showing" value={totals.total} dark />
          <SummaryCard title="Open" value={totals.open} />
          <SummaryCard title="In Progress" value={totals.inProgress} warning />
          <SummaryCard title="Closed" value={totals.closed} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_auto] lg:items-end">
            <div>
              <label className="text-sm font-bold text-slate-700">
                Search requests
              </label>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search title, description, homeowner, location..."
                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">Status</label>
              <select
                value={selectedStatus}
                onChange={(event) =>
                  setSelectedStatus(event.target.value as JobStatusFilter)
                }
                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category === "All" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Location
              </label>
              <input
                type="search"
                value={locationFilter}
                onChange={(event) => setLocationFilter(event.target.value)}
                placeholder="Glasgow"
                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="button"
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
              className="rounded-2xl border border-slate-300 px-5 py-3 font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="font-bold text-slate-800">
              {loading ? "Searching..." : `${jobs.length} result(s) found`}
            </span>

            {hasActiveFilters && (
              <span className="rounded-full bg-indigo-50 px-3 py-1 font-semibold text-indigo-700">
                Filters active
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center font-bold text-slate-600">
            Loading requests...
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
            <h3 className="text-2xl font-black">No matching requests</h3>
            <p className="mt-2 text-slate-600">
              Try clearing filters or searching another keyword.
            </p>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="mt-5 rounded-2xl bg-indigo-600 px-5 py-3 font-bold text-white hover:bg-indigo-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                user={user}
                searchTerm={searchTerm}
                onMarkInProgress={handleMarkInProgress}
                onMarkClosed={handleMarkClosed}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>

      {showForm && user.role === "homeowner" && (
        <Modal
          title="Create Service Request"
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={handleCreateJob} className="space-y-5">
            <Input
              label="Title"
              value={formData.title}
              onChange={(value) =>
                setFormData((current) => ({ ...current, title: value }))
              }
              placeholder="Need a plumber for a leaking kitchen tap"
            />

            <Input
              label="Category"
              value={formData.category}
              onChange={(value) =>
                setFormData((current) => ({ ...current, category: value }))
              }
              placeholder="Plumbing"
            />

            <Input
              label="Location"
              value={formData.location}
              onChange={(value) =>
                setFormData((current) => ({ ...current, location: value }))
              }
              placeholder="Glasgow"
            />

            <div>
              <label className="text-sm font-bold text-slate-700">
                Description
              </label>
              <textarea
                className="mt-2 min-h-32 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                value={formData.description}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Explain the service issue clearly..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-indigo-600 px-5 py-3 font-bold text-white hover:bg-indigo-700"
            >
              Post Request
            </button>
          </form>
        </Modal>
      )}

      {selectedJob && (
        <Modal title="Request Details" onClose={() => setSelectedJob(null)}>
          <div className="space-y-4">
            <StatusBadge status={selectedJob.status} />

            <h3 className="text-3xl font-black">{selectedJob.title}</h3>

            <p className="text-slate-600">{selectedJob.description}</p>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p>
                <strong>Category:</strong> {selectedJob.category}
              </p>
              <p>
                <strong>Location:</strong> {selectedJob.location}
              </p>
              {selectedJob.homeowner && (
                <p>
                  <strong>Homeowner:</strong> {selectedJob.homeowner.name}
                </p>
              )}
              {selectedJob.assignedTradesperson && (
                <p>
                  <strong>Tradesperson:</strong>{" "}
                  {selectedJob.assignedTradesperson.name}
                </p>
              )}
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}

function SummaryCard({
  title,
  value,
  dark,
  warning,
}: {
  title: string;
  value: number;
  dark?: boolean;
  warning?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-3xl border p-8 shadow-sm",
        dark
          ? "border-slate-950 bg-slate-950 text-white"
          : warning
            ? "border-amber-200 bg-amber-50 text-amber-900"
            : "border-slate-200 bg-white text-slate-950",
      ].join(" ")}
    >
      <p className="font-bold opacity-80">{title}</p>
      <p className="mt-5 text-5xl font-black">{value}</p>
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-black">{title}</h2>

          <button
            onClick={onClose}
            className="rounded-full border border-slate-300 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-slate-700">{label}</label>
      <input
        type="text"
        className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required
      />
    </div>
  );
}

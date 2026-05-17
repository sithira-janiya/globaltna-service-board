"use client";

import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { AuthUser, JobRequest } from "@/types/job";

type JobCardProps = {
  job: JobRequest;
  user: AuthUser;
  searchTerm?: string;
  onMarkInProgress?: (id: string) => void;
  onMarkClosed?: (id: string) => void;
  onDelete?: (id: string) => void;
};

function getOwnerId(job: JobRequest) {
  return job.homeowner?._id || job.homeowner?.id;
}

function getAssignedTradespersonId(job: JobRequest) {
  return job.assignedTradesperson?._id || job.assignedTradesperson?.id;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function HighlightText({
  text,
  searchTerm,
}: {
  text: string;
  searchTerm?: string;
}) {
  if (!searchTerm || searchTerm.trim() === "") {
    return <>{text}</>;
  }

  const safeSearch = searchTerm.trim();

  if (!safeSearch) {
    return <>{text}</>;
  }

  const parts = text.split(new RegExp(`(${escapeRegExp(safeSearch)})`, "gi"));

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === safeSearch.toLowerCase() ? (
          <mark
            key={`${part}-${index}`}
            className="rounded bg-yellow-200 px-1 text-slate-950"
          >
            {part}
          </mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        ),
      )}
    </>
  );
}

export default function JobCard({
  job,
  user,
  searchTerm,
  onMarkInProgress,
  onMarkClosed,
  onDelete,
}: JobCardProps) {
  const ownerId = getOwnerId(job);
  const assignedTradespersonId = getAssignedTradespersonId(job);

  const isOwner = user.role === "homeowner" && ownerId === user.id;

  const isAssignedTradesperson =
    user.role === "tradesperson" && assignedTradespersonId === user.id;

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-indigo-600">
            {job.category}
          </p>

          <h3 className="mt-3 text-2xl font-black text-slate-950">
            <HighlightText text={job.title} searchTerm={searchTerm} />
          </h3>
        </div>

        <StatusBadge status={job.status} />
      </div>

      <p className="mt-4 line-clamp-3 text-slate-600">
        <HighlightText text={job.description} searchTerm={searchTerm} />
      </p>

      <p className="mt-5 font-bold text-slate-800">
        Location: <HighlightText text={job.location} searchTerm={searchTerm} />
      </p>

      <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 ring-1 ring-slate-200">
        <p>
          <span className="font-bold text-slate-800">Contact:</span>{" "}
          <HighlightText text={job.contactName} searchTerm={searchTerm} />
        </p>
        <p className="mt-1">
          <span className="font-bold text-slate-800">Email:</span>{" "}
          <HighlightText text={job.contactEmail} searchTerm={searchTerm} />
        </p>
      </div>

      {job.homeowner && (
        <p className="mt-3 text-sm text-slate-500">
          Posted by:{" "}
          <HighlightText text={job.homeowner.name} searchTerm={searchTerm} />
        </p>
      )}

      {job.assignedTradesperson && (
        <p className="mt-1 text-sm text-slate-500">
          Assigned to: {job.assignedTradesperson.name}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/jobs/${job._id}`}
          className="rounded-2xl border border-slate-300 px-4 py-2 font-bold text-slate-700 hover:bg-slate-50"
        >
          View Details
        </Link>

        {user.role === "tradesperson" && job.status === "Open" && (
          <button
            type="button"
            onClick={() => onMarkInProgress?.(job._id)}
            className="rounded-2xl bg-amber-500 px-4 py-2 font-bold text-white hover:bg-amber-600"
          >
            Mark In Progress
          </button>
        )}

        {user.role === "tradesperson" &&
          job.status === "In Progress" &&
          isAssignedTradesperson && (
            <button
              type="button"
              onClick={() => onMarkClosed?.(job._id)}
              className="rounded-2xl bg-emerald-600 px-4 py-2 font-bold text-white hover:bg-emerald-700"
            >
              Mark Closed
            </button>
          )}

        {isOwner && (
          <button
            type="button"
            onClick={() => onDelete?.(job._id)}
            className="rounded-2xl bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
          >
            Delete
          </button>
        )}
      </div>
    </article>
  );
}

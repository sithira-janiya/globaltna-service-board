"use client";

import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { AuthUser, JobRequest } from "@/types/job";

type JobCardProps = {
  job: JobRequest;
  user: AuthUser;
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

export default function JobCard({
  job,
  user,
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
            {job.title}
          </h3>
        </div>

        <StatusBadge status={job.status} />
      </div>

      <p className="mt-4 line-clamp-3 text-slate-600">{job.description}</p>

      <p className="mt-5 font-bold text-slate-800">Location: {job.location}</p>

      {job.homeowner && (
        <p className="mt-2 text-sm text-slate-500">
          Posted by: {job.homeowner.name}
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

        {user.role === "tradesperson" && job.status === "open" && (
          <button
            type="button"
            onClick={() => onMarkInProgress?.(job._id)}
            className="rounded-2xl bg-amber-500 px-4 py-2 font-bold text-white hover:bg-amber-600"
          >
            Mark In Progress
          </button>
        )}

        {user.role === "tradesperson" &&
          job.status === "in_progress" &&
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

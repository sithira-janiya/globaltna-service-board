"use client";

import Link from "next/link";
import { Job } from "@/types/job";
import StatusBadge from "./StatusBadge";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/jobs/${job._id}`}>
      <div className="group flex h-full flex-col rounded-3xl border border-white/70 bg-white/95 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(15,23,42,0.12)]">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h3 className="min-w-0 flex-1 break-words text-xl font-semibold tracking-tight text-slate-900">
            {job.title}
          </h3>
          <StatusBadge status={job.status} />
        </div>

        <p className="mb-4 break-words text-sm leading-6 text-slate-600">
          {job.description}
        </p>

        <div className="mb-5 flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200">
            {job.category}
          </span>
        </div>

        <div className="mt-auto space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
          {job.location && (
            <p className="font-medium">
              <span className="text-slate-400">Location:</span> {job.location}
            </p>
          )}
          {job.contactName && (
            <p className="font-medium">
              <span className="text-slate-400">Contact:</span> {job.contactName}
            </p>
          )}
          <p className="pt-2 text-xs text-slate-400">
            Created {new Date(job.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="mt-5 text-sm font-semibold text-slate-900 opacity-80 transition-opacity group-hover:opacity-100">
          View request details →
        </div>
      </div>
    </Link>
  );
}

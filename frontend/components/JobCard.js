"use client";

import Link from "next/link";
import StatusBadge from "./StatusBadge";

export default function JobCard({ job }) {
  return (
    <Link href={`/jobs/${job._id}`}>
      <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1">
            {job.title}
          </h3>
          <StatusBadge status={job.status} />
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
            {job.category}
          </span>
        </div>

        <div className="text-sm text-gray-500 space-y-1">
          {job.location && (
            <p>
              <span className="font-semibold">Location:</span> {job.location}
            </p>
          )}
          {job.contactName && (
            <p>
              <span className="font-semibold">Contact:</span> {job.contactName}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-3">
            {new Date(job.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
}

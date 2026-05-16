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
      <div className="block p-6 bg-white border-2 border-gray-100 rounded-2xl shadow-md hover:shadow-2xl hover:border-blue-300 transition-all cursor-pointer h-full duration-300 hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4 gap-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1">
            {job.title}
          </h3>
          <StatusBadge status={job.status} />
        </div>

        <p className="text-gray-700 text-base mb-4 line-clamp-2 font-medium">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 text-xs font-bold rounded-full border border-blue-200">
            {job.category}
          </span>
        </div>

        <div className="text-sm text-gray-600 space-y-2 border-t border-gray-200 pt-4">
          {job.location && (
            <p className="font-medium">
              📍{" "}
              <span className="font-semibold text-gray-900">
                {job.location}
              </span>
            </p>
          )}
          {job.contactName && (
            <p className="font-medium">
              👤{" "}
              <span className="font-semibold text-gray-900">
                {job.contactName}
              </span>
            </p>
          )}
          <p className="text-xs text-gray-500 pt-2">
            📅 {new Date(job.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
}

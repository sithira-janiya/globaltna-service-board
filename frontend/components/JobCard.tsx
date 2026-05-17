import Link from "next/link";
import { JobRequest } from "@/types/job";
import StatusBadge from "./StatusBadge";

interface JobCardProps {
  job: JobRequest;
}

function formatDate(date?: string) {
  if (!date) return "Recently added";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            {job.category}
          </span>
          <h3 className="mt-3 line-clamp-2 text-lg font-bold text-slate-950">
            {job.title}
          </h3>
        </div>

        <StatusBadge status={job.status} />
      </div>

      <p className="line-clamp-3 text-sm leading-6 text-slate-600">
        {job.description}
      </p>

      <div className="mt-5 space-y-2 text-sm text-slate-600">
        <p>
          <span className="font-semibold text-slate-800">Location:</span>{" "}
          {job.location || "Not specified"}
        </p>
        <p>
          <span className="font-semibold text-slate-800">Contact:</span>{" "}
          {job.contactName || "Not specified"}
        </p>
        <p>
          <span className="font-semibold text-slate-800">Created:</span>{" "}
          {formatDate(job.createdAt)}
        </p>
      </div>

      <Link
        href={`/jobs/${job._id}`}
        className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        View Details
      </Link>
    </article>
  );
}

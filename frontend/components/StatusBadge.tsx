"use client";

import { Job } from "@/types/job";

interface StatusBadgeProps {
  status: Job["status"];
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusStyles: Record<Job["status"], string> = {
    Open: "bg-sky-50 text-sky-800 ring-1 ring-inset ring-sky-200",
    "In Progress":
      "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200",
    Closed: "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-200",
  };

  const style =
    statusStyles[status] ||
    "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide ${style}`}
    >
      {status}
    </span>
  );
}

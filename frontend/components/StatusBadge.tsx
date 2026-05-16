"use client";

import { Job } from "@/types/job";

interface StatusBadgeProps {
  status: Job["status"];
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusStyles: Record<Job["status"], string> = {
    Open: "bg-blue-100 text-blue-900 border-2 border-blue-300",
    "In Progress": "bg-yellow-100 text-yellow-900 border-2 border-yellow-300",
    Closed: "bg-green-100 text-green-900 border-2 border-green-300",
  };

  const style =
    statusStyles[status] ||
    "bg-gray-100 text-gray-900 border-2 border-gray-300";

  return (
    <span
      className={`inline-block px-4 py-2 text-sm font-bold rounded-full ${style}`}
    >
      {status}
    </span>
  );
}

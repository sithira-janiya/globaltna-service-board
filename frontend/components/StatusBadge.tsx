import { JobStatus } from "@/types/job";

interface StatusBadgeProps {
  status: JobStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<JobStatus, string> = {
    Open: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    "In Progress": "bg-amber-100 text-amber-700 ring-amber-200",
    Closed: "bg-slate-100 text-slate-700 ring-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${styles[status]}`}
    >
      {status}
    </span>
  );
}

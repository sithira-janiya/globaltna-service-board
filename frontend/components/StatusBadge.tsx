import { JobStatus } from "@/types/job";

export default function StatusBadge({ status }: { status: JobStatus }) {
  const label =
    status === "in_progress"
      ? "In Progress"
      : status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={[
        "inline-flex rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider",
        status === "open"
          ? "bg-blue-50 text-blue-700"
          : status === "in_progress"
            ? "bg-amber-50 text-amber-700"
            : "bg-emerald-50 text-emerald-700",
      ].join(" ")}
    >
      {label}
    </span>
  );
}

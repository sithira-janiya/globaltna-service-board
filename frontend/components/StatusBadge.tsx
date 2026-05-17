import { JobStatus } from "@/types/job";

export default function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider",
        status === "Open"
          ? "bg-blue-50 text-blue-700"
          : status === "In Progress"
            ? "bg-amber-50 text-amber-700"
            : "bg-emerald-50 text-emerald-700",
      ].join(" ")}
    >
      {status}
    </span>
  );
}

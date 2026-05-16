"use client";

export default function StatusBadge({ status }) {
  const statusStyles = {
    Open: "bg-blue-100 text-blue-800",
    "In Progress": "bg-yellow-100 text-yellow-800",
    Closed: "bg-green-100 text-green-800",
  };

  const style = statusStyles[status] || "bg-gray-100 text-gray-800";

  return (
    <span
      className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${style}`}
    >
      {status}
    </span>
  );
}

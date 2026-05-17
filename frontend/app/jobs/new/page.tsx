import JobForm from "@/components/JobForm";

export const metadata = {
  title: "Create Request - Service Board",
  description:
    "Submit a new service request and capture the important details.",
};

export default function NewJobPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)] sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
          New request
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          Create a service request
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
          Add the problem, location, and contact details so the right person can
          act on it quickly.
        </p>
      </div>

      <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:p-10">
        <JobForm />
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import JobForm from "@/components/JobForm";
import { createJob } from "@/lib/api";
import { JobFormData } from "@/types/job";

export default function NewJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleCreateJob(data: JobFormData) {
    try {
      setIsSubmitting(true);
      setError("");
      await createJob(data);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create request");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="font-bold text-slate-950">
            ← Service Board
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="inline-flex rounded-full bg-indigo-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-indigo-700">
            New Request
          </span>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950">
            Create service request
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Add the homeowner request details so tradespeople can review and
            manage the work.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <JobForm onSubmit={handleCreateJob} isSubmitting={isSubmitting} />
      </section>
    </main>
  );
}

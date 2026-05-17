"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { jobApi } from "@/lib/api";
import { CreateJobInput, Job } from "@/types/job";

const CATEGORIES: Job["category"][] = [
  "Plumbing",
  "Electrical",
  "Painting",
  "Joinery",
  "Other",
];

interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  contactEmail?: string;
}

export default function JobForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState<CreateJobInput>({
    title: "",
    description: "",
    category: "Plumbing",
    location: "",
    contactName: "",
    contactEmail: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (
      formData.contactEmail &&
      formData.contactEmail.trim() &&
      !validateEmail(formData.contactEmail)
    ) {
      newErrors.contactEmail = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const result = await jobApi.createJob(formData);

    if (result.success) {
      setSuccessMessage("Job created successfully! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } else {
      setErrorMessage(result.error || "Failed to create job");
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
            Something went wrong
          </p>
          <p className="mt-2 text-sm leading-6 text-red-800">{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Ready
          </p>
          <p className="mt-2 text-sm leading-6 text-emerald-800">
            {successMessage}
          </p>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="mb-6 border-b border-slate-100 pb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            Request details
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Add the essentials so the request is clear at a glance.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-slate-900"
          >
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Fix kitchen sink"
            className={`w-full rounded-2xl border px-5 py-3 text-slate-900 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500/30 ${
              errors.title
                ? "border-red-300 bg-red-50"
                : "border-slate-200 bg-slate-50/60"
            }`}
          />
          {errors.title && (
            <p className="text-sm font-medium text-red-600">{errors.title}</p>
          )}
          <p className="text-xs text-slate-500">Keep it short and specific.</p>
        </div>

        <div className="mt-6 space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-slate-900"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the job in detail..."
            rows={5}
            className={`w-full resize-none rounded-2xl border px-5 py-3 text-slate-900 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500/30 ${
              errors.description
                ? "border-red-300 bg-red-50"
                : "border-slate-200 bg-slate-50/60"
            }`}
          />
          {errors.description && (
            <p className="text-sm font-medium text-red-600">
              {errors.description}
            </p>
          )}
          <p className="text-xs text-slate-500">
            Mention the issue, the room or area, and any access notes.
          </p>
        </div>

        <div className="mt-6 space-y-2">
          <label
            htmlFor="category"
            className="block text-sm font-semibold text-slate-900"
          >
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full rounded-2xl border px-5 py-3 text-slate-900 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500/30 ${
              errors.category
                ? "border-red-300 bg-red-50"
                : "border-slate-200 bg-slate-50/60"
            }`}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-sm font-medium text-red-600">
              {errors.category}
            </p>
          )}
        </div>

        <div className="mt-6 space-y-2">
          <label
            htmlFor="location"
            className="block text-sm font-semibold text-slate-900"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Kitchen"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-5 py-3 text-slate-900 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          />
          <p className="text-xs text-slate-500">
            Optional, but useful for routing the request quickly.
          </p>
        </div>

        <div className="mt-6 space-y-2">
          <label
            htmlFor="contactName"
            className="block text-sm font-semibold text-slate-900"
          >
            Contact Name
          </label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            placeholder="e.g., John Smith"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-5 py-3 text-slate-900 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          />
        </div>

        <div className="mt-6 space-y-2">
          <label
            htmlFor="contactEmail"
            className="block text-sm font-semibold text-slate-900"
          >
            Contact Email
          </label>
          <input
            type="email"
            id="contactEmail"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            placeholder="e.g., john@example.com"
            className={`w-full rounded-2xl border px-5 py-3 text-slate-900 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500/30 ${
              errors.contactEmail
                ? "border-red-300 bg-red-50"
                : "border-slate-200 bg-slate-50/60"
            }`}
          />
          {errors.contactEmail && (
            <p className="text-sm font-medium text-red-600">
              {errors.contactEmail}
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 rounded-2xl px-6 py-4 text-base font-semibold text-white transition-all ${
              isSubmitting
                ? "cursor-not-allowed bg-slate-300"
                : "bg-slate-900 shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 hover:bg-slate-800"
            }`}
          >
            {isSubmitting ? "Creating..." : "Create request"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex-1 rounded-2xl bg-slate-100 px-6 py-4 text-base font-semibold text-slate-900 transition-all hover:bg-slate-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}

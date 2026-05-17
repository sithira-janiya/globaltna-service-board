"use client";

import { useState } from "react";
import Link from "next/link";
import { JobCategory, JobFormData } from "@/types/job";

const categories: JobCategory[] = [
  "Plumbing",
  "Electrical",
  "Painting",
  "Joinery",
  "Other",
];

interface JobFormProps {
  onSubmit: (data: JobFormData) => Promise<void>;
  isSubmitting?: boolean;
}

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

export default function JobForm({
  onSubmit,
  isSubmitting = false,
}: JobFormProps) {
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    description: "",
    category: "Plumbing",
    location: "",
    contactName: "",
    contactEmail: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof JobFormData, string>>
  >({});

  function validate() {
    const nextErrors: Partial<Record<keyof JobFormData, string>> = {};

    if (!formData.title.trim()) {
      nextErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      nextErrors.description = "Description is required";
    }

    if (!formData.location.trim()) {
      nextErrors.location = "Location is required";
    }

    if (!formData.contactName.trim()) {
      nextErrors.contactName = "Contact name is required";
    }

    if (!formData.contactEmail.trim()) {
      nextErrors.contactEmail = "Contact email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.contactEmail)) {
      nextErrors.contactEmail = "Enter a valid email address";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) return;

    await onSubmit(formData);
  }

  function updateField(field: keyof JobFormData, value: string) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            Request title
          </label>
          <input
            className={inputClass}
            value={formData.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Need a plumber for a leaking kitchen tap"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            Category
          </label>
          <select
            className={inputClass}
            value={formData.category}
            onChange={(event) =>
              updateField("category", event.target.value as JobCategory)
            }
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            Location
          </label>
          <input
            className={inputClass}
            value={formData.location}
            onChange={(event) => updateField("location", event.target.value)}
            placeholder="Glasgow"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            Contact name
          </label>
          <input
            className={inputClass}
            value={formData.contactName}
            onChange={(event) => updateField("contactName", event.target.value)}
            placeholder="John Smith"
          />
          {errors.contactName && (
            <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            Contact email
          </label>
          <input
            className={inputClass}
            value={formData.contactEmail}
            onChange={(event) =>
              updateField("contactEmail", event.target.value)
            }
            placeholder="john@example.com"
          />
          {errors.contactEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            Description
          </label>
          <textarea
            className={`${inputClass} min-h-36 resize-y`}
            value={formData.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Describe the issue clearly..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/"
          className="inline-flex justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating..." : "Create Request"}
        </button>
      </div>
    </form>
  );
}

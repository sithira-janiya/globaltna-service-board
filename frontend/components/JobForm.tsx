"use client";

import { FormEvent, useState } from "react";
import { JobFormData } from "@/types/job";

const initialFormData: JobFormData = {
  title: "",
  description: "",
  category: "",
  location: "",
  contactName: "",
  contactEmail: "",
};

const requestCategoryOptions = [
  "Plumbing",
  "Electrical",
  "Painting",
  "Joinery",
  "Other",
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormErrors = Partial<Record<keyof JobFormData, string>>;

type JobFormProps = {
  onSubmit: (data: JobFormData) => Promise<void> | void;
  onCancel?: () => void;
  isSubmitting?: boolean;
};

function validateForm(data: JobFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.title.trim()) {
    errors.title = "Title is required";
  }

  if (!data.category.trim()) {
    errors.category = "Category is required";
  }

  if (!data.location.trim()) {
    errors.location = "Location is required";
  }

  if (!data.contactName.trim()) {
    errors.contactName = "Contact name is required";
  }

  if (!data.contactEmail.trim()) {
    errors.contactEmail = "Contact email is required";
  } else if (!emailRegex.test(data.contactEmail.trim())) {
    errors.contactEmail = "Enter a valid email address";
  }

  if (!data.description.trim()) {
    errors.description = "Description is required";
  }

  return errors;
}

export default function JobForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: JobFormProps) {
  const [formData, setFormData] = useState<JobFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  function updateField(field: keyof JobFormData, value: string) {
    setFormData((current) => ({ ...current, [field]: value }));

    setErrors((current) => {
      const updatedErrors = { ...current };
      delete updatedErrors[field];
      return updatedErrors;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    await onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      location: formData.location.trim(),
      contactName: formData.contactName.trim(),
      contactEmail: formData.contactEmail.trim().toLowerCase(),
    });

    setFormData(initialFormData);
    setErrors({});
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Input
        label="Title"
        value={formData.title}
        onChange={(value) => updateField("title", value)}
        placeholder="Need a plumber for a leaking kitchen tap"
        error={errors.title}
      />

      <Select
        label="Category"
        value={formData.category}
        onChange={(value) => updateField("category", value)}
        options={requestCategoryOptions}
        placeholder="Select a category"
        error={errors.category}
      />

      <Input
        label="Location"
        value={formData.location}
        onChange={(value) => updateField("location", value)}
        placeholder="Glasgow"
        error={errors.location}
      />

      <Input
        label="Contact Name"
        value={formData.contactName}
        onChange={(value) => updateField("contactName", value)}
        placeholder="Kasuni Disara"
        error={errors.contactName}
      />

      <Input
        label="Contact Email"
        type="email"
        value={formData.contactEmail}
        onChange={(value) => updateField("contactEmail", value)}
        placeholder="kasuni.disara@example.com"
        error={errors.contactEmail}
      />

      <div>
        <label className="text-sm font-bold text-slate-700">Description</label>

        <textarea
          className={[
            "mt-2 min-h-32 w-full rounded-2xl border px-4 py-3 outline-none",
            errors.description
              ? "border-red-300 bg-red-50 focus:border-red-500"
              : "border-slate-300 focus:border-indigo-500",
          ].join(" ")}
          value={formData.description}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Explain the service issue clearly..."
        />

        {errors.description && (
          <p className="mt-2 text-sm font-semibold text-red-600">
            {errors.description}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-2xl bg-indigo-600 px-5 py-3 font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Post Request"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-2xl border border-slate-300 px-5 py-3 font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-slate-700">{label}</label>

      <input
        type={type}
        className={[
          "mt-2 w-full rounded-2xl border px-4 py-3 outline-none",
          error
            ? "border-red-300 bg-red-50 focus:border-red-500"
            : "border-slate-300 focus:border-indigo-500",
        ].join(" ")}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />

      {error && (
        <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  error?: string;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-slate-700">{label}</label>

      <select
        className={[
          "mt-2 w-full rounded-2xl border bg-white px-4 py-3 outline-none",
          error
            ? "border-red-300 bg-red-50 focus:border-red-500"
            : "border-slate-300 focus:border-indigo-500",
        ].join(" ")}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>
      )}
    </div>
  );
}

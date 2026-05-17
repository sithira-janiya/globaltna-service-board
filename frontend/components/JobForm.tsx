"use client";

import { FormEvent, useState } from "react";
import { JobFormData } from "@/types/job";

const initialFormData: JobFormData = {
  title: "",
  description: "",
  category: "",
  location: "",
};

type JobFormProps = {
  onSubmit: (data: JobFormData) => Promise<void> | void;
  onCancel?: () => void;
  isSubmitting?: boolean;
};

export default function JobForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: JobFormProps) {
  const [formData, setFormData] = useState<JobFormData>(initialFormData);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onSubmit(formData);

    setFormData(initialFormData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Title"
        value={formData.title}
        onChange={(value) =>
          setFormData((current) => ({ ...current, title: value }))
        }
        placeholder="Need a plumber for a leaking kitchen tap"
      />

      <Input
        label="Category"
        value={formData.category}
        onChange={(value) =>
          setFormData((current) => ({ ...current, category: value }))
        }
        placeholder="Plumbing"
      />

      <Input
        label="Location"
        value={formData.location}
        onChange={(value) =>
          setFormData((current) => ({ ...current, location: value }))
        }
        placeholder="Glasgow"
      />

      <div>
        <label className="text-sm font-bold text-slate-700">Description</label>

        <textarea
          className="mt-2 min-h-32 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
          value={formData.description}
          onChange={(event) =>
            setFormData((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
          placeholder="Explain the service issue clearly..."
          required
        />
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
            className="rounded-2xl border border-slate-300 px-5 py-3 font-bold text-slate-700 hover:bg-slate-50"
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-slate-700">{label}</label>

      <input
        type="text"
        className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required
      />
    </div>
  );
}

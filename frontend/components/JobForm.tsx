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

    if (formData.contactEmail && formData.contactEmail.trim() && !validateEmail(formData.contactEmail)) {
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* Error Message */}
      {errorMessage && (
        <div className="p-5 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <p className="text-red-900 font-bold text-lg">⚠️ Error</p>
          <p className="text-red-700 mt-2">{errorMessage}</p>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="p-5 bg-green-50 border-l-4 border-green-500 rounded-lg">
          <p className="text-green-900 font-bold text-lg">✅ Success!</p>
          <p className="text-green-700 mt-2">{successMessage}</p>
        </div>
      )}

      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-lg font-bold text-gray-900 mb-3"
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
          className={`w-full px-5 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium transition ${
            errors.title
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-white"
          }`}
        />
        {errors.title && (
          <p className="text-red-600 text-sm mt-2 font-medium">
            {errors.title}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-lg font-bold text-gray-900 mb-3"
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
          className={`w-full px-5 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium resize-none transition ${
            errors.description
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-white"
          }`}
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-2 font-medium">
            {errors.description}
          </p>
        )}
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="category"
          className="block text-lg font-bold text-gray-900 mb-3"
        >
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`w-full px-5 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium transition ${
            errors.category
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-white"
          }`}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-600 text-sm mt-2 font-medium">
            {errors.category}
          </p>
        )}
      </div>

      {/* Location */}
      <div>
        <label
          htmlFor="location"
          className="block text-lg font-bold text-gray-900 mb-3"
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
          className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium bg-white transition"
        />
      </div>

      {/* Contact Name */}
      <div>
        <label
          htmlFor="contactName"
          className="block text-lg font-bold text-gray-900 mb-3"
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
          className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium bg-white transition"
        />
      </div>

      {/* Contact Email */}
      <div>
        <label
          htmlFor="contactEmail"
          className="block text-lg font-bold text-gray-900 mb-3"
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
          className={`w-full px-5 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium transition ${
            errors.contactEmail
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-white"
          }`}
        />
        {errors.contactEmail && (
          <p className="text-red-600 text-sm mt-2 font-medium">
            {errors.contactEmail}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex-1 py-4 px-6 rounded-xl font-bold text-white text-lg transition-all ${
            isSubmitting
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg hover:from-blue-700 hover:to-blue-800"
          }`}
        >
          {isSubmitting ? "🔄 Creating..." : "✨ Create Job"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex-1 py-4 px-6 rounded-xl font-bold text-gray-900 bg-gray-200 hover:bg-gray-300 transition-all text-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export type JobStatus = "Open" | "In Progress" | "Closed";

export type JobCategory =
  | "Plumbing"
  | "Electrical"
  | "Painting"
  | "Joinery"
  | "Other";

export interface JobRequest {
  _id: string;
  title: string;
  description: string;
  category: JobCategory;
  location?: string;
  contactName?: string;
  contactEmail?: string;
  status: JobStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobFormData {
  title: string;
  description: string;
  category: JobCategory;
  location: string;
  contactName: string;
  contactEmail: string;
}

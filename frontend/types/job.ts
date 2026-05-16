export interface Job {
  _id: string;
  title: string;
  description: string;
  category: "Plumbing" | "Electrical" | "Painting" | "Joinery" | "Other";
  location?: string;
  contactName?: string;
  contactEmail?: string;
  status: "Open" | "In Progress" | "Closed";
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
  errors?: string[];
}

export interface CreateJobInput {
  title: string;
  description: string;
  category: Job["category"];
  location?: string;
  contactName?: string;
  contactEmail?: string;
}

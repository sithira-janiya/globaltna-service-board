import {
  AuthResponse,
  JobFormData,
  JobRequest,
  JobStatus,
  LoginData,
  RegisterData,
} from "@/types/job";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") {
    return {};
  }

  const token = localStorage.getItem("service_board_token");

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result.data as T;
}

export async function getJobs(params?: {
  category?: string;
  status?: string;
}): Promise<JobRequest[]> {
  const query = new URLSearchParams();

  if (params?.category && params.category !== "All") {
    query.append("category", params.category);
  }

  if (params?.status && params.status !== "All") {
    query.append("status", params.status);
  }

  const url = `${API_BASE_URL}/jobs${
    query.toString() ? `?${query.toString()}` : ""
  }`;

  const response = await fetch(url, {
    cache: "no-store",
  });

  return handleResponse<JobRequest[]>(response);
}

export async function getJobById(id: string): Promise<JobRequest> {
  const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
    cache: "no-store",
  });

  return handleResponse<JobRequest>(response);
}

export async function createJob(data: JobFormData): Promise<JobRequest> {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  return handleResponse<JobRequest>(response);
}

export async function updateJobStatus(
  id: string,
  status: JobStatus,
): Promise<JobRequest> {
  const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status }),
  });

  return handleResponse<JobRequest>(response);
}

export async function deleteJob(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || "Failed to delete job");
  }
}

export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<AuthResponse>(response);
}

export async function loginUser(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<AuthResponse>(response);
}

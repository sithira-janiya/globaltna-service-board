import {
  AuthResponse,
  AuthUser,
  JobFilters,
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
    return {
      "Content-Type": "application/json",
    };
  }

  const token = localStorage.getItem("service_board_token");

  return token
    ? {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    : {
        "Content-Type": "application/json",
      };
}

async function handleResponse<T>(response: Response): Promise<T> {
  let result: any = null;

  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    throw new Error(result?.message || "Something went wrong");
  }

  return result?.data ?? result;
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = localStorage.getItem("service_board_user");

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    logoutUser();
    return null;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("service_board_token");
}

export function isLoggedIn(): boolean {
  return Boolean(getStoredToken());
}

export function logoutUser() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("service_board_token");
  localStorage.removeItem("service_board_user");
}

function storeAuthSession(result: AuthResponse) {
  localStorage.setItem("service_board_token", result.token);
  localStorage.setItem("service_board_user", JSON.stringify(result.user));
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await handleResponse<AuthResponse>(response);
  storeAuthSession(result);

  return result;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await handleResponse<AuthResponse>(response);
  storeAuthSession(result);

  return result;
}

export async function getJobs(filters?: JobFilters): Promise<JobRequest[]> {
  const query = new URLSearchParams();

  if (filters?.search && filters.search.trim() !== "") {
    query.append("search", filters.search.trim());
  }

  if (filters?.category && filters.category !== "All") {
    query.append("category", filters.category);
  }

  if (filters?.status && filters.status !== "All") {
    query.append("status", filters.status);
  }

  if (filters?.location && filters.location.trim() !== "") {
    query.append("location", filters.location.trim());
  }

  const queryString = query.toString();

  const url = queryString
    ? `${API_BASE_URL}/jobs?${queryString}`
    : `${API_BASE_URL}/jobs`;

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse<JobRequest[]>(response);
}

export async function getJobById(id: string): Promise<JobRequest> {
  const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse<JobRequest>(response);
}

export async function createJob(data: JobFormData): Promise<JobRequest> {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: "POST",
    headers: getAuthHeaders(),
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
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  return handleResponse<JobRequest>(response);
}

export async function markJobInProgress(id: string): Promise<JobRequest> {
  return updateJobStatus(id, "In Progress");
}

export async function markJobClosed(id: string): Promise<JobRequest> {
  return updateJobStatus(id, "Closed");
}

export async function deleteJob(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  await handleResponse<{ message: string }>(response);
}

export type UserRole = "homeowner" | "tradesperson";

export type JobStatus = "open" | "in_progress" | "closed";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type JobRequest = {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: JobStatus;
  homeowner?: {
    _id?: string;
    id?: string;
    name: string;
    email: string;
  };
  assignedTradesperson?: {
    _id?: string;
    id?: string;
    name: string;
    email: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
};

export type JobFormData = {
  title: string;
  description: string;
  category: string;
  location: string;
};

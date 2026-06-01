import type { UserProfile } from "@/src/features/dashboard/lib/dashboard.types";

export type UserRole = UserProfile["role"];

export type UsersListQuery = {
  page: number;
  limit: number;
  role?: string;
  search?: string;
};

export type UsersListResponse = {
  data: UserProfile[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
};

export type UsersListResult = {
  response: UsersListResponse;
  hasError: boolean;
  errorMessage: string | null;
};

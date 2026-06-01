import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import type { UserProfile } from "@/src/features/dashboard/lib/dashboard.types";

export async function getUserById(id: number) {
  return serverApiFetch<UserProfile>(`/users/${id}`, {
    authenticated: true,
  });
}

export async function getUserByIdSafe(id: number) {
  try {
    return {
      user: await getUserById(id),
      hasError: false,
      errorMessage: null,
    };
  } catch (error) {
    return {
      user: null,
      hasError: true,
      errorMessage:
        error instanceof ApiError ? error.message : "Unable to load user.",
    };
  }
}

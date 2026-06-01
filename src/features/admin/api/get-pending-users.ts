import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import type { UserProfile } from "@/src/features/dashboard/lib/dashboard.types";

export async function getPendingUsers() {
  return serverApiFetch<UserProfile[]>("/users/pending", {
    authenticated: true,
  });
}

export async function getPendingUsersSafe() {
  try {
    return {
      users: await getPendingUsers(),
      hasError: false,
      errorMessage: null,
    };
  } catch (error) {
    return {
      users: [] as UserProfile[],
      hasError: true,
      errorMessage:
        error instanceof ApiError ? error.message : "Unable to load pending users.",
    };
  }
}

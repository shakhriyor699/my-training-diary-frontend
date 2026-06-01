import { redirect } from "next/navigation";

import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import type { UserProfile } from "@/src/features/dashboard/lib/dashboard.types";

export function getCurrentUser() {
  return serverApiFetch<UserProfile>("/users/me", { authenticated: true });
}

export async function getCurrentUserSafe() {
  try {
    return await getCurrentUser();
  } catch {
    return null;
  }
}

export async function requireCurrentUser(locale: string) {
  try {
    return await getCurrentUser();
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      redirect(`/${locale}/login`);
    }

    throw error;
  }
}

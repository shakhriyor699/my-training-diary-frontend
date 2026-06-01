import { serverApiFetch } from "@/src/shared/api/server-fetch";

import type { RoleOption } from "../lib/admin-roles.types";

export async function getUserRolesSafe() {
  try {
    return await serverApiFetch<RoleOption[]>("/users/roles", {
      authenticated: true,
    });
  } catch {
    return [];
  }
}

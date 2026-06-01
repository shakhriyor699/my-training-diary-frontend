import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import { createEmptyUsersListResponse } from "../lib/admin-users.fallbacks";
import { toUsersListSearchParams } from "../lib/admin-users.query";
import type {
  UsersListQuery,
  UsersListResponse,
  UsersListResult,
} from "../lib/admin-users.types";

export function getUsersList(query: UsersListQuery) {
  const queryString = toUsersListSearchParams(query);

  return serverApiFetch<UsersListResponse>(`/users/all?${queryString}`, {
    authenticated: true,
  });
}

export async function getUsersListSafe(
  query: UsersListQuery,
): Promise<UsersListResult> {
  try {
    const response = await getUsersList(query);

    return {
      response,
      hasError: false,
      errorMessage: null,
    };
  } catch (error) {
    return {
      response: createEmptyUsersListResponse(query),
      hasError: true,
      errorMessage:
        error instanceof ApiError ? error.message : "Unable to load users.",
    };
  }
}

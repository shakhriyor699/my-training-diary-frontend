import type { UsersListQuery, UsersListResponse } from "./admin-users.types";

export function createEmptyUsersListResponse(
  query: UsersListQuery,
): UsersListResponse {
  return {
    data: [],
    meta: {
      total: 0,
      page: query.page,
      lastPage: 1,
    },
  };
}

import type {
  NotificationsQuery,
  NotificationsResponse,
} from "./notifications.types";

export function createEmptyNotificationsResponse(
  query: NotificationsQuery,
): NotificationsResponse {
  return {
    data: [],
    meta: {
      total: 0,
      page: query.page,
      limit: query.limit,
      totalPages: 1,
    },
  };
}

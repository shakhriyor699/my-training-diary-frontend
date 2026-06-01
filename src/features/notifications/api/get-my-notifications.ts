import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import { createEmptyNotificationsResponse } from "../lib/notifications.fallbacks";
import { toNotificationsSearchParams } from "../lib/notifications.query";
import type {
  NotificationsQuery,
  NotificationsResponse,
  NotificationsResult,
} from "../lib/notifications.types";

export function getMyNotifications(query: NotificationsQuery) {
  const queryString = toNotificationsSearchParams(query);

  return serverApiFetch<NotificationsResponse>(`/notifications?${queryString}`, {
    authenticated: true,
  });
}

export async function getMyNotificationsSafe(
  query: NotificationsQuery,
): Promise<NotificationsResult> {
  try {
    const response = await getMyNotifications(query);

    return {
      response,
      hasError: false,
      errorMessage: null,
    };
  } catch (error) {
    return {
      response: createEmptyNotificationsResponse(query),
      hasError: true,
      errorMessage:
        error instanceof ApiError ? error.message : "Unable to load notifications.",
    };
  }
}

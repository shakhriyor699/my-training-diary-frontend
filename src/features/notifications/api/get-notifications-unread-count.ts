import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import type {
  NotificationsUnreadCountResponse,
  NotificationsUnreadCountResult,
} from "../lib/notifications.types";

export function getNotificationsUnreadCount() {
  return serverApiFetch<NotificationsUnreadCountResponse>(
    "/notifications/unread-count",
    {
      authenticated: true,
    },
  );
}

export async function getNotificationsUnreadCountSafe(): Promise<NotificationsUnreadCountResult> {
  try {
    const response = await getNotificationsUnreadCount();

    return {
      response,
      hasError: false,
      errorMessage: null,
    };
  } catch (error) {
    return {
      response: {
        count: 0,
      },
      hasError: true,
      errorMessage:
        error instanceof ApiError
          ? error.message
          : "Unable to load unread notifications count.",
    };
  }
}

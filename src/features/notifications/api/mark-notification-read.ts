import { clientApiFetch } from "@/src/shared/api/client-fetch";

import type { NotificationReadResponse } from "../lib/notifications.types";

export function markNotificationRead(notificationId: number) {
  return clientApiFetch<NotificationReadResponse>(
    `/api/notifications/${notificationId}/read`,
    {
      method: "PATCH",
      message: "Unable to mark notification as read.",
    },
  );
}

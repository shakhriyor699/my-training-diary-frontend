import { clientApiFetch } from "@/src/shared/api/client-fetch";

import type { NotificationsReadAllResponse } from "../lib/notifications.types";

export function markAllNotificationsRead() {
  return clientApiFetch<NotificationsReadAllResponse>("/api/notifications/read-all", {
    method: "PATCH",
    message: "Unable to mark all notifications as read.",
  });
}

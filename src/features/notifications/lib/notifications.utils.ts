import type {
  NotificationItem,
  NotificationsResponse,
} from "./notifications.types";

export function sortNotificationsUnreadFirst(
  response: NotificationsResponse,
): NotificationsResponse {
  return {
    ...response,
    data: [...response.data].sort(compareNotifications),
  };
}

function compareNotifications(left: NotificationItem, right: NotificationItem) {
  if (left.isRead !== right.isRead) {
    return Number(left.isRead) - Number(right.isRead);
  }

  return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
}

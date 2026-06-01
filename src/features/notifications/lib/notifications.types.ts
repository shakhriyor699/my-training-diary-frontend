export type NotificationType =
  | "plan_approved"
  | "plan_rejected"
  | "plan_pending"
  | "plan_liked"
  | "plan_saved"
  | "generic";

export type NotificationItem = {
  id: number;
  type: NotificationType | string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type NotificationsQuery = {
  page: number;
  limit: number;
  isRead?: boolean;
};

export type NotificationsResponse = {
  data: NotificationItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type NotificationsResult = {
  response: NotificationsResponse;
  hasError: boolean;
  errorMessage: string | null;
};

export type NotificationsUnreadCountResponse = {
  count: number;
};

export type NotificationsUnreadCountResult = {
  response: NotificationsUnreadCountResponse;
  hasError: boolean;
  errorMessage: string | null;
};

export type NotificationsReadAllResponse = {
  count: number;
};

export type NotificationReadResponse = {
  id: number;
  isRead: true;
};

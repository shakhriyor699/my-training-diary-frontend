import type { NotificationsQuery } from "./notifications.types";

type SearchParamsValue = string | string[] | undefined;
type SearchParamsInput = Record<string, SearchParamsValue>;

export function parseNotificationsQuery(searchParams: SearchParamsInput): NotificationsQuery {
  const page = normalizePositiveInt(searchParams.page, 1);
  const limit = Math.min(normalizePositiveInt(searchParams.limit, 10), 50);
  const isRead = normalizeOptionalBoolean(searchParams.isRead);

  return {
    page,
    limit,
    isRead,
  };
}

export function toNotificationsSearchParams(query: NotificationsQuery) {
  const params = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
  });

  if (typeof query.isRead === "boolean") {
    params.set("isRead", String(query.isRead));
  }

  return params.toString();
}

function normalizePositiveInt(value: SearchParamsValue, fallback: number) {
  const input = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(input ?? "", 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeOptionalBoolean(value: SearchParamsValue) {
  const input = Array.isArray(value) ? value[0] : value;

  if (input === "true") {
    return true;
  }

  if (input === "false") {
    return false;
  }

  return undefined;
}

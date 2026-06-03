import type { AdminUserTrainingOverviewQuery } from "./admin-user-training-overview.types";

type SearchParamsValue = string | string[] | undefined;
type SearchParamsInput = Record<string, SearchParamsValue>;

export function parseAdminUserTrainingOverviewQuery(
  searchParams: SearchParamsInput,
): AdminUserTrainingOverviewQuery {
  const page = normalizePositiveInt(searchParams.page, 1);
  const limit = Math.min(normalizePositiveInt(searchParams.limit, 10), 100);
  const date = normalizeDate(searchParams.date);

  return {
    page,
    limit,
    date,
  };
}

export function toAdminUserTrainingOverviewSearchParams(
  query: AdminUserTrainingOverviewQuery,
) {
  const params = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
  });

  if (query.date) {
    params.set("date", query.date);
  }

  return params.toString();
}

function normalizePositiveInt(value: SearchParamsValue, fallback: number) {
  const input = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(input ?? "", 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeDate(value: SearchParamsValue) {
  const input = Array.isArray(value) ? value[0] : value;
  const trimmed = input?.trim();

  if (!trimmed || !/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return undefined;
  }

  return trimmed;
}

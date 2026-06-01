import type { UsersListQuery } from "./admin-users.types";

type SearchParamsValue = string | string[] | undefined;

type SearchParamsInput = Record<string, SearchParamsValue>;

export function parseUsersListQuery(searchParams: SearchParamsInput): UsersListQuery {
  const page = normalizePositiveInt(searchParams.page, 1);
  const limit = normalizePositiveInt(searchParams.limit, 10);
  const role = normalizeOptionalString(searchParams.role);
  const search = normalizeOptionalString(searchParams.search);

  return {
    page,
    limit,
    role,
    search,
  };
}

export function toUsersListSearchParams(query: UsersListQuery) {
  const params = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
  });

  if (query.role) {
    params.set("role", query.role);
  }

  if (query.search) {
    params.set("search", query.search);
  }

  return params.toString();
}

function normalizePositiveInt(value: SearchParamsValue, fallback: number) {
  const input = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(input ?? "", 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeOptionalString(value: SearchParamsValue) {
  const input = Array.isArray(value) ? value[0] : value;
  const normalized = input?.trim();

  return normalized ? normalized : undefined;
}

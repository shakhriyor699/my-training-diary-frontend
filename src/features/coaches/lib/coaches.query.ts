import type { CoachesQuery } from "./coaches.types";

type SearchParamsValue = string | string[] | undefined;
type SearchParamsInput = Record<string, SearchParamsValue>;

export function parseCoachesQuery(searchParams: SearchParamsInput): CoachesQuery {
  return {
    search: normalizeOptionalString(searchParams.search),
  };
}

export function toCoachesSearchParams(query: CoachesQuery) {
  const params = new URLSearchParams();

  if (query.search) {
    params.set("search", query.search);
  }

  return params.toString();
}

function normalizeOptionalString(value: SearchParamsValue) {
  const input = Array.isArray(value) ? value[0] : value;
  const normalized = input?.trim();

  return normalized ? normalized : undefined;
}

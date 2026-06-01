import type { CoachStudentSessionsQuery } from "./coach-student-sessions.types";

type SearchParamsValue = string | string[] | undefined;
type SearchParamsInput = Record<string, SearchParamsValue>;

export function parseCoachStudentSessionsQuery(
  searchParams: SearchParamsInput,
): CoachStudentSessionsQuery {
  const page = normalizePositiveInt(searchParams.page, 1);
  const limit = Math.min(normalizePositiveInt(searchParams.limit, 10), 50);

  return {
    page,
    limit,
  };
}

export function toCoachStudentSessionsSearchParams(
  query: CoachStudentSessionsQuery,
) {
  return new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
  }).toString();
}

function normalizePositiveInt(value: SearchParamsValue, fallback: number) {
  const input = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(input ?? "", 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

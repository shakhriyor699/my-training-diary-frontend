import type {
  PublicTrainingPlansQuery,
  SortOrder,
  TrainingPlanSortField,
} from "./training-plans.types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_SORT: TrainingPlanSortField = "createdAt";
const DEFAULT_ORDER: SortOrder = "desc";

export function parsePublicTrainingPlansQuery(
  searchParams: Record<string, string | string[] | undefined>,
): PublicTrainingPlansQuery {
  const search = getSingleParam(searchParams.search)?.trim();
  const rawAuthorId = getSingleParam(searchParams.authorId);
  const rawSort = getSingleParam(searchParams.sort);
  const rawOrder = getSingleParam(searchParams.order);
  const rawPage = getSingleParam(searchParams.page);
  const rawLimit = getSingleParam(searchParams.limit);

  return {
    search: search || undefined,
    authorId: parsePositiveInteger(rawAuthorId),
    sort: rawSort === "title" ? "title" : DEFAULT_SORT,
    order: rawOrder === "asc" ? "asc" : DEFAULT_ORDER,
    page: parsePositiveInteger(rawPage) ?? DEFAULT_PAGE,
    limit: parseBoundedInteger(rawLimit, 1, 50) ?? DEFAULT_LIMIT,
  };
}

export function toPublicTrainingPlansSearchParams(
  query: PublicTrainingPlansQuery,
) {
  const params = new URLSearchParams({
    sort: query.sort,
    order: query.order,
    page: String(query.page),
    limit: String(query.limit),
  });

  if (query.search) {
    params.set("search", query.search);
  }

  if (typeof query.authorId === "number") {
    params.set("authorId", String(query.authorId));
  }

  return params.toString();
}

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePositiveInteger(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return undefined;
  }

  return parsed;
}

function parseBoundedInteger(
  value: string | undefined,
  min: number,
  max: number,
) {
  const parsed = parsePositiveInteger(value);

  if (typeof parsed !== "number") {
    return undefined;
  }

  return Math.min(Math.max(parsed, min), max);
}

import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import { toCoachesSearchParams } from "../lib/coaches.query";
import type { Coach, CoachesQuery, CoachesResult } from "../lib/coaches.types";

export function getCoaches(query: CoachesQuery) {
  const queryString = toCoachesSearchParams(query);
  const path = queryString ? `/coaches?${queryString}` : "/coaches";

  return serverApiFetch<Coach[]>(path, {
    authenticated: true,
  });
}

export async function getCoachesSafe(query: CoachesQuery): Promise<CoachesResult> {
  try {
    const coaches = await getCoaches(query);

    return {
      coaches,
      hasError: false,
      errorMessage: null,
    };
  } catch (error) {
    return {
      coaches: [],
      hasError: true,
      errorMessage:
        error instanceof ApiError ? error.message : "Unable to load coaches.",
    };
  }
}

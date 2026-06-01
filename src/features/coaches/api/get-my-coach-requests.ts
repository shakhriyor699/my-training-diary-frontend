import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import type { CoachRequest, CoachRequestsResult } from "../lib/coach-requests.types";

export function getMyCoachRequests() {
  return serverApiFetch<CoachRequest[]>("/coaches/requests/my", {
    authenticated: true,
  });
}

export async function getMyCoachRequestsSafe(): Promise<CoachRequestsResult> {
  try {
    const requests = await getMyCoachRequests();

    return {
      requests,
      hasError: false,
      errorMessage: null,
    };
  } catch (error) {
    return {
      requests: [],
      hasError: true,
      errorMessage:
        error instanceof ApiError
          ? error.message
          : "Unable to load coach requests.",
    };
  }
}

import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import type {
  NextWorkoutDayResponse,
  NextWorkoutDayResult,
} from "../lib/training-plans.types";

export function getNextWorkoutDayRecommendations(dayId: number) {
  return serverApiFetch<NextWorkoutDayResponse>(
    `/training-plans/workout-days/${dayId}/next-workout`,
    {
      authenticated: true,
    },
  );
}

export async function getNextWorkoutDayRecommendationsSafe(
  dayId: number,
): Promise<NextWorkoutDayResult> {
  try {
    const response = await getNextWorkoutDayRecommendations(dayId);

    return {
      response,
      hasError: false,
      errorMessage: null,
    };
  } catch (error) {
    return {
      response: null,
      hasError: true,
      errorMessage:
        error instanceof ApiError
          ? error.message
          : "Unable to load next workout recommendations.",
    };
  }
}

import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import type {
  WorkoutDayHistoryResponse,
  WorkoutDayHistoryResult,
} from "../lib/training-plans.types";

export function getWorkoutDayHistory(dayId: number) {
  return serverApiFetch<WorkoutDayHistoryResponse>(
    `/training-plans/workout-days/${dayId}/history`,
    {
      authenticated: true,
    },
  );
}

export async function getWorkoutDayHistorySafe(
  dayId: number,
): Promise<WorkoutDayHistoryResult> {
  try {
    const response = await getWorkoutDayHistory(dayId);

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
        error instanceof ApiError ? error.message : "Unable to load workout day history.",
    };
  }
}

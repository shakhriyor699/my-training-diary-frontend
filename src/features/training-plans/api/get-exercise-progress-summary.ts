import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import type {
  ExerciseProgressSummaryResponse,
  ExerciseProgressSummaryResult,
} from "../lib/training-plans.types";

export function getExerciseProgressSummary(exerciseId: number) {
  return serverApiFetch<ExerciseProgressSummaryResponse>(
    `/training-plans/exercises/${exerciseId}/progress-summary`,
    {
      authenticated: true,
    },
  );
}

export async function getExerciseProgressSummarySafe(
  exerciseId: number,
): Promise<ExerciseProgressSummaryResult> {
  try {
    const response = await getExerciseProgressSummary(exerciseId);

    return {
      response,
      hasError: false,
      errorMessage: null,
    };
  } catch (error) {
    return {
      response: {
        exerciseId,
        data: [],
      },
      hasError: true,
      errorMessage:
        error instanceof ApiError
          ? error.message
          : "Unable to load exercise progress summary.",
    };
  }
}

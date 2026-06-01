import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import type {
  ExerciseRecommendationResponse,
  ExerciseRecommendationResult,
} from "../lib/training-plans.types";

export function getExerciseRecommendation(exerciseId: number) {
  return serverApiFetch<ExerciseRecommendationResponse>(
    `/training-plans/exercises/${exerciseId}/recommendation`,
    {
      authenticated: true,
    },
  );
}

export async function getExerciseRecommendationSafe(
  exerciseId: number,
): Promise<ExerciseRecommendationResult> {
  try {
    const response = await getExerciseRecommendation(exerciseId);

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
          : "Unable to load exercise recommendation.",
    };
  }
}

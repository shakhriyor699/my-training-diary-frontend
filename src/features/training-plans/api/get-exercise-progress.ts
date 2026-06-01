import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import type {
  ExerciseProgressResponse,
  ExerciseProgressResult,
} from "../lib/training-plans.types";

export function getExerciseProgress(exerciseId: number) {
  return serverApiFetch<ExerciseProgressResponse>(
    `/training-plans/exercises/${exerciseId}/progress`,
    {
      authenticated: true,
    },
  );
}

export async function getExerciseProgressSafe(
  exerciseId: number,
): Promise<ExerciseProgressResult> {
  try {
    const response = await getExerciseProgress(exerciseId);

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
          : "Unable to load exercise progress.",
    };
  }
}

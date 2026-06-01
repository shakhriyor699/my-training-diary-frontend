import type { ExerciseRecommendationResponse } from "@/src/features/training-plans/lib/training-plans.types";
import { clientApiFetch } from "@/src/shared/api/client-fetch";

export function getExerciseRecommendationClient(exerciseId: number) {
  return clientApiFetch<ExerciseRecommendationResponse>(
    `/api/training-plans/exercises/${exerciseId}/recommendation`,
    {
      message: "Unable to load exercise recommendation.",
    },
  );
}

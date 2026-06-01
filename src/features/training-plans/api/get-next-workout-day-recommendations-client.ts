import type { NextWorkoutDayResponse } from "@/src/features/training-plans/lib/training-plans.types";
import { clientApiFetch } from "@/src/shared/api/client-fetch";

export function getNextWorkoutDayRecommendationsClient(dayId: number) {
  return clientApiFetch<NextWorkoutDayResponse>(
    `/api/training-plans/workout-days/${dayId}/next-workout`,
    {
      message: "Unable to load next workout recommendations.",
    },
  );
}

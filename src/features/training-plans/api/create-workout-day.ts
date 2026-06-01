import type { CreateWorkoutDayInput } from "@/src/features/training-plans/lib/create-workout-day.schema";
import { clientApiFetch } from "@/src/shared/api/client-fetch";

type CreatedWorkoutDay = {
  id: number;
  title: string;
  order: number;
  planId: number;
};

export function createWorkoutDay(
  planId: number,
  payload: CreateWorkoutDayInput,
) {
  return clientApiFetch<CreatedWorkoutDay>(
    `/api/training-plans/${planId}/workout-days`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      message: "Unable to add workout day.",
    },
  );
}

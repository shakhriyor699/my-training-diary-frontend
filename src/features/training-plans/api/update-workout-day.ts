import type { CreateWorkoutDayInput } from "@/src/features/training-plans/lib/create-workout-day.schema";
import { clientApiFetch } from "@/src/shared/api/client-fetch";

type UpdatedWorkoutDay = {
  id: number;
  title: string;
  order: number;
};

export function updateWorkoutDay(
  dayId: number,
  payload: CreateWorkoutDayInput,
) {
  return clientApiFetch<UpdatedWorkoutDay>(
    `/api/training-plans/workout-days/${dayId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      message: "Unable to update workout day.",
    },
  );
}

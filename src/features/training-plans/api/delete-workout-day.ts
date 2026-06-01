import { clientApiFetch } from "@/src/shared/api/client-fetch";

type DeleteWorkoutDayResponse = {
  success: boolean;
  message: string;
};

export function deleteWorkoutDay(dayId: number) {
  return clientApiFetch<DeleteWorkoutDayResponse>(
    `/api/training-plans/workout-days/${dayId}`,
    {
      method: "DELETE",
      message: "Unable to delete workout day.",
    },
  );
}

import { clientApiFetch } from "@/src/shared/api/client-fetch";

type DeleteWorkoutExerciseResponse = {
  success: boolean;
  message: string;
};

export function deleteWorkoutExercise(exerciseId: number) {
  return clientApiFetch<DeleteWorkoutExerciseResponse>(
    `/api/training-plans/exercises/${exerciseId}`,
    {
      method: "DELETE",
      message: "Unable to delete exercise.",
    },
  );
}

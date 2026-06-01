import type { CreateWorkoutExerciseInput } from "@/src/features/training-plans/lib/create-workout-exercise.schema";
import { clientApiFetch } from "@/src/shared/api/client-fetch";

type UpdatedWorkoutExercise = {
  id: number;
  name: string;
  description?: string | null;
  type: string;
  muscleGroup: string;
  targetSets: number;
  minReps: number;
  maxReps: number;
  targetRir: number;
  weightStep: number;
};

export function updateWorkoutExercise(
  exerciseId: number,
  payload: CreateWorkoutExerciseInput,
) {
  return clientApiFetch<UpdatedWorkoutExercise>(
    `/api/training-plans/exercises/${exerciseId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      message: "Unable to update exercise.",
    },
  );
}

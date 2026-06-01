import type { CreateWorkoutExerciseInput } from "@/src/features/training-plans/lib/create-workout-exercise.schema";
import { clientApiFetch } from "@/src/shared/api/client-fetch";

type CreatedWorkoutExercise = {
  id: number;
  name: string;
  type: string;
  muscleGroup: string;
  targetSets: number;
  minReps: number;
  maxReps: number;
  targetRir: number;
  weightStep: number;
  workoutDayId: number;
};

export function createWorkoutExercise(
  dayId: number,
  payload: CreateWorkoutExerciseInput,
) {
  return clientApiFetch<CreatedWorkoutExercise>(
    `/api/training-plans/workout-days/${dayId}/exercises`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      message: "Unable to add exercise.",
    },
  );
}

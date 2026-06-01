import { z } from "zod";

export const trainingSessionSetSchema = z.object({
  setNumber: z
    .number({ message: "Set number must be a number." })
    .int("Set number must be an integer.")
    .min(1, "Set number must be at least 1."),
  weight: z
    .number({ message: "Weight must be a number." })
    .min(0, "Weight cannot be negative."),
  reps: z
    .number({ message: "Reps must be a number." })
    .int("Reps must be an integer.")
    .min(1, "Reps must be at least 1."),
  rir: z
    .number({ message: "RIR must be a number." })
    .int("RIR must be an integer.")
    .min(0, "RIR cannot be negative."),
});

export const trainingSessionExerciseSchema = z.object({
  exerciseId: z
    .number({ message: "Exercise id must be a number." })
    .int("Exercise id must be an integer.")
    .min(1, "Exercise id must be at least 1."),
  note: z.string().optional(),
  sets: z.array(trainingSessionSetSchema).min(1, "At least one set is required."),
});

export const createTrainingSessionSchema = z.object({
  planId: z
    .number({ message: "Plan id must be a number." })
    .int("Plan id must be an integer.")
    .min(1, "Plan id must be at least 1."),
  workoutDayId: z
    .number({ message: "Workout day id must be a number." })
    .int("Workout day id must be an integer.")
    .min(1, "Workout day id must be at least 1."),
  date: z.string().min(1, "Date is required."),
  exercises: z
    .array(trainingSessionExerciseSchema)
    .min(1, "At least one exercise is required."),
});

export const updateTrainingSessionSchema = z.object({
  workoutDayId: z
    .number({ message: "Workout day id must be a number." })
    .int("Workout day id must be an integer.")
    .min(1, "Workout day id must be at least 1."),
  exercises: z
    .array(trainingSessionExerciseSchema)
    .min(1, "At least one exercise is required."),
});

export type TrainingSessionSetInput = z.infer<typeof trainingSessionSetSchema>;
export type TrainingSessionExerciseInput = z.infer<typeof trainingSessionExerciseSchema>;
export type CreateTrainingSessionInput = z.infer<typeof createTrainingSessionSchema>;
export type UpdateTrainingSessionInput = z.infer<typeof updateTrainingSessionSchema>;

import { z } from "zod";

export const createWorkoutExerciseSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required."),
    description: z.string().trim().optional(),
    order: z
      .number({ message: "Order must be a number." })
      .int("Order must be an integer.")
      .min(1, "Order must be at least 1."),
    type: z.string().trim().min(1, "Exercise type is required."),
    muscleGroup: z.string().trim().min(1, "Muscle group is required."),
    targetSets: z
      .number({ message: "Target sets must be a number." })
      .int("Target sets must be an integer.")
      .min(1, "Target sets must be at least 1."),
    minReps: z
      .number({ message: "Min reps must be a number." })
      .int("Min reps must be an integer.")
      .min(1, "Min reps must be at least 1."),
    maxReps: z
      .number({ message: "Max reps must be a number." })
      .int("Max reps must be an integer.")
      .min(1, "Max reps must be at least 1."),
    targetRir: z
      .number({ message: "Target RIR must be a number." })
      .int("Target RIR must be an integer.")
      .min(0, "Target RIR cannot be negative."),
    weightStep: z
      .number({ message: "Weight step must be a number." })
      .min(0, "Weight step cannot be negative."),
  })
  .superRefine((value, context) => {
    if (value.maxReps < value.minReps) {
      context.addIssue({
        code: "custom",
        path: ["maxReps"],
        message: "Max reps must be greater than or equal to min reps.",
      });
    }
  });

export type CreateWorkoutExerciseInput = z.infer<
  typeof createWorkoutExerciseSchema
>;

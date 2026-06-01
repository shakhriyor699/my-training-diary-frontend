import { z } from "zod";

export const createTrainingPlanSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  description: z.string().trim().min(1, "Description is required."),
  goal: z.string().trim().min(1, "Goal is required."),
  deloadAfterWeeks: z
    .number({ message: "Deload weeks must be a number." })
    .int("Deload weeks must be an integer.")
    .min(1, "Deload weeks must be at least 1."),
  deloadPercent: z
    .number({ message: "Deload percent must be a number." })
    .min(0, "Deload percent cannot be negative.")
    .max(100, "Deload percent cannot exceed 100."),
});

export type CreateTrainingPlanInput = z.infer<typeof createTrainingPlanSchema>;

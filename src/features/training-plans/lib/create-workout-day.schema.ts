import { z } from "zod";

export const createWorkoutDaySchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  order: z
    .number({ message: "Order must be a number." })
    .int("Order must be an integer.")
    .min(1, "Order must be at least 1."),
});

export type CreateWorkoutDayInput = z.infer<typeof createWorkoutDaySchema>;

import { z } from "zod";

export const createNutritionDaySchema = z.object({
  dayNumber: z
    .number({ message: "Day number must be a number." })
    .int("Day number must be an integer.")
    .min(1, "Day number must be at least 1."),
  title: z.string().trim().min(1, "Title is required."),
});

export type CreateNutritionDayInput = z.infer<typeof createNutritionDaySchema>;


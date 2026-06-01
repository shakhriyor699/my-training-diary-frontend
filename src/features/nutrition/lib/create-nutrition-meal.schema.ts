import { z } from "zod";

export const createNutritionMealSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  time: z
    .string()
    .trim()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:MM format."),
});

export type CreateNutritionMealInput = z.infer<
  typeof createNutritionMealSchema
>;


import { z } from "zod";

export const createNutritionFoodSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  grams: z
    .number({ message: "Grams must be a number." })
    .positive("Grams must be greater than 0."),
  calories: z
    .number({ message: "Calories must be a number." })
    .min(0, "Calories cannot be negative."),
  protein: z
    .number({ message: "Protein must be a number." })
    .min(0, "Protein cannot be negative."),
  fat: z
    .number({ message: "Fat must be a number." })
    .min(0, "Fat cannot be negative."),
  carbs: z
    .number({ message: "Carbs must be a number." })
    .min(0, "Carbs cannot be negative."),
});

export type CreateNutritionFoodInput = z.infer<
  typeof createNutritionFoodSchema
>;


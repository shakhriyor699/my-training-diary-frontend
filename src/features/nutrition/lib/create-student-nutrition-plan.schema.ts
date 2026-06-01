import { z } from "zod";

export const nutritionGoalValues = ["bulk", "cut", "maintain"] as const;
export const nutritionGenderValues = ["male", "female"] as const;
export const nutritionActivityValues = ["low", "medium", "high"] as const;

export const createStudentNutritionPlanSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  goal: z.enum(nutritionGoalValues, {
    message: "Goal is required.",
  }),
  weightKg: z
    .number({ message: "Weight must be a number." })
    .positive("Weight must be greater than 0.")
    .max(500, "Weight must be realistic."),
  heightCm: z
    .number({ message: "Height must be a number." })
    .int("Height must be an integer.")
    .positive("Height must be greater than 0.")
    .max(300, "Height must be realistic."),
  age: z
    .number({ message: "Age must be a number." })
    .int("Age must be an integer.")
    .min(1, "Age must be at least 1.")
    .max(120, "Age must be realistic."),
  gender: z.enum(nutritionGenderValues, {
    message: "Gender is required.",
  }),
  activity: z.enum(nutritionActivityValues, {
    message: "Activity level is required.",
  }),
});

export type CreateStudentNutritionPlanInput = z.infer<
  typeof createStudentNutritionPlanSchema
>;


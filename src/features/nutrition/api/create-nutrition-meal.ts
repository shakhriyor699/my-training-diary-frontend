import type { CreateNutritionMealInput } from "@/src/features/nutrition/lib/create-nutrition-meal.schema";
import type { CreatedNutritionMeal } from "@/src/features/nutrition/lib/nutrition.types";
import { clientApiFetch } from "@/src/shared/api/client-fetch";

export function createNutritionMeal(
  dayId: number,
  payload: CreateNutritionMealInput,
) {
  return clientApiFetch<CreatedNutritionMeal>(`/api/nutrition/days/${dayId}/meals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    message: "Unable to add nutrition meal.",
  });
}


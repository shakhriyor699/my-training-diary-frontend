import type { CreateNutritionFoodInput } from "@/src/features/nutrition/lib/create-nutrition-food.schema";
import type { CreatedNutritionFood } from "@/src/features/nutrition/lib/nutrition.types";
import { clientApiFetch } from "@/src/shared/api/client-fetch";

export function createNutritionFood(
  mealId: number,
  payload: CreateNutritionFoodInput,
) {
  return clientApiFetch<CreatedNutritionFood>(`/api/nutrition/meals/${mealId}/foods`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    message: "Unable to add nutrition food.",
  });
}


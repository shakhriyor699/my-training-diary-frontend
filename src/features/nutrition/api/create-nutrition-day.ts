import type { CreateNutritionDayInput } from "@/src/features/nutrition/lib/create-nutrition-day.schema";
import type { CreatedNutritionDay } from "@/src/features/nutrition/lib/nutrition.types";
import { clientApiFetch } from "@/src/shared/api/client-fetch";

export function createNutritionDay(
  planId: number,
  payload: CreateNutritionDayInput,
) {
  return clientApiFetch<CreatedNutritionDay>(`/api/nutrition/plans/${planId}/days`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    message: "Unable to add nutrition day.",
  });
}


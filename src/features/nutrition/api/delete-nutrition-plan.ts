import type { DeleteNutritionPlanResponse } from "@/src/features/nutrition/lib/nutrition.types";
import { clientApiFetch } from "@/src/shared/api/client-fetch";

export function deleteNutritionPlan(planId: number) {
  return clientApiFetch<DeleteNutritionPlanResponse>(`/api/nutrition/plans/${planId}`, {
    method: "DELETE",
    message: "Unable to delete nutrition plan.",
  });
}


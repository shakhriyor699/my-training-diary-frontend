import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import type {
  NutritionPlanDetails,
  NutritionPlanDetailsResult,
} from "../lib/nutrition.types";

export function getNutritionPlanById(planId: number) {
  return serverApiFetch<NutritionPlanDetails>(`/nutrition/plans/${planId}`, {
    authenticated: true,
  });
}

export async function getNutritionPlanByIdSafe(
  planId: number,
): Promise<NutritionPlanDetailsResult> {
  try {
    const plan = await getNutritionPlanById(planId);

    return {
      plan,
      hasError: false,
      errorMessage: null,
    };
  } catch (error) {
    return {
      plan: null,
      hasError: true,
      errorMessage:
        error instanceof ApiError
          ? error.message
          : "Unable to load nutrition plan.",
    };
  }
}


import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import type {
  MyNutritionPlan,
  MyNutritionPlansResult,
} from "../lib/nutrition.types";

export function getMyNutritionPlans() {
  return serverApiFetch<MyNutritionPlan[]>("/nutrition/my/plans", {
    authenticated: true,
  });
}

export async function getMyNutritionPlansSafe(): Promise<MyNutritionPlansResult> {
  try {
    const plans = await getMyNutritionPlans();

    return {
      plans,
      hasError: false,
      errorMessage: null,
    };
  } catch (error) {
    return {
      plans: [],
      hasError: true,
      errorMessage:
        error instanceof ApiError
          ? error.message
          : "Unable to load nutrition plans.",
    };
  }
}


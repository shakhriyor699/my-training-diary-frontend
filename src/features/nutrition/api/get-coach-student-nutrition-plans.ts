import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import type {
  CoachStudentNutritionPlan,
  CoachStudentNutritionPlansResult,
} from "../lib/nutrition.types";

export function getCoachStudentNutritionPlans(studentId: number) {
  return serverApiFetch<CoachStudentNutritionPlan[]>(
    `/nutrition/students/${studentId}/plans`,
    {
      authenticated: true,
    },
  );
}

export async function getCoachStudentNutritionPlansSafe(
  studentId: number,
): Promise<CoachStudentNutritionPlansResult> {
  try {
    const plans = await getCoachStudentNutritionPlans(studentId);

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
          : "Unable to load student nutrition plans.",
    };
  }
}


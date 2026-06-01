import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import type {
  MyTrainingPlan,
  MyTrainingPlansResult,
} from "@/src/features/training-plans/lib/training-plans.types";

export function getCoachStudentTrainingPlans(studentId: number) {
  return serverApiFetch<MyTrainingPlan[]>(`/coaches/students/${studentId}/plans`, {
    authenticated: true,
  });
}

export async function getCoachStudentTrainingPlansSafe(
  studentId: number,
): Promise<MyTrainingPlansResult> {
  try {
    const plans = await getCoachStudentTrainingPlans(studentId);

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
          : "Unable to load student training plans.",
    };
  }
}

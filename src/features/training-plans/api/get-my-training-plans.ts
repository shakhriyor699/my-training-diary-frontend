import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import type {
  MyTrainingPlan,
  MyTrainingPlansResult,
} from "../lib/training-plans.types";

export function getMyTrainingPlans() {
  return serverApiFetch<MyTrainingPlan[]>("/training-plans/my", {
    authenticated: true,
  });
}

export async function getMyTrainingPlansSafe(): Promise<MyTrainingPlansResult> {
  try {
    const plans = await getMyTrainingPlans();

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
        error instanceof ApiError ? error.message : "Unable to load your training plans.",
    };
  }
}

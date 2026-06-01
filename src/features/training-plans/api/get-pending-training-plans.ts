import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import type {
  PendingTrainingPlan,
  PendingTrainingPlansResult,
} from "../lib/training-plans.types";

export function getPendingTrainingPlans() {
  return serverApiFetch<PendingTrainingPlan[]>("/training-plans/pending", {
    authenticated: true,
  });
}

export async function getPendingTrainingPlansSafe(): Promise<PendingTrainingPlansResult> {
  try {
    const plans = await getPendingTrainingPlans();

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
          : "Unable to load pending training plans.",
    };
  }
}

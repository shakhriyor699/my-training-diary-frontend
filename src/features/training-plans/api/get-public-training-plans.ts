import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import { createEmptyPublicTrainingPlansResponse } from "../lib/training-plans.fallbacks";
import { toPublicTrainingPlansSearchParams } from "../lib/training-plans.query";
import type {
  PublicTrainingPlansQuery,
  PublicTrainingPlansResponse,
  PublicTrainingPlansResult,
} from "../lib/training-plans.types";

export function getPublicTrainingPlans(query: PublicTrainingPlansQuery) {
  const queryString = toPublicTrainingPlansSearchParams(query);

  return serverApiFetch<PublicTrainingPlansResponse>(
    `/training-plans?${queryString}`,
    {
      authenticated: "optional",
    },
  );
}

export async function getPublicTrainingPlansSafe(
  query: PublicTrainingPlansQuery,
): Promise<PublicTrainingPlansResult> {
  try {
    const response = await getPublicTrainingPlans(query);

    return {
      response,
      hasError: false,
      errorMessage: null,
    };
  } catch (error) {
    return {
      response: createEmptyPublicTrainingPlansResponse(query),
      hasError: true,
      errorMessage:
        error instanceof ApiError
          ? error.message
          : "Unable to load training plans.",
    };
  }
}

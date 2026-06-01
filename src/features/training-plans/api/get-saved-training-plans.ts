import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import { createEmptyPublicTrainingPlansResponse } from "../lib/training-plans.fallbacks";
import { toPublicTrainingPlansSearchParams } from "../lib/training-plans.query";
import type {
  PublicTrainingPlan,
  PublicTrainingPlansQuery,
  PublicTrainingPlansResponse,
  PublicTrainingPlansResult,
} from "../lib/training-plans.types";

type SavedTrainingPlanItem = {
  id: number;
  title: string;
  status: "approved";
  author: {
    id: number;
    email: string;
  };
};

type SavedTrainingPlansPayload =
  | PublicTrainingPlansResponse
  | PublicTrainingPlan[]
  | SavedTrainingPlanItem[];

export function getSavedTrainingPlans(query: PublicTrainingPlansQuery) {
  const queryString = toPublicTrainingPlansSearchParams(query);

  return serverApiFetch<SavedTrainingPlansPayload>(
    `/training-plans/saved?${queryString}`,
    {
      authenticated: true,
    },
  );
}

export async function getSavedTrainingPlansSafe(
  query: PublicTrainingPlansQuery,
): Promise<PublicTrainingPlansResult> {
  try {
    const response = await getSavedTrainingPlans(query);

    return {
      response: normalizeSavedTrainingPlansResponse(response, query),
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
          : "Unable to load saved training plans.",
    };
  }
}

function normalizeSavedTrainingPlansResponse(
  payload: SavedTrainingPlansPayload,
  query: PublicTrainingPlansQuery,
): PublicTrainingPlansResponse {
  if (Array.isArray(payload)) {
    return {
      data: payload.map(normalizeSavedTrainingPlanItem),
      meta: {
        total: payload.length,
        page: query.page,
        limit: query.limit,
        totalPages: 1,
      },
    };
  }

  return payload;
}

function normalizeSavedTrainingPlanItem(
  plan: PublicTrainingPlan | SavedTrainingPlanItem,
): PublicTrainingPlan {
  return {
    id: plan.id,
    title: plan.title,
    description: "description" in plan ? plan.description : "",
    status: plan.status,
    author: plan.author,
    createdAt:
      "createdAt" in plan && typeof plan.createdAt === "string"
        ? plan.createdAt
        : new Date(0).toISOString(),
    likesCount:
      "likesCount" in plan && typeof plan.likesCount === "number"
        ? plan.likesCount
        : 0,
    isLiked:
      "isLiked" in plan && typeof plan.isLiked === "boolean"
        ? plan.isLiked
        : false,
    isSaved:
      "isSaved" in plan && typeof plan.isSaved === "boolean"
        ? plan.isSaved
        : true,
    workoutDays:
      "workoutDays" in plan && Array.isArray(plan.workoutDays)
        ? plan.workoutDays
        : [],
  };
}

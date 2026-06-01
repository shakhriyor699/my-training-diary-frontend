import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import type { TrainingPlanReferences } from "../lib/training-plan-references.types";

export function getTrainingPlanReferences() {
  return serverApiFetch<TrainingPlanReferences>("/references");
}

export async function getTrainingPlanReferencesSafe() {
  try {
    const references = await getTrainingPlanReferences();

    return {
      references,
      hasError: false,
      errorMessage: null,
    };
  } catch (error) {
    return {
      references: {
        exerciseTypes: [],
        muscleGroups: [],
        trainingGoals: [],
        planStatuses: [],
      },
      hasError: true,
      errorMessage:
        error instanceof ApiError
          ? error.message
          : "Unable to load training plan references.",
    };
  }
}

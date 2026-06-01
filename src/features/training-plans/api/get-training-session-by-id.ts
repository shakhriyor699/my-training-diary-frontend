import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import type {
  TrainingSessionDetailsResult,
} from "../lib/training-plans.types";
import { normalizeTrainingSession } from "../lib/training-session.utils";

export async function getTrainingSessionById(sessionId: number) {
  const response = await serverApiFetch<unknown>(
    `/training-plans/sessions/${sessionId}`,
    {
      authenticated: true,
    },
  );

  return normalizeTrainingSession(response as Parameters<typeof normalizeTrainingSession>[0]);
}

export async function getTrainingSessionByIdSafe(
  sessionId: number,
): Promise<TrainingSessionDetailsResult> {
  try {
    const session = await getTrainingSessionById(sessionId);

    return {
      session,
      hasError: false,
      errorMessage: null,
    };
  } catch (error) {
    return {
      session: null,
      hasError: true,
      errorMessage:
        error instanceof ApiError
          ? error.message
          : "Unable to load this training session.",
    };
  }
}

import type { CreateTrainingSessionInput } from "@/src/features/training-plans/lib/create-training-session.schema";
import type { MyTrainingSession } from "@/src/features/training-plans/lib/training-plans.types";
import { normalizeTrainingSession } from "@/src/features/training-plans/lib/training-session.utils";
import { clientApiFetch } from "@/src/shared/api/client-fetch";

export async function createTrainingSession(
  payload: CreateTrainingSessionInput,
): Promise<MyTrainingSession> {
  const response = await clientApiFetch<unknown>("/api/training-plans/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    message: "Unable to record training session.",
  });

  return normalizeTrainingSession(response as Parameters<typeof normalizeTrainingSession>[0]);
}

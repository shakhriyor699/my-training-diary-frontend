import type { UpdateTrainingSessionInput } from "@/src/features/training-plans/lib/create-training-session.schema";
import type { MyTrainingSession } from "@/src/features/training-plans/lib/training-plans.types";
import { normalizeTrainingSession } from "@/src/features/training-plans/lib/training-session.utils";
import { clientApiFetch } from "@/src/shared/api/client-fetch";

export async function updateTrainingSession(
  sessionId: number,
  payload: UpdateTrainingSessionInput,
): Promise<MyTrainingSession> {
  const response = await clientApiFetch<unknown>(
    `/api/training-plans/sessions/${sessionId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      message: "Unable to update training session.",
    },
  );

  return normalizeTrainingSession(response as Parameters<typeof normalizeTrainingSession>[0]);
}

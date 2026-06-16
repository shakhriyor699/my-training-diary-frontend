import type { CreateTrainingSessionInput } from "@/src/features/training-plans/lib/create-training-session.schema";
import type { MyTrainingSession } from "@/src/features/training-plans/lib/training-plans.types";
import { normalizeTrainingSession } from "@/src/features/training-plans/lib/training-session.utils";
import { normalizeGymCoinRewardResponse } from "@/src/features/gymcoin/lib/gymcoin.parsers";
import type { GymCoinRewardResponse } from "@/src/features/gymcoin/lib/gymcoin.types";
import { clientApiFetch } from "@/src/shared/api/client-fetch";

export type CreateTrainingSessionResult = {
  session: MyTrainingSession;
  reward: GymCoinRewardResponse | null;
};

export async function createTrainingSession(
  payload: CreateTrainingSessionInput,
): Promise<CreateTrainingSessionResult> {
  const response = await clientApiFetch<unknown>("/api/training-plans/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    message: "Unable to record training session.",
  });

  const value =
    response && typeof response === "object"
      ? (response as Record<string, unknown>)
      : null;
  const sessionPayload =
    (value?.session && typeof value.session === "object" ? value.session : null) ?? response;
  const rewardPayload =
    (value?.gymCoinReward && typeof value.gymCoinReward === "object"
      ? value.gymCoinReward
      : null) ??
    (value?.reward && typeof value.reward === "object" ? value.reward : null);
  const reward = rewardPayload
    ? normalizeGymCoinRewardResponse(rewardPayload)
    : null;

  return {
    session: normalizeTrainingSession(
      sessionPayload as Parameters<typeof normalizeTrainingSession>[0],
    ),
    reward,
  };
}

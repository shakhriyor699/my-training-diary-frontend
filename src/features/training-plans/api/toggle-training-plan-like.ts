import { clientApiFetch } from "@/src/shared/api/client-fetch";

type ToggleTrainingPlanLikeResponse = {
  id: number;
  userId: number;
  planId: number;
  liked: boolean;
  saved: boolean;
};

export function toggleTrainingPlanLike(planId: number) {
  return clientApiFetch<ToggleTrainingPlanLikeResponse>(
    `/api/training-plans/${planId}/like`,
    {
      method: "POST",
      message: "Unable to update like.",
    },
  );
}

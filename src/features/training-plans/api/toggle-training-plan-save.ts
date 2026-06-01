import { clientApiFetch } from "@/src/shared/api/client-fetch";

type ToggleTrainingPlanSaveResponse = {
  id: number;
  userId: number;
  planId: number;
  liked: boolean;
  saved: boolean;
};

export function toggleTrainingPlanSave(planId: number) {
  return clientApiFetch<ToggleTrainingPlanSaveResponse>(
    `/api/training-plans/${planId}/save`,
    {
      method: "POST",
      message: "Unable to update saved state.",
    },
  );
}

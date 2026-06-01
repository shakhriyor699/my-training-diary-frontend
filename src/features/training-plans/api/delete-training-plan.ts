import { clientApiFetch } from "@/src/shared/api/client-fetch";

type DeleteTrainingPlanResponse = {
  success: boolean;
  message: string;
};

export function deleteTrainingPlan(planId: number) {
  return clientApiFetch<DeleteTrainingPlanResponse>(`/api/training-plans/${planId}`, {
    method: "DELETE",
    message: "Unable to delete training plan.",
  });
}

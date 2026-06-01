import type { UpdateTrainingPlanInput } from "@/src/features/training-plans/lib/update-training-plan.schema";
import { clientApiFetch } from "@/src/shared/api/client-fetch";

type UpdatedTrainingPlan = {
  id: number;
  title: string;
  description: string;
  status: string;
  rejectionReason: string | null;
};

export function updateTrainingPlan(
  planId: number,
  payload: UpdateTrainingPlanInput,
) {
  return clientApiFetch<UpdatedTrainingPlan>(`/api/training-plans/${planId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    message: "Unable to update training plan.",
  });
}

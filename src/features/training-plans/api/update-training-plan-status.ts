import type { UpdateTrainingPlanStatusInput } from "@/src/features/training-plans/lib/update-training-plan-status.schema";
import { clientApiFetch } from "@/src/shared/api/client-fetch";

type UpdatedTrainingPlanStatus = {
  id: number;
  status: string;
  rejectionReason: string | null;
};

export function updateTrainingPlanStatus(
  planId: number,
  payload: UpdateTrainingPlanStatusInput,
) {
  return clientApiFetch<UpdatedTrainingPlanStatus>(
    `/api/training-plans/${planId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      message: "Unable to update training plan status.",
    },
  );
}

import type { CreateTrainingPlanInput } from "@/src/features/training-plans/lib/create-training-plan.schema";
import type { CreatedTrainingPlan } from "@/src/features/training-plans/lib/training-plan-form.types";
import { clientApiFetch } from "@/src/shared/api/client-fetch";

export function createTrainingPlan(payload: CreateTrainingPlanInput) {
  return clientApiFetch<CreatedTrainingPlan>("/api/training-plans", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    message: "Unable to create training plan.",
  });
}

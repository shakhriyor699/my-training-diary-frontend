import type { CreateStudentNutritionPlanInput } from "@/src/features/nutrition/lib/create-student-nutrition-plan.schema";
import type { NutritionPlan } from "@/src/features/nutrition/lib/nutrition.types";
import { clientApiFetch } from "@/src/shared/api/client-fetch";

export function createStudentNutritionPlan(
  studentId: number,
  payload: CreateStudentNutritionPlanInput,
) {
  return clientApiFetch<NutritionPlan>(
    `/api/nutrition/students/${studentId}/plans`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      message: "Unable to create nutrition plan for student.",
    },
  );
}


"use client";

import { createTrainingPlan } from "@/src/features/training-plans/api/create-training-plan";
import { TrainingPlanFormDialog } from "@/src/features/training-plans/components/training-plan-form-dialog";
import type {
  TrainingPlanFormLabels,
  TrainingPlanGoalOption,
} from "@/src/features/training-plans/lib/training-plan-form.types";

type CreateTrainingPlanDialogProps = {
  goalOptions: TrainingPlanGoalOption[];
  labels: TrainingPlanFormLabels;
};

export function CreateTrainingPlanDialog({
  goalOptions,
  labels,
}: CreateTrainingPlanDialogProps) {
  return (
    <TrainingPlanFormDialog
      goalOptions={goalOptions}
      labels={labels}
      onSubmitPlan={createTrainingPlan}
    />
  );
}

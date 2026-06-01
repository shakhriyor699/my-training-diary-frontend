"use client";

import { TrainingPlanFormDialog } from "@/src/features/training-plans/components/training-plan-form-dialog";
import type {
  TrainingPlanFormLabels,
  TrainingPlanGoalOption,
} from "@/src/features/training-plans/lib/training-plan-form.types";

import { createCoachStudentTrainingPlan } from "../api/create-coach-student-training-plan";

type CreateCoachStudentTrainingPlanDialogProps = {
  studentId: number;
  goalOptions: TrainingPlanGoalOption[];
  labels: TrainingPlanFormLabels;
};

export function CreateCoachStudentTrainingPlanDialog({
  studentId,
  goalOptions,
  labels,
}: CreateCoachStudentTrainingPlanDialogProps) {
  return (
    <TrainingPlanFormDialog
      goalOptions={goalOptions}
      labels={labels}
      onSubmitPlan={(payload) =>
        createCoachStudentTrainingPlan(studentId, payload)
      }
    />
  );
}

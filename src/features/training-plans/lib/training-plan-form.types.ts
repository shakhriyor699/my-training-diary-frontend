import type { CreateTrainingPlanInput } from "./create-training-plan.schema";

export type TrainingPlanGoalOption = {
  value: string;
  label: string;
};

export type TrainingPlanFormLabels = {
  trigger: string;
  title: string;
  description: string;
  titleLabel: string;
  titlePlaceholder: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  goalLabel: string;
  deloadAfterWeeksLabel: string;
  deloadPercentLabel: string;
  deloadAfterWeeksPlaceholder: string;
  deloadPercentPlaceholder: string;
  submit: string;
  submitting: string;
  cancel: string;
  success: string;
  errorFallback: string;
  unavailableGoals: string;
  fallbackGoal: string;
};

export type CreatedTrainingPlan = {
  id: number;
  title: string;
  description: string;
  goal: string;
  status: string;
  authorId: number;
  assignedToUserId?: number;
  createdAt: string;
};

export type CreateTrainingPlanMutation = (
  payload: CreateTrainingPlanInput,
) => Promise<CreatedTrainingPlan>;

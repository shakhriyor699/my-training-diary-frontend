import type { MyTrainingPlan } from "./training-plans.types";

export function isCoachAssignedTrainingPlan(
  plan: MyTrainingPlan,
  currentUserId: number,
) {
  return (
    typeof plan.authorId === "number" &&
    typeof plan.assignedToUserId === "number" &&
    plan.assignedToUserId === currentUserId &&
    plan.authorId !== currentUserId
  );
}

export function isTrainingPlanLocked(plan: MyTrainingPlan) {
  return plan.status === "pending";
}

export function canRecordTrainingPlan(plan: MyTrainingPlan) {
  return !isTrainingPlanLocked(plan);
}

export function canManageTrainingPlan(
  plan: MyTrainingPlan,
  currentUserId: number,
) {
  return (
    !isCoachAssignedTrainingPlan(plan, currentUserId) &&
    !isTrainingPlanLocked(plan)
  );
}

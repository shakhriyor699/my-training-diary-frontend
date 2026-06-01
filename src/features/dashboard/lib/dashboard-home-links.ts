import type { MyTrainingPlan, TrainingPlanWorkoutDay } from "@/src/features/training-plans/lib/training-plans.types";
import { canRecordTrainingPlan } from "@/src/features/training-plans/lib/training-plan-access";

type DashboardHomeLinksInput = {
  locale: string;
  plans: MyTrainingPlan[];
  currentUserId?: number;
  currentUserRole?: string;
  lastWorkoutPlanId?: number;
};

type ActiveWorkout = {
  plan: MyTrainingPlan;
  day: TrainingPlanWorkoutDay;
};

export function getDashboardHomeLinks({
  locale,
  plans,
  currentUserId,
  currentUserRole,
  lastWorkoutPlanId,
}: DashboardHomeLinksInput) {
  const activeWorkout = getActiveWorkout({
    plans,
    currentUserId,
    lastWorkoutPlanId,
  });
  const workoutsHref = activeWorkout
    ? createWorkoutRecordHref(locale, activeWorkout.plan.id, activeWorkout.day.id)
    : `/${locale}/dashboard/workouts`;

  return {
    activeWorkout,
    nextWorkoutHref: workoutsHref,
    quickActions: {
      logWorkoutHref: workoutsHref,
      viewPlansHref: `/${locale}/dashboard/plans`,
      findCoachHref:
        currentUserRole === "coach"
          ? `/${locale}/dashboard/my-coach`
          : `/${locale}/dashboard/coaches`,
    },
  };
}

function getActiveWorkout({
  plans,
  currentUserId,
  lastWorkoutPlanId,
}: {
  plans: MyTrainingPlan[];
  currentUserId?: number;
  lastWorkoutPlanId?: number;
}): ActiveWorkout | null {
  const planCandidates = [
    ...getPlansByLastWorkout(plans, lastWorkoutPlanId),
    ...getCoachAssignedPlans(plans, currentUserId),
    ...getApprovedPlans(plans),
    ...plans,
  ];

  for (const plan of planCandidates) {
    if (!canRecordTrainingPlan(plan)) {
      continue;
    }

    const day = getFirstWorkoutDay(plan);

    if (day) {
      return {
        plan,
        day,
      };
    }
  }

  return null;
}

function getPlansByLastWorkout(plans: MyTrainingPlan[], lastWorkoutPlanId?: number) {
  if (!lastWorkoutPlanId) {
    return [];
  }

  return plans.filter((plan) => plan.id === lastWorkoutPlanId);
}

function getCoachAssignedPlans(plans: MyTrainingPlan[], currentUserId?: number) {
  if (!currentUserId) {
    return [];
  }

  return plans.filter(
    (plan) =>
      typeof plan.authorId === "number" &&
      typeof plan.assignedToUserId === "number" &&
      plan.assignedToUserId === currentUserId &&
      plan.authorId !== currentUserId,
  );
}

function getApprovedPlans(plans: MyTrainingPlan[]) {
  return plans.filter((plan) => plan.status === "approved");
}

function getFirstWorkoutDay(plan: MyTrainingPlan) {
  return [...(plan.workoutDays ?? [])].sort((left, right) => left.order - right.order)[0] ?? null;
}

function createWorkoutRecordHref(locale: string, planId: number, dayId: number) {
  const params = new URLSearchParams({
    record: "1",
    planId: String(planId),
    dayId: String(dayId),
  });

  return `/${locale}/dashboard/workouts?${params.toString()}`;
}

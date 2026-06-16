import { getTranslations, setRequestLocale } from "next-intl/server";

import { requireCurrentUser } from "@/src/features/auth/api/get-current-user";
import { UsersPageHeader } from "@/src/features/admin/components/users-page-header";
import { getDisplayNameFromEmail } from "@/src/features/dashboard/lib/dashboard.utils";
import { getMyTrainingPlansSafe } from "@/src/features/training-plans/api/get-my-training-plans";
import { getTrainingPlanReferencesSafe } from "@/src/features/training-plans/api/get-training-plan-references";
import {
  getExerciseTypeLabel,
  getMuscleGroupLabel,
} from "@/src/features/training-plans/lib/get-training-reference-label";
import { WorkoutsPlansBoard } from "@/src/features/training-plans/components/workouts-plans-board";

type WorkoutsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function WorkoutsPage({
  params,
  searchParams,
}: WorkoutsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  const [t, gymCoinT, currentUser, result, referencesResult] = await Promise.all([
    getTranslations("WorkoutsPage"),
    getTranslations("GymCoin.toast"),
    requireCurrentUser(locale),
    getMyTrainingPlansSafe(),
    getTrainingPlanReferencesSafe(),
  ]);

  const exerciseTypeOptions = referencesResult.references.exerciseTypes.map((type) => ({
    value: type,
    label: getExerciseTypeLabel(type, (key) => t(`board.createExercise.${key}`)),
  }));
  const muscleGroupOptions = referencesResult.references.muscleGroups.map((group) => ({
    value: group,
    label: getMuscleGroupLabel(
      group,
      (key) => t(`board.createExercise.${key}`),
    ),
  }));
  const autoOpenPlanId = parsePositiveInteger(getSingleParam(resolvedSearchParams?.planId));
  const autoOpenWorkoutDayId = parsePositiveInteger(
    getSingleParam(resolvedSearchParams?.dayId),
  );
  const shouldAutoOpenRecordDialog = getSingleParam(resolvedSearchParams?.record) === "1";

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-6 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-[1240px] space-y-8">
        <UsersPageHeader
          title={t("title")}
          description={t("description", {
            name: getDisplayNameFromEmail(currentUser.email),
          })}
        />

        {result.hasError ? (
          <section className="rounded-[20px] border border-[#ff6b5d]/16 bg-[#ff6b5d]/8 px-5 py-4 text-sm text-white/78">
            {t("error", {
              message: result.errorMessage ?? t("errorFallback"),
            })}
          </section>
        ) : null}

        {referencesResult.hasError ? (
          <section className="rounded-[20px] border border-[#facc15]/16 bg-[#facc15]/8 px-5 py-4 text-sm text-white/78">
            {t("referencesError", {
              message: referencesResult.errorMessage ?? t("errorFallback"),
            })}
          </section>
        ) : null}

        <WorkoutsPlansBoard
          currentUserId={currentUser.id}
          locale={locale}
          plans={result.plans}
          autoOpenPlanId={shouldAutoOpenRecordDialog ? autoOpenPlanId : undefined}
          autoOpenWorkoutDayId={
            shouldAutoOpenRecordDialog ? autoOpenWorkoutDayId : undefined
          }
          exerciseTypeOptions={exerciseTypeOptions}
          muscleGroupOptions={muscleGroupOptions}
          labels={{
            title: t("board.title"),
            description: t("board.description"),
            empty: t("board.empty"),
            status: t("board.status"),
            rejectionReason: t("board.rejectionReason"),
            noReason: t("board.noReason"),
            managedByCoach: t("board.managedByCoach"),
            managedByCoachDescription: t("board.managedByCoachDescription"),
            workoutDaysTitle: t("board.workoutDaysTitle"),
            workoutDaysEmpty: t("board.workoutDaysEmpty"),
            exercisesTitle: t("board.exercisesTitle"),
            exercisesEmpty: t("board.exercisesEmpty"),
            statuses: {
              pending: t("board.statuses.pending"),
              approved: t("board.statuses.approved"),
              rejected: t("board.statuses.rejected"),
            },
            createDay: {
              trigger: t("board.createDay.trigger"),
              title: t("board.createDay.title"),
              description: t("board.createDay.description"),
              gymCoinTitle: t("board.createDay.gymCoinTitle"),
              gymCoinDescription: t("board.createDay.gymCoinDescription"),
              gymCoinUnavailable: t("board.createDay.gymCoinUnavailable"),
              gymCoinInsufficient: t("board.createDay.gymCoinInsufficient"),
              gymCoinChecking: t("board.createDay.gymCoinChecking"),
              titleLabel: t("board.createDay.titleLabel"),
              titlePlaceholder: t("board.createDay.titlePlaceholder"),
              orderLabel: t("board.createDay.orderLabel"),
              orderPlaceholder: t("board.createDay.orderPlaceholder"),
              submit: t("board.createDay.submit"),
              submitting: t("board.createDay.submitting"),
              cancel: t("board.createDay.cancel"),
              success: t("board.createDay.success"),
              errorFallback: t("board.createDay.errorFallback"),
            },
            deletePlan: {
              trigger: t("board.deletePlan.trigger"),
              confirmTitle: t("board.deletePlan.confirmTitle"),
              confirmDescription: t("board.deletePlan.confirmDescription"),
              confirm: t("board.deletePlan.confirm"),
              deleting: t("board.deletePlan.deleting"),
              cancel: t("board.deletePlan.cancel"),
              success: t("board.deletePlan.success"),
              errorFallback: t("board.deletePlan.errorFallback"),
            },
            recordSession: {
              trigger: t("board.recordSession.trigger"),
              title: t("board.recordSession.title"),
              description: t("board.recordSession.description"),
              noExercises: t("board.recordSession.noExercises"),
              day: t("board.recordSession.day"),
              dayLabel: t("board.recordSession.dayLabel"),
              dayPlaceholder: t("board.recordSession.dayPlaceholder"),
              dateLabel: t("board.recordSession.dateLabel"),
              exercise: t("board.recordSession.exercise"),
              setNumber: t("board.recordSession.setNumber"),
              target: t("board.recordSession.target"),
              weight: t("board.recordSession.weight"),
              reps: t("board.recordSession.reps"),
              rir: t("board.recordSession.rir"),
              weightPlaceholder: t("board.recordSession.weightPlaceholder"),
              repsPlaceholder: t("board.recordSession.repsPlaceholder"),
              rirPlaceholder: t("board.recordSession.rirPlaceholder"),
              submit: t("board.recordSession.submit"),
              submitting: t("board.recordSession.submitting"),
              cancel: t("board.recordSession.cancel"),
              success: t("board.recordSession.success"),
              errorFallback: t("board.recordSession.errorFallback"),
              emptySets: t("board.recordSession.emptySets"),
              incompleteSet: t("board.recordSession.incompleteSet"),
              savedReadonly: t("board.recordSession.savedReadonly"),
              readonlyHint: t("board.recordSession.readonlyHint"),
              recommendationTitle: t("board.recordSession.recommendationTitle"),
              message: t("board.recordSession.message"),
              reason: t("board.recordSession.reason"),
              currentWeight: t("board.recordSession.currentWeight"),
              recommendedWeight: t("board.recordSession.recommendedWeight"),
              increaseBy: t("board.recordSession.increaseBy"),
              actions: {
                start: t("board.recordSession.actions.start"),
                increase_reps: t("board.recordSession.actions.increase_reps"),
                increase_weight: t("board.recordSession.actions.increase_weight"),
                keep_weight: t("board.recordSession.actions.keep_weight"),
                deload: t("board.recordSession.actions.deload"),
              },
              gymCoinReward: {
                rewarded: gymCoinT.raw("rewarded"),
                rewardedFallback: gymCoinT.raw("rewardedFallback"),
                reasons: {
                  daily_login_reward: gymCoinT("reasons.daily_login_reward"),
                  welcome_bonus: gymCoinT("reasons.welcome_bonus"),
                  training_session_reward: gymCoinT("reasons.training_session_reward"),
                  training_completion_reward: gymCoinT("reasons.training_completion_reward"),
                  completed_training: gymCoinT("reasons.completed_training"),
                  record_training_session: gymCoinT("reasons.record_training_session"),
                },
              },
            },
            createExercise: {
              trigger: t("board.createExercise.trigger"),
              title: t("board.createExercise.title"),
              description: t("board.createExercise.description"),
              gymCoinTitle: t("board.createExercise.gymCoinTitle"),
              gymCoinDescription: t("board.createExercise.gymCoinDescription"),
              gymCoinUnavailable: t("board.createExercise.gymCoinUnavailable"),
              gymCoinInsufficient: t("board.createExercise.gymCoinInsufficient"),
              gymCoinChecking: t("board.createExercise.gymCoinChecking"),
              nameLabel: t("board.createExercise.nameLabel"),
              namePlaceholder: t("board.createExercise.namePlaceholder"),
              descriptionLabel: t("board.createExercise.descriptionLabel"),
              descriptionPlaceholder: t("board.createExercise.descriptionPlaceholder"),
              orderLabel: t("board.createExercise.orderLabel"),
              orderPlaceholder: t("board.createExercise.orderPlaceholder"),
              typeLabel: t("board.createExercise.typeLabel"),
              muscleGroupLabel: t("board.createExercise.muscleGroupLabel"),
              targetSetsLabel: t("board.createExercise.targetSetsLabel"),
              minRepsLabel: t("board.createExercise.minRepsLabel"),
              maxRepsLabel: t("board.createExercise.maxRepsLabel"),
              targetRirLabel: t("board.createExercise.targetRirLabel"),
              weightStepLabel: t("board.createExercise.weightStepLabel"),
              targetSetsPlaceholder: t("board.createExercise.targetSetsPlaceholder"),
              minRepsPlaceholder: t("board.createExercise.minRepsPlaceholder"),
              maxRepsPlaceholder: t("board.createExercise.maxRepsPlaceholder"),
              targetRirPlaceholder: t("board.createExercise.targetRirPlaceholder"),
              weightStepPlaceholder: t("board.createExercise.weightStepPlaceholder"),
              submit: t("board.createExercise.submit"),
              submitting: t("board.createExercise.submitting"),
              cancel: t("board.createExercise.cancel"),
              success: t("board.createExercise.success"),
              errorFallback: t("board.createExercise.errorFallback"),
              unavailableTypes: t("board.createExercise.unavailableTypes"),
              unavailableMuscleGroups: t("board.createExercise.unavailableMuscleGroups"),
              fallbackType: t("board.createExercise.fallbackType"),
              fallbackMuscleGroup: t("board.createExercise.fallbackMuscleGroup"),
            },
            editExercise: {
              trigger: t("board.editExercise.trigger"),
              title: t("board.editExercise.title"),
              description: t("board.editExercise.description"),
              nameLabel: t("board.editExercise.nameLabel"),
              namePlaceholder: t("board.editExercise.namePlaceholder"),
              descriptionLabel: t("board.editExercise.descriptionLabel"),
              descriptionPlaceholder: t("board.editExercise.descriptionPlaceholder"),
              orderLabel: t("board.editExercise.orderLabel"),
              orderPlaceholder: t("board.editExercise.orderPlaceholder"),
              typeLabel: t("board.editExercise.typeLabel"),
              muscleGroupLabel: t("board.editExercise.muscleGroupLabel"),
              targetSetsLabel: t("board.editExercise.targetSetsLabel"),
              minRepsLabel: t("board.editExercise.minRepsLabel"),
              maxRepsLabel: t("board.editExercise.maxRepsLabel"),
              targetRirLabel: t("board.editExercise.targetRirLabel"),
              weightStepLabel: t("board.editExercise.weightStepLabel"),
              targetSetsPlaceholder: t("board.editExercise.targetSetsPlaceholder"),
              minRepsPlaceholder: t("board.editExercise.minRepsPlaceholder"),
              maxRepsPlaceholder: t("board.editExercise.maxRepsPlaceholder"),
              targetRirPlaceholder: t("board.editExercise.targetRirPlaceholder"),
              weightStepPlaceholder: t("board.editExercise.weightStepPlaceholder"),
              submit: t("board.editExercise.submit"),
              submitting: t("board.editExercise.submitting"),
              cancel: t("board.editExercise.cancel"),
              success: t("board.editExercise.success"),
              errorFallback: t("board.editExercise.errorFallback"),
              unavailableTypes: t("board.editExercise.unavailableTypes"),
              unavailableMuscleGroups: t("board.editExercise.unavailableMuscleGroups"),
              fallbackType: t("board.editExercise.fallbackType"),
              fallbackMuscleGroup: t("board.editExercise.fallbackMuscleGroup"),
            },
            deleteExercise: {
              trigger: t("board.deleteExercise.trigger"),
              confirmTitle: t("board.deleteExercise.confirmTitle"),
              confirmDescription: t("board.deleteExercise.confirmDescription"),
              confirm: t("board.deleteExercise.confirm"),
              deleting: t("board.deleteExercise.deleting"),
              cancel: t("board.deleteExercise.cancel"),
              success: t("board.deleteExercise.success"),
              errorFallback: t("board.deleteExercise.errorFallback"),
            },
            editDay: {
              trigger: t("board.editDay.trigger"),
              title: t("board.editDay.title"),
              description: t("board.editDay.description"),
              titleLabel: t("board.editDay.titleLabel"),
              titlePlaceholder: t("board.editDay.titlePlaceholder"),
              orderLabel: t("board.editDay.orderLabel"),
              orderPlaceholder: t("board.editDay.orderPlaceholder"),
              submit: t("board.editDay.submit"),
              submitting: t("board.editDay.submitting"),
              cancel: t("board.editDay.cancel"),
              success: t("board.editDay.success"),
              errorFallback: t("board.editDay.errorFallback"),
            },
            deleteDay: {
              trigger: t("board.deleteDay.trigger"),
              confirmTitle: t("board.deleteDay.confirmTitle"),
              confirmDescription: t("board.deleteDay.confirmDescription"),
              confirm: t("board.deleteDay.confirm"),
              deleting: t("board.deleteDay.deleting"),
              cancel: t("board.deleteDay.cancel"),
              success: t("board.deleteDay.success"),
              errorFallback: t("board.deleteDay.errorFallback"),
            },
            viewHistory: t("board.viewHistory"),
          }}
        />
      </div>
    </main>
  );
}

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePositiveInteger(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const parsedValue = Number.parseInt(value, 10);

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : undefined;
}

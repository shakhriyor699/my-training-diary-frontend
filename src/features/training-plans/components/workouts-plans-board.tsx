import Link from "next/link";

import { CreateWorkoutDayDialog } from "./create-workout-day-dialog";
import { DeleteTrainingPlanButton } from "./delete-training-plan-button";
import { CreateWorkoutExerciseDialog } from "./create-workout-exercise-dialog";
import { DeleteWorkoutDayButton } from "./delete-workout-day-button";
import { DeleteWorkoutExerciseButton } from "./delete-workout-exercise-button";
import { EditWorkoutDayDialog } from "./edit-workout-day-dialog";
import { EditWorkoutExerciseDialog } from "./edit-workout-exercise-dialog";
import { RecordTrainingSessionDialog } from "./record-training-session-dialog";
import {
  canManageTrainingPlan,
  canRecordTrainingPlan,
  isCoachAssignedTrainingPlan,
} from "../lib/training-plan-access";
import type { MyTrainingPlan } from "../lib/training-plans.types";

type SelectOption = {
  value: string;
  label: string;
};

type WorkoutsPlansBoardProps = {
  currentUserId: number;
  locale: string;
  plans: MyTrainingPlan[];
  autoOpenPlanId?: number;
  autoOpenWorkoutDayId?: number;
  exerciseTypeOptions: SelectOption[];
  muscleGroupOptions: SelectOption[];
  labels: {
    title: string;
    description: string;
    empty: string;
    status: string;
    rejectionReason: string;
    noReason: string;
    managedByCoach: string;
    managedByCoachDescription: string;
    workoutDaysTitle: string;
    workoutDaysEmpty: string;
    exercisesTitle: string;
    exercisesEmpty: string;
    statuses: {
      pending: string;
      approved: string;
      rejected: string;
    };
    createDay: {
      trigger: string;
      title: string;
      description: string;
      titleLabel: string;
      titlePlaceholder: string;
      orderLabel: string;
      orderPlaceholder: string;
      submit: string;
      submitting: string;
      cancel: string;
      success: string;
      errorFallback: string;
    };
    deletePlan: {
      trigger: string;
      confirmTitle: string;
      confirmDescription: string;
      confirm: string;
      deleting: string;
      cancel: string;
      success: string;
      errorFallback: string;
    };
    recordSession: {
      trigger: string;
      title: string;
      description: string;
      noExercises: string;
      day: string;
      dayLabel: string;
      dayPlaceholder: string;
      dateLabel: string;
      exercise: string;
      setNumber: string;
      target: string;
      weight: string;
      reps: string;
      rir: string;
      weightPlaceholder: string;
      repsPlaceholder: string;
      rirPlaceholder: string;
      submit: string;
      submitting: string;
      cancel: string;
      success: string;
      errorFallback: string;
      emptySets: string;
      incompleteSet: string;
      savedReadonly: string;
      readonlyHint: string;
      recommendationTitle: string;
      message: string;
      reason: string;
      currentWeight: string;
      recommendedWeight: string;
      increaseBy: string;
      actions: {
        start: string;
        increase_reps: string;
        increase_weight: string;
        keep_weight: string;
        deload: string;
      };
    };
    createExercise: {
      trigger: string;
      title: string;
      description: string;
      nameLabel: string;
      namePlaceholder: string;
      descriptionLabel: string;
      descriptionPlaceholder: string;
      orderLabel: string;
      orderPlaceholder: string;
      typeLabel: string;
      muscleGroupLabel: string;
      targetSetsLabel: string;
      minRepsLabel: string;
      maxRepsLabel: string;
      targetRirLabel: string;
      weightStepLabel: string;
      targetSetsPlaceholder: string;
      minRepsPlaceholder: string;
      maxRepsPlaceholder: string;
      targetRirPlaceholder: string;
      weightStepPlaceholder: string;
      submit: string;
      submitting: string;
      cancel: string;
      success: string;
      errorFallback: string;
      unavailableTypes: string;
      unavailableMuscleGroups: string;
      fallbackType: string;
      fallbackMuscleGroup: string;
    };
    editExercise: {
      trigger: string;
      title: string;
      description: string;
      nameLabel: string;
      namePlaceholder: string;
      descriptionLabel: string;
      descriptionPlaceholder: string;
      orderLabel: string;
      orderPlaceholder: string;
      typeLabel: string;
      muscleGroupLabel: string;
      targetSetsLabel: string;
      minRepsLabel: string;
      maxRepsLabel: string;
      targetRirLabel: string;
      weightStepLabel: string;
      targetSetsPlaceholder: string;
      minRepsPlaceholder: string;
      maxRepsPlaceholder: string;
      targetRirPlaceholder: string;
      weightStepPlaceholder: string;
      submit: string;
      submitting: string;
      cancel: string;
      success: string;
      errorFallback: string;
      unavailableTypes: string;
      unavailableMuscleGroups: string;
      fallbackType: string;
      fallbackMuscleGroup: string;
    };
    deleteExercise: {
      trigger: string;
      confirmTitle: string;
      confirmDescription: string;
      confirm: string;
      deleting: string;
      cancel: string;
      success: string;
      errorFallback: string;
    };
    editDay: {
      trigger: string;
      title: string;
      description: string;
      titleLabel: string;
      titlePlaceholder: string;
      orderLabel: string;
      orderPlaceholder: string;
      submit: string;
      submitting: string;
      cancel: string;
      success: string;
      errorFallback: string;
    };
    deleteDay: {
      trigger: string;
      confirmTitle: string;
      confirmDescription: string;
      confirm: string;
      deleting: string;
      cancel: string;
      success: string;
      errorFallback: string;
    };
    viewHistory: string;
  };
};

export function WorkoutsPlansBoard({
  currentUserId,
  locale,
  plans,
  autoOpenPlanId,
  autoOpenWorkoutDayId,
  exerciseTypeOptions,
  muscleGroupOptions,
  labels,
}: WorkoutsPlansBoardProps) {
  return (
    <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
      <div className="mb-6">
        <h2 className="text-[32px] font-semibold text-white">{labels.title}</h2>
        <p className="mt-1 text-lg text-white/42">{labels.description}</p>
      </div>

      {plans.length === 0 ? (
        <div className="rounded-[18px] border border-dashed border-white/10 bg-black/20 px-6 py-12 text-center text-white/52">
          {labels.empty}
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {plans.map((plan) => {
            const isCoachAssigned = isCoachAssignedTrainingPlan(plan, currentUserId);
            const canManage = canManageTrainingPlan(plan, currentUserId);
            const canRecord = canRecordTrainingPlan(plan);

            return (
            <article
              key={plan.id}
              className="overflow-hidden rounded-[26px] border border-white/10 bg-[#2b2b28] shadow-[0_24px_80px_rgba(0,0,0,0.24)]"
            >
              {isCoachAssigned ? (
                <div className="border-b border-[#39d353]/16 bg-[#39d353]/8 px-5 py-4 text-sm text-white/76">
                  <p className="font-medium text-[#a9f2a7]">
                    {labels.managedByCoach}
                  </p>
                  <p className="mt-1 text-white/64">
                    {labels.managedByCoachDescription}
                  </p>
                </div>
              ) : null}

              <div className="px-5 py-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-full border border-white/10 bg-[#242422] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                      ID {plan.id}
                    </span>
                    <StatusBadge status={plan.status} labels={labels.statuses} />
                  </div>

                  {canManage ? (
                    <DeleteTrainingPlanButton
                      plan={plan}
                      triggerClassName="h-10 rounded-[10px] border-white/14 bg-transparent px-4 text-white/82 hover:border-[#ff6b5d]/30 hover:bg-[#ff6b5d]/10 hover:text-[#ffb0a8]"
                      labels={labels.deletePlan}
                    />
                  ) : null}
                </div>

                <div className="mt-4">
                  <h3 className="text-[42px] font-semibold leading-none tracking-[-0.04em] text-white">
                    {plan.title}
                  </h3>
                  {plan.description ? (
                    <p className="mt-3 text-base leading-7 text-white/66">
                      {plan.description}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="border-t border-white/8 px-5 py-5">
                <p className="text-xs uppercase tracking-[0.18em] text-white/38">
                  {labels.rejectionReason}
                </p>
                <div className="mt-3 rounded-[14px] border-l-2 border-white/16 bg-[#232321] px-4 py-3">
                  <p className="text-sm leading-7 text-white/72">
                    {plan.rejectionReason ?? labels.noReason}
                  </p>
                </div>
              </div>

              <div className="border-t border-white/8 px-5 py-5">
                <p className="text-xs uppercase tracking-[0.18em] text-white/38">
                  {labels.workoutDaysTitle}
                </p>

                {plan.workoutDays && plan.workoutDays.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {plan.workoutDays.map((day) => (
                      <div
                        key={day.id}
                        className="overflow-hidden rounded-[18px] border border-white/8 bg-[#21211f]"
                      >
                        <div className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-start md:justify-between">
                          <div className="min-w-0">
                            <p className="text-[32px] font-semibold leading-none tracking-[-0.03em] text-white">
                              {day.title}
                            </p>
                            <p className="mt-2 text-sm text-white/48">Order {day.order}</p>
                          </div>

                          <div className="flex flex-col gap-2 sm:flex-row md:flex-col md:items-stretch">
                            <Link
                              href={`/${locale}/dashboard/workouts/${day.id}/history`}
                              className="inline-flex h-11 min-w-[150px] items-center justify-center rounded-[12px] border border-white/14 bg-white/[0.02] px-4 text-sm font-medium text-white/84 transition hover:bg-white/[0.05]"
                            >
                              {labels.viewHistory}
                            </Link>
                            {canManage ? (
                              <EditWorkoutDayDialog
                                day={day}
                                triggerClassName="h-11 min-w-[150px] rounded-[12px] border-white/14 bg-white/[0.02] text-white/84 hover:bg-white/[0.05]"
                                labels={labels.editDay}
                              />
                            ) : null}
                            {canManage ? (
                              <DeleteWorkoutDayButton
                                day={day}
                                triggerClassName="h-11 min-w-[150px] rounded-[12px] border-white/14 bg-transparent text-white/84 hover:border-[#ff6b5d]/30 hover:bg-[#ff6b5d]/10 hover:text-[#ffb0a8]"
                                labels={labels.deleteDay}
                              />
                            ) : null}
                          </div>
                        </div>

                        <div className="border-t border-white/8 px-4 py-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-white/38">
                            {labels.exercisesTitle}
                          </p>

                          {(day.exercises ?? []).length > 0 ? (
                            <div className="mt-3 space-y-3">
                              {(day.exercises ?? []).map((exercise) => (
                                <div
                                  key={exercise.id}
                                  className="rounded-[14px] border border-white/8 bg-black/18 px-4 py-3"
                                >
                                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0">
                                      <div className="flex flex-wrap items-center gap-3">
                                        <p className="font-medium text-white">{exercise.name}</p>
                                        {exercise.order ? (
                                          <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-white/52">
                                            #{exercise.order}
                                          </span>
                                        ) : null}
                                      </div>
                                      <p className="mt-1 text-sm text-white/46">
                                        {exercise.type} • {exercise.muscleGroup}
                                      </p>
                                    </div>

                                    {canManage ? (
                                      <div className="flex flex-col gap-2 sm:flex-row">
                                        <EditWorkoutExerciseDialog
                                          exercise={exercise}
                                          exerciseTypeOptions={exerciseTypeOptions}
                                          muscleGroupOptions={muscleGroupOptions}
                                          triggerClassName="h-10 rounded-[10px] border-white/14 bg-white/[0.02] px-4 text-white/82 hover:bg-white/[0.05]"
                                          labels={labels.editExercise}
                                        />
                                        <DeleteWorkoutExerciseButton
                                          exercise={exercise}
                                          triggerClassName="h-10 rounded-[10px] border-white/14 bg-transparent px-4 text-white/82 hover:border-[#ff6b5d]/30 hover:bg-[#ff6b5d]/10 hover:text-[#ffb0a8]"
                                          labels={labels.deleteExercise}
                                        />
                                      </div>
                                    ) : null}
                                  </div>
                                  <p className="mt-2 text-sm leading-6 text-white/64">
                                    {exercise.targetSets} x {exercise.minReps}-{exercise.maxReps} • RIR {exercise.targetRir} • {exercise.weightStep}
                                  </p>
                                  {exercise.description ? (
                                    <p className="mt-2 text-sm leading-6 text-white/56">
                                      {exercise.description}
                                    </p>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="mt-3 text-sm italic leading-6 text-white/52">
                              {labels.exercisesEmpty}
                            </p>
                          )}

                          {canManage ? (
                            <CreateWorkoutExerciseDialog
                              day={day}
                              exerciseTypeOptions={exerciseTypeOptions}
                              muscleGroupOptions={muscleGroupOptions}
                              triggerClassName="mt-4 h-12 w-full justify-start rounded-[12px] border border-white/14 bg-transparent px-4 text-white shadow-none hover:bg-white/[0.04] sm:w-auto"
                              labels={labels.createExercise}
                            />
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm italic leading-6 text-white/52">
                    {labels.workoutDaysEmpty}
                  </p>
                )}
              </div>

              <div className="border-t border-white/8 px-5 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  {canRecord ? (
                    <RecordTrainingSessionDialog
                      plan={plan}
                      initialWorkoutDayId={
                        autoOpenPlanId === plan.id ? autoOpenWorkoutDayId : undefined
                      }
                      initiallyOpen={autoOpenPlanId === plan.id}
                      triggerClassName="rounded-[12px] px-5"
                      labels={labels.recordSession}
                    />
                  ) : null}
                  {canManage ? (
                    <CreateWorkoutDayDialog
                      plan={plan}
                      triggerClassName="rounded-[12px] border border-white/14 bg-transparent px-5 text-white shadow-none hover:bg-white/[0.04] hover:text-white"
                      labels={labels.createDay}
                    />
                  ) : null}
                </div>
              </div>
            </article>
          );
          })}
        </div>
      )}
    </section>
  );
}

function StatusBadge({
  status,
  labels,
}: {
  status: MyTrainingPlan["status"];
  labels: WorkoutsPlansBoardProps["labels"]["statuses"];
}) {
  const text = labels[status];
  const className =
    status === "approved"
      ? "border-[#39d353]/18 bg-[#39d353]/10 text-[#a9f2a7]"
      : status === "rejected"
        ? "border-[#ff6b5d]/18 bg-[#ff6b5d]/10 text-[#ffb0a8]"
        : "border-[#c9b47d]/20 bg-[#eadfbc] text-[#5d4520]";

  return (
    <span
      className={[
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
        className,
      ].join(" ")}
    >
      {text}
    </span>
  );
}

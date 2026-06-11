"use client";

import type {
  ExerciseRecommendation,
  ExerciseRecommendationAction,
} from "@/src/features/training-plans/lib/training-plans.types";
import type { RecordTrainingSessionDialogProps } from "@/src/features/training-plans/components/record-training-session-dialog.types";
import { useRecordTrainingSessionDialog } from "@/src/features/training-plans/components/use-record-training-session-dialog";
import { cn } from "@/src/shared/lib/utils";

export function RecordTrainingSessionDialog({
  plan,
  triggerClassName,
  initialWorkoutDayId,
  initiallyOpen = false,
  labels,
}: RecordTrainingSessionDialogProps) {
  const {
    exerciseRecommendationsById,
    formError,
    groupedRows,
    handleClose,
    handleOpen,
    handleRowChange,
    handleSessionDateChange,
    handleSubmit,
    handleWorkoutDayChange,
    hasExercises,
    hasReadonlyRows,
    isLoadingExistingSession,
    isOpen,
    isPending,
    isSubmitting,
    selectedWorkoutDayId,
    sessionDate,
    workoutDays,
  } = useRecordTrainingSessionDialog({
    plan,
    initialWorkoutDayId,
    initiallyOpen,
    labels,
  });

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        disabled={workoutDays.length === 0}
        className={cn(
          "inline-flex h-11 items-center justify-center rounded-xl bg-[#1cc31c] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#27d927] disabled:opacity-60",
          triggerClassName,
        )}
      >
        {labels.trigger}
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center overflow-hidden bg-black/70 px-0 sm:items-center sm:px-4"
          onClick={handleClose}
        >
          <div
            className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-[28px] border border-white/8 bg-[#090909] shadow-[0_24px_120px_rgba(0,0,0,0.42)] sm:rounded-[24px]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-white/8 px-4 pb-4 pt-4 sm:px-6 sm:pb-5 sm:pt-6">
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/12 sm:hidden" />
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-white">{labels.title}</h2>
                <p className="text-sm text-white/48">{labels.description}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">
              <div className="mb-5 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-white/38">
                    {labels.dayLabel}
                  </span>
                  <select
                    value={selectedWorkoutDayId}
                    onChange={(event) =>
                      handleWorkoutDayChange(Number(event.target.value))
                    }
                    className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10"
                  >
                    {workoutDays.length === 0 ? (
                      <option value="0" className="bg-[#090909] text-white">
                        {labels.dayPlaceholder}
                      </option>
                    ) : (
                      workoutDays.map((day) => (
                        <option key={day.id} value={day.id} className="bg-[#090909] text-white">
                          {day.title}
                        </option>
                      ))
                    )}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-white/38">
                    {labels.dateLabel}
                  </span>
                  <input
                    type="date"
                    value={sessionDate}
                    onChange={(event) => handleSessionDateChange(event.target.value)}
                    className="h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm text-white outline-none transition-colors focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10 disabled:opacity-60"
                  />
                </label>
              </div>

              {isLoadingExistingSession ? (
                <div className="mb-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/62">
                  Loading saved sets for {sessionDate}...
                </div>
              ) : null}

              {!hasExercises ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-5 py-6 text-sm text-white/58">
                  {labels.noExercises}
                </div>
              ) : (
                <div className="space-y-4">
                  {groupedRows.map((exerciseGroup) => (
                    <div
                      key={`${selectedWorkoutDayId}-${exerciseGroup.exerciseId}`}
                      className="rounded-[18px] border border-white/8 bg-white/[0.03] p-4"
                    >
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-white">{exerciseGroup.exerciseName}</p>
                          <p className="mt-1 text-sm text-white/48">
                            {labels.target}: {exerciseGroup.targetLabel}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-3">
                        {exerciseGroup.rows.map((row) => (
                          <div
                            key={`${row.exerciseId}-${row.setNumber}`}
                            className={cn(
                              "grid gap-3 rounded-2xl border p-3 md:grid-cols-[90px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]",
                              row.readonly
                                ? "border-[#1cc31c]/20 bg-[#1cc31c]/[0.06]"
                                : "border-white/8 bg-black/20",
                            )}
                          >
                            <div>
                              <p className="text-xs uppercase tracking-[0.14em] text-white/38">
                                {labels.setNumber}
                              </p>
                              <p className="mt-2 text-sm font-semibold text-white">
                                #{row.setNumber}
                              </p>
                              {row.readonly ? (
                                <p className="mt-2 text-xs font-medium text-[#7ee787]">
                                  {labels.savedReadonly}
                                </p>
                              ) : null}
                            </div>

                            <InputField
                              label={labels.weight}
                              value={row.weight}
                              placeholder={labels.weightPlaceholder}
                              readOnly={row.readonly}
                              onChange={(value) => handleRowChange(row.index, "weight", value)}
                            />
                            <InputField
                              label={labels.reps}
                              value={row.reps}
                              placeholder={labels.repsPlaceholder}
                              readOnly={row.readonly}
                              onChange={(value) => handleRowChange(row.index, "reps", value)}
                            />
                            <InputField
                              label={labels.rir}
                              value={row.rir}
                              placeholder={labels.rirPlaceholder}
                              readOnly={row.readonly}
                              onChange={(value) => handleRowChange(row.index, "rir", value)}
                            />
                          </div>
                        ))}
                      </div>

                      {exerciseRecommendationsById[exerciseGroup.exerciseId] ? (
                        <RecommendationCard
                          recommendation={
                            exerciseRecommendationsById[
                              exerciseGroup.exerciseId
                            ] as ExerciseRecommendation
                          }
                          labels={{
                            title: labels.recommendationTitle,
                            message: labels.message,
                            reason: labels.reason,
                            currentWeight: labels.currentWeight,
                            recommendedWeight: labels.recommendedWeight,
                            increaseBy: labels.increaseBy,
                            actions: labels.actions,
                          }}
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              )}

              {formError ? (
                <div className="mt-4 rounded-2xl border border-[#ff7b72]/18 bg-[#ff7b72]/8 px-4 py-3 text-sm text-[#ff7b72]">
                  {formError}
                </div>
              ) : hasReadonlyRows ? (
                <div className="mt-4 rounded-2xl border border-[#1cc31c]/16 bg-[#1cc31c]/8 px-4 py-3 text-sm text-[#b8f7b8]">
                  {labels.readonlyHint}
                </div>
              ) : null}
            </div>

            <div
              className="sticky bottom-0 border-t border-white/8 bg-[#090909]/95 px-4 py-4 backdrop-blur sm:px-6"
              style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
            >
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-white/8 bg-white/[0.02] px-4 text-sm font-medium text-white/78 transition-colors hover:bg-white/[0.05] hover:text-white sm:w-auto"
                >
                  {labels.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || isPending || isLoadingExistingSession || !hasExercises}
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#1cc31c] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#27d927] disabled:opacity-60 sm:h-11 sm:w-auto"
                >
                  {isSubmitting || isPending ? labels.submitting : labels.submit}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function InputField({
  label,
  value,
  placeholder,
  readOnly,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  readOnly?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="block text-xs uppercase tracking-[0.14em] text-white/38">
        {label}
      </span>
      <input
        type="number"
        min="0"
        step="0.5"
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-11 w-full rounded-xl border px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28",
          readOnly
            ? "border-[#1cc31c]/16 bg-[#1cc31c]/[0.05] text-white/70"
            : "border-white/8 bg-white/[0.03] focus:border-[#1cc31c]/50 focus:ring-4 focus:ring-[#1cc31c]/10",
        )}
      />
    </label>
  );
}

function RecommendationCard({
  recommendation,
  labels,
}: {
  recommendation: ExerciseRecommendation;
  labels: {
    title: string;
    message: string;
    reason: string;
    currentWeight: string;
    recommendedWeight: string;
    increaseBy: string;
    actions: Record<ExerciseRecommendationAction, string>;
  };
}) {
  return (
    <div className="mt-4 rounded-[16px] border border-[#1cc31c]/16 bg-[#1cc31c]/8 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-xs uppercase tracking-[0.14em] text-[#b8f7b8]">
          {labels.title}
        </p>
        <span className="inline-flex rounded-full border border-[#1cc31c]/20 bg-[#1cc31c]/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#d6ffd6]">
          {labels.actions[recommendation.action]}
        </span>
      </div>

      <p className="mt-3 text-sm font-medium text-white">
        {labels.message}: {recommendation.message}
      </p>
      <p className="mt-2 text-sm leading-6 text-white/72">
        {labels.reason}: {recommendation.reason}
      </p>

      <div className="mt-3 flex flex-wrap gap-3 text-sm text-white/72">
        {typeof recommendation.currentWeight === "number" ? (
          <span>
            {labels.currentWeight}: {recommendation.currentWeight}
          </span>
        ) : null}
        {typeof recommendation.recommendedWeight === "number" ? (
          <span>
            {labels.recommendedWeight}: {recommendation.recommendedWeight}
          </span>
        ) : null}
        {typeof recommendation.increaseBy === "number" ? (
          <span>
            {labels.increaseBy}: {recommendation.increaseBy}
          </span>
        ) : null}
      </div>
    </div>
  );
}

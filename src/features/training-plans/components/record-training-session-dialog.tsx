"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "react-toastify";

import { createTrainingSession } from "@/src/features/training-plans/api/create-training-session";
import { getExerciseRecommendationClient } from "@/src/features/training-plans/api/get-exercise-recommendation-client";
import { getMyTrainingSessionsClient } from "@/src/features/training-plans/api/get-my-training-sessions-client";
import { getNextWorkoutDayRecommendationsClient } from "@/src/features/training-plans/api/get-next-workout-day-recommendations-client";
import { updateTrainingSession } from "@/src/features/training-plans/api/update-training-session";
import {
  createTrainingSessionSchema,
  type TrainingSessionExerciseInput,
  type TrainingSessionSetInput,
} from "@/src/features/training-plans/lib/create-training-session.schema";
import type {
  ExerciseRecommendation,
  ExerciseRecommendationAction,
  MyTrainingPlan,
  MyTrainingSession,
  NextWorkoutDayRecommendationItem,
  TrainingPlanExercise,
  TrainingPlanWorkoutDay,
} from "@/src/features/training-plans/lib/training-plans.types";
import { cn } from "@/src/shared/lib/utils";

type SessionRow = {
  exerciseId: number;
  setNumber: number;
  exerciseName: string;
  targetLabel: string;
  weight: string;
  reps: string;
  rir: string;
  readonly: boolean;
};

type RecordTrainingSessionDialogProps = {
  plan: MyTrainingPlan;
  triggerClassName?: string;
  initialWorkoutDayId?: number;
  initiallyOpen?: boolean;
  labels: {
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
};

export function RecordTrainingSessionDialog({
  plan,
  triggerClassName,
  initialWorkoutDayId,
  initiallyOpen = false,
  labels,
}: RecordTrainingSessionDialogProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const workoutDays = plan.workoutDays ?? [];
  const defaultWorkoutDayId = workoutDays[0]?.id ?? 0;
  const resolvedInitialWorkoutDayId = workoutDays.some((day) => day.id === initialWorkoutDayId)
    ? initialWorkoutDayId
    : defaultWorkoutDayId;
  const [isOpen, setIsOpen] = useState(initiallyOpen && workoutDays.length > 0);
  const [isPending, startTransition] = useTransition();
  const [selectedWorkoutDayId, setSelectedWorkoutDayId] = useState(
    resolvedInitialWorkoutDayId,
  );
  const selectedWorkoutDay = workoutDays.find((day) => day.id === selectedWorkoutDayId) ?? null;
  const [sessionDate, setSessionDate] = useState(getDefaultSessionDate());
  const [existingSession, setExistingSession] = useState<MyTrainingSession | null>(null);
  const [isLoadingExistingSession, setIsLoadingExistingSession] = useState(
    initiallyOpen && Boolean(resolvedInitialWorkoutDayId),
  );
  const [exerciseRecommendationsById, setExerciseRecommendationsById] = useState<
    Record<number, ExerciseRecommendation | null>
  >({});

  const templateRows = useMemo(
    () => createSessionRows(selectedWorkoutDay, existingSession),
    [existingSession, selectedWorkoutDay],
  );
  const [rows, setRows] = useState<SessionRow[]>(templateRows);

  function resetSessionState(nextWorkoutDay: TrainingPlanWorkoutDay | null) {
    setExistingSession(null);
    setExerciseRecommendationsById({});
    setRows(createSessionRows(nextWorkoutDay, null));
    setIsLoadingExistingSession(false);
  }

  function handleClose() {
    resetSessionState(selectedWorkoutDay);
    setFormError(null);
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyTouchAction = body.style.touchAction;
    const previousHtmlOverflow = documentElement.style.overflow;

    body.style.overflow = "hidden";
    body.style.touchAction = "none";
    documentElement.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousBodyOverflow;
      body.style.touchAction = previousBodyTouchAction;
      documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !selectedWorkoutDay) {
      return;
    }

    let isCancelled = false;

    Promise.all([
      getMyTrainingSessionsClient({
        page: 1,
        limit: 100,
        date: sessionDate,
      }),
      getNextWorkoutDayRecommendationsClient(selectedWorkoutDay.id),
    ])
      .then(async ([dateResponse, recommendationsResponse]) => {
        if (isCancelled) {
          return;
        }

        const matchedSession =
          dateResponse.data.find(
            (session) =>
              session.workoutDay.id === selectedWorkoutDay.id &&
              session.date.slice(0, 10) === sessionDate,
          ) ?? null;
        const nextExerciseRecommendationsById = Object.fromEntries(
          (recommendationsResponse.recommendations ?? []).map((item: NextWorkoutDayRecommendationItem) => [
            item.exerciseId,
            item.recommendation,
          ]),
        ) as Record<number, ExerciseRecommendation | null>;
        const missingExerciseIds = (selectedWorkoutDay.exercises ?? [])
          .map((exercise) => exercise.id)
          .filter((exerciseId) => !nextExerciseRecommendationsById[exerciseId]);

        const fallbackRecommendations = await Promise.all(
          missingExerciseIds.map(async (exerciseId) => {
            try {
              const recommendation = await getExerciseRecommendationClient(exerciseId);
              return [exerciseId, recommendation] as const;
            } catch {
              return [exerciseId, null] as const;
            }
          }),
        );

        fallbackRecommendations.forEach(([exerciseId, recommendation]) => {
          nextExerciseRecommendationsById[exerciseId] = recommendation;
        });

        setExistingSession(matchedSession);
        setExerciseRecommendationsById(nextExerciseRecommendationsById);
        setRows(createSessionRows(selectedWorkoutDay, matchedSession));
      })
      .catch((error) => {
        if (isCancelled) {
          return;
        }

        setExistingSession(null);
        setExerciseRecommendationsById({});
        setRows(createSessionRows(selectedWorkoutDay, null));
        setFormError(
          error instanceof Error ? error.message : labels.errorFallback,
        );
      })
      .finally(() => {
        if (isCancelled) {
          return;
        }

        setIsLoadingExistingSession(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [
    isOpen,
    labels.errorFallback,
    selectedWorkoutDay,
    sessionDate,
  ]);

  const mutation = useMutation({
    mutationFn: (payload: {
      planId: number;
      workoutDayId: number;
      date: string;
      exercises: TrainingSessionExerciseInput[];
    }) => {
      if (existingSession) {
        return updateTrainingSession(existingSession.id, {
          workoutDayId: payload.workoutDayId,
          exercises: mergeExistingExerciseLogs(existingSession, payload.exercises),
        });
      }

      return createTrainingSession(payload);
    },
    onSuccess: () => {
      startTransition(() => {
        handleClose();
        toast.success(labels.success);
        router.refresh();
      });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : labels.errorFallback;
      setFormError(message);
      toast.error(message);
    },
  });

  const hasExercises = rows.length > 0;

  function handleOpen() {
    const nextWorkoutDayId = selectedWorkoutDayId || workoutDays[0]?.id || 0;
    const nextWorkoutDay =
      workoutDays.find((day) => day.id === nextWorkoutDayId) ?? workoutDays[0] ?? null;

    setSelectedWorkoutDayId(nextWorkoutDayId);
    setSessionDate(getDefaultSessionDate());
    resetSessionState(nextWorkoutDay);
    setIsLoadingExistingSession(Boolean(nextWorkoutDay));
    setFormError(null);
    setIsOpen(true);
  }

  function handleWorkoutDayChange(nextWorkoutDayId: number) {
    const nextWorkoutDay =
      workoutDays.find((day) => day.id === nextWorkoutDayId) ?? null;

    setSelectedWorkoutDayId(nextWorkoutDayId);
    resetSessionState(nextWorkoutDay);
    setIsLoadingExistingSession(Boolean(nextWorkoutDay));
  }

  function handleChange(
    index: number,
    field: "weight" | "reps" | "rir",
    value: string,
  ) {
    setRows((currentRows) =>
      currentRows.map((row, rowIndex) =>
        rowIndex === index && !row.readonly ? { ...row, [field]: value } : row,
      ),
    );
  }

  async function handleSubmit() {
    setFormError(null);

    if (!selectedWorkoutDay) {
      setFormError(labels.noExercises);
      return;
    }

    let exercises: TrainingSessionExerciseInput[];

    try {
      exercises = buildExercisesPayload(rows, labels.incompleteSet);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : labels.errorFallback);
      return;
    }

    if (exercises.length === 0) {
      setFormError(labels.emptySets);
      return;
    }

    const parsed = createTrainingSessionSchema.safeParse({
      planId: plan.id,
      workoutDayId: selectedWorkoutDay.id,
      date: sessionDate,
      exercises,
    });

    if (!parsed.success) {
      const fieldError = parsed.error.flatten().formErrors[0];
      setFormError(fieldError ?? labels.errorFallback);
      return;
    }

    await mutation.mutateAsync(parsed.data);
  }

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
                    onChange={(event) => {
                      setSessionDate(event.target.value);
                      resetSessionState(selectedWorkoutDay);
                      setIsLoadingExistingSession(Boolean(selectedWorkoutDay));
                    }}
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
                  {groupRowsByExercise(rows).map((exerciseGroup) => (
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
                              onChange={(value) => handleChange(row.index, "weight", value)}
                            />
                            <InputField
                              label={labels.reps}
                              value={row.reps}
                              placeholder={labels.repsPlaceholder}
                              readOnly={row.readonly}
                              onChange={(value) => handleChange(row.index, "reps", value)}
                            />
                            <InputField
                              label={labels.rir}
                              value={row.rir}
                              placeholder={labels.rirPlaceholder}
                              readOnly={row.readonly}
                              onChange={(value) => handleChange(row.index, "rir", value)}
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
              ) : rows.some((row) => row.readonly) ? (
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
                  disabled={mutation.isPending || isPending || isLoadingExistingSession || !hasExercises}
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#1cc31c] px-4 text-sm font-semibold text-black transition-colors hover:bg-[#27d927] disabled:opacity-60 sm:h-11 sm:w-auto"
                >
                  {mutation.isPending || isPending ? labels.submitting : labels.submit}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function getDefaultSessionDate() {
  return new Date().toISOString().slice(0, 10);
}

function createSessionRows(
  workoutDay: TrainingPlanWorkoutDay | null,
  existingSession: MyTrainingSession | null,
): SessionRow[] {
  const savedSetMap = new Map(
    (existingSession?.exerciseLogs ?? []).flatMap((exerciseLog) =>
      exerciseLog.sets.map((setLog) => [
        getRowKey(exerciseLog.exercise.id, setLog.setNumber),
        setLog,
      ] as const),
    ),
  );

  return ((workoutDay?.exercises ?? []) as TrainingPlanExercise[]).flatMap((exercise) =>
    buildExerciseRows(exercise, savedSetMap),
  );
}

function buildExerciseRows(
  exercise: TrainingPlanExercise,
  savedSetMap: Map<string, MyTrainingSession["exerciseLogs"][number]["sets"][number]>,
): SessionRow[] {
  const setsCount = Math.max(exercise.targetSets, 1);
  const targetLabel = `${exercise.targetSets} x ${exercise.minReps}-${exercise.maxReps} • RIR ${exercise.targetRir}`;

  return Array.from({ length: setsCount }, (_, index) => {
    const setNumber = index + 1;
    const savedSet = savedSetMap.get(getRowKey(exercise.id, setNumber));

    return {
      exerciseId: exercise.id,
      setNumber,
      exerciseName: exercise.name,
      targetLabel,
      weight: savedSet ? String(savedSet.weight) : "",
      reps: savedSet ? String(savedSet.reps) : "",
      rir: savedSet ? String(savedSet.rir) : "",
      readonly: Boolean(savedSet),
    };
  });
}

function buildExercisesPayload(
  rows: SessionRow[],
  incompleteSetMessage: string,
): TrainingSessionExerciseInput[] {
  const exerciseMap = new Map<number, TrainingSessionExerciseInput>();

  rows.forEach((row) => {
    const hasAnyValue = row.weight !== "" || row.reps !== "" || row.rir !== "";

    if (!hasAnyValue || row.readonly) {
      return;
    }

    if (row.weight === "" || row.reps === "" || row.rir === "") {
      throw new Error(incompleteSetMessage);
    }

    const set: TrainingSessionSetInput = {
      setNumber: row.setNumber,
      weight: Number(row.weight),
      reps: Number(row.reps),
      rir: Number(row.rir),
    };

    const existing = exerciseMap.get(row.exerciseId);

    if (existing) {
      existing.sets.push(set);
    } else {
      exerciseMap.set(row.exerciseId, {
        exerciseId: row.exerciseId,
        note: undefined,
        sets: [set],
      });
    }
  });

  return Array.from(exerciseMap.values()).map((exercise) => ({
    ...exercise,
    note: exercise.note?.trim() ? exercise.note.trim() : undefined,
    sets: exercise.sets.sort((left, right) => left.setNumber - right.setNumber),
  }));
}

function mergeExistingExerciseLogs(
  existingSession: MyTrainingSession,
  nextExercises: TrainingSessionExerciseInput[],
): TrainingSessionExerciseInput[] {
  const merged = new Map<number, TrainingSessionExerciseInput>();

  existingSession.exerciseLogs.forEach((exerciseLog) => {
    merged.set(exerciseLog.exercise.id, {
      exerciseId: exerciseLog.exercise.id,
      note: exerciseLog.note ?? undefined,
      sets: exerciseLog.sets.map((setLog) => ({
        setNumber: setLog.setNumber,
        weight: setLog.weight,
        reps: setLog.reps,
        rir: setLog.rir,
      })),
    });
  });

  nextExercises.forEach((exercise) => {
    const existing = merged.get(exercise.exerciseId);

    if (existing) {
      const setsByNumber = new Map(
        existing.sets.map((setLog) => [setLog.setNumber, setLog] as const),
      );

      exercise.sets.forEach((setLog) => {
        setsByNumber.set(setLog.setNumber, setLog);
      });

      existing.sets = Array.from(setsByNumber.values()).sort(
        (left, right) => left.setNumber - right.setNumber,
      );

      if (exercise.note?.trim()) {
        existing.note = exercise.note.trim();
      }
    } else {
      merged.set(exercise.exerciseId, {
        ...exercise,
        note: exercise.note?.trim() ? exercise.note.trim() : undefined,
        sets: exercise.sets.sort((left, right) => left.setNumber - right.setNumber),
      });
    }
  });

  return Array.from(merged.values()).map((exercise) => ({
    ...exercise,
    note: exercise.note?.trim() ? exercise.note.trim() : undefined,
    sets: exercise.sets.sort((left, right) => left.setNumber - right.setNumber),
  }));
}

function getRowKey(exerciseId: number, setNumber: number) {
  return `${exerciseId}:${setNumber}`;
}

function groupRowsByExercise(rows: SessionRow[]) {
  const exerciseMap = new Map<
    number,
    {
      exerciseId: number;
      exerciseName: string;
      targetLabel: string;
      rows: Array<SessionRow & { index: number }>;
    }
  >();

  rows.forEach((row, index) => {
    const existing = exerciseMap.get(row.exerciseId);

    if (existing) {
      existing.rows.push({ ...row, index });
    } else {
      exerciseMap.set(row.exerciseId, {
        exerciseId: row.exerciseId,
        exerciseName: row.exerciseName,
        targetLabel: row.targetLabel,
        rows: [{ ...row, index }],
      });
    }
  });

  return Array.from(exerciseMap.values());
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

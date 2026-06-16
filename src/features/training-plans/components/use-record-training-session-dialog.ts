"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "react-toastify";

import {
  getGymCoinTransactionsQueryKey,
  getGymCoinWalletQueryKey,
} from "@/src/features/gymcoin/lib/gymcoin.constants";
import { showGymCoinRewardToast } from "@/src/features/gymcoin/lib/gymcoin-reward-toast";
import {
  createTrainingSession,
  type CreateTrainingSessionResult,
} from "@/src/features/training-plans/api/create-training-session";
import { getExerciseRecommendationClient } from "@/src/features/training-plans/api/get-exercise-recommendation-client";
import { getMyTrainingSessionsClient } from "@/src/features/training-plans/api/get-my-training-sessions-client";
import { getNextWorkoutDayRecommendationsClient } from "@/src/features/training-plans/api/get-next-workout-day-recommendations-client";
import { updateTrainingSession } from "@/src/features/training-plans/api/update-training-session";
import {
  createTrainingSessionSchema,
  type TrainingSessionExerciseInput,
} from "@/src/features/training-plans/lib/create-training-session.schema";
import {
  buildExercisesPayload,
  createSessionRows,
  getDefaultSessionDate,
  groupRowsByExercise,
  mergeExistingExerciseLogs,
} from "@/src/features/training-plans/lib/record-training-session-dialog.utils";
import type {
  ExerciseRecommendation,
  MyTrainingSession,
  NextWorkoutDayRecommendationItem,
  TrainingPlanWorkoutDay,
} from "@/src/features/training-plans/lib/training-plans.types";
import type {
  RecordTrainingSessionDialogProps,
  SessionRow,
} from "@/src/features/training-plans/components/record-training-session-dialog.types";

export function useRecordTrainingSessionDialog({
  currentUserId,
  plan,
  initialWorkoutDayId,
  initiallyOpen = false,
  labels,
}: Pick<
  RecordTrainingSessionDialogProps,
  "currentUserId" | "plan" | "initialWorkoutDayId" | "initiallyOpen" | "labels"
>) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const workoutDays = plan.workoutDays ?? [];
  const defaultWorkoutDayId = workoutDays[0]?.id ?? 0;
  const resolvedInitialWorkoutDayId = workoutDays.some((day) => day.id === initialWorkoutDayId)
    ? initialWorkoutDayId
    : defaultWorkoutDayId;
  const [isOpen, setIsOpen] = useState(initiallyOpen && workoutDays.length > 0);
  const [selectedWorkoutDayId, setSelectedWorkoutDayId] = useState(
    resolvedInitialWorkoutDayId,
  );
  const selectedWorkoutDay =
    workoutDays.find((day) => day.id === selectedWorkoutDayId) ?? null;
  const [sessionDate, setSessionDate] = useState(getDefaultSessionDate());
  const [existingSession, setExistingSession] = useState<MyTrainingSession | null>(null);
  const [isLoadingExistingSession, setIsLoadingExistingSession] = useState(
    initiallyOpen && Boolean(resolvedInitialWorkoutDayId),
  );
  const [exerciseRecommendationsById, setExerciseRecommendationsById] = useState<
    Record<number, ExerciseRecommendation | null>
  >({});
  const [rows, setRows] = useState<SessionRow[]>(() =>
    createSessionRows(selectedWorkoutDay, null),
  );

  const groupedRows = useMemo(() => groupRowsByExercise(rows), [rows]);
  const hasExercises = rows.length > 0;
  const hasReadonlyRows = rows.some((row) => row.readonly);

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

  function handleSessionDateChange(nextSessionDate: string) {
    setSessionDate(nextSessionDate);
    resetSessionState(selectedWorkoutDay);
    setIsLoadingExistingSession(Boolean(selectedWorkoutDay));
  }

  function handleRowChange(
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
        setFormError(error instanceof Error ? error.message : labels.errorFallback);
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
  }, [isOpen, labels.errorFallback, selectedWorkoutDay, sessionDate]);

  const mutation = useMutation({
    mutationFn: async (payload: {
      planId: number;
      workoutDayId: number;
      date: string;
      exercises: TrainingSessionExerciseInput[];
    }): Promise<CreateTrainingSessionResult> => {
      if (existingSession) {
        const session = await updateTrainingSession(existingSession.id, {
          workoutDayId: payload.workoutDayId,
          exercises: mergeExistingExerciseLogs(existingSession, payload.exercises),
        });

        return {
          session,
          reward: null,
        };
      }

      return createTrainingSession(payload);
    },
    onSuccess: (savedSession) => {
      const nextSession = savedSession.session;
      const reward = savedSession.reward;
      const savedWorkoutDay =
        workoutDays.find((day) => day.id === nextSession.workoutDay.id) ??
        selectedWorkoutDay;

      setExistingSession(nextSession);
      setSelectedWorkoutDayId(nextSession.workoutDay.id);
      setSessionDate(nextSession.date.slice(0, 10));
      setFormError(null);
      setRows(createSessionRows(savedWorkoutDay, nextSession));
      toast.success(labels.success);

      if (reward?.wallet) {
        queryClient.setQueryData(getGymCoinWalletQueryKey(currentUserId), reward.wallet);
      }

      if (reward?.rewarded) {
        void queryClient.invalidateQueries({
          queryKey: getGymCoinTransactionsQueryKey(currentUserId),
        });
        showGymCoinRewardToast(reward, labels.gymCoinReward, {
          fallbackReasonKey: "record_training_session",
        });
      }

      startTransition(() => {
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

  return {
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
    isSubmitting: mutation.isPending,
    labels,
    selectedWorkoutDayId,
    sessionDate,
    workoutDays,
  };
}

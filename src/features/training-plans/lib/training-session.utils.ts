import type {
  MyTrainingSession,
  TrainingSessionSetLog,
} from "./training-plans.types";

type RawLegacySetLog = {
  id?: number;
  exerciseId?: number;
  exercise?: {
    id?: number;
    name?: string;
    title?: string;
    muscleGroup?: string;
  };
  setNumber?: number;
  weight?: number;
  reps?: number;
  rir?: number;
  label?: string;
};

type RawLegacySession = {
  id?: number;
  date?: string;
  plan?: {
    id?: number;
    title?: string;
  };
  setLogs?: RawLegacySetLog[];
};

type RawExerciseLog = {
  id?: number;
  exercise?: {
    id?: number;
    name?: string;
    title?: string;
    muscleGroup?: string;
  };
  note?: string | null;
  target?: {
    sets?: number;
    minReps?: number;
    maxReps?: number;
    targetRir?: number;
    weightStep?: number;
    label?: string;
  };
  sets?: Array<{
    setNumber?: number;
    weight?: number;
    reps?: number;
    rir?: number;
    label?: string;
  }>;
};

type RawModernSession = {
  id?: number;
  date?: string;
  workoutDay?: {
    id?: number;
    title?: string;
    planId?: number;
    planTitle?: string;
  };
  exerciseLogs?: RawExerciseLog[];
  exercises?: RawExerciseLog[];
};

type RawTrainingSession = RawLegacySession & RawModernSession;

export function normalizeTrainingSession(session: RawTrainingSession): MyTrainingSession {
  const legacyPlanId = session.plan?.id ?? 0;
  const legacyPlanTitle = session.plan?.title ?? "Workout";
  const modernExerciseLogs = session.exerciseLogs ?? session.exercises ?? [];

  return {
    id: session.id ?? 0,
    date: session.date ?? new Date(0).toISOString(),
    workoutDay: {
      id: session.workoutDay?.id ?? legacyPlanId,
      title: session.workoutDay?.title ?? legacyPlanTitle,
      planId: session.workoutDay?.planId ?? (legacyPlanId || undefined),
      planTitle:
        session.workoutDay?.planTitle ?? (legacyPlanTitle || undefined),
    },
    exerciseLogs:
      modernExerciseLogs.length > 0
        ? normalizeModernExerciseLogs(modernExerciseLogs)
        : normalizeLegacySetLogs(session.setLogs ?? []),
  };
}

export function normalizeTrainingSessions(sessions: RawTrainingSession[]) {
  return sessions.map(normalizeTrainingSession);
}

function normalizeModernExerciseLogs(exerciseLogs: RawExerciseLog[]) {
  return exerciseLogs.map((exerciseLog, index) => ({
    id: exerciseLog.id ?? index + 1,
    exercise: {
      id: exerciseLog.exercise?.id ?? 0,
      name: exerciseLog.exercise?.name ?? exerciseLog.exercise?.title ?? "Exercise",
      muscleGroup: exerciseLog.exercise?.muscleGroup,
    },
    note: exerciseLog.note ?? null,
    target: {
      sets: exerciseLog.target?.sets ?? 0,
      minReps: exerciseLog.target?.minReps ?? 0,
      maxReps: exerciseLog.target?.maxReps ?? 0,
      targetRir: exerciseLog.target?.targetRir ?? 0,
      weightStep: exerciseLog.target?.weightStep ?? 0,
      label: exerciseLog.target?.label,
    },
    sets: (exerciseLog.sets ?? []).map((setLog, setIndex) =>
      normalizeSetLog(setLog, setIndex),
    ),
  }));
}

function normalizeLegacySetLogs(setLogs: RawLegacySetLog[]) {
  const grouped = new Map<number, RawLegacySetLog[]>();

  setLogs.forEach((setLog) => {
    const exerciseId = setLog.exerciseId ?? setLog.exercise?.id ?? 0;
    const current = grouped.get(exerciseId) ?? [];
    current.push(setLog);
    grouped.set(exerciseId, current);
  });

  return Array.from(grouped.entries()).map(([exerciseId, exerciseSetLogs], index) => {
    const firstSet = exerciseSetLogs[0];

    return {
      id: firstSet?.id ?? index + 1,
      exercise: {
        id: exerciseId,
        name:
          firstSet?.exercise?.name ??
          firstSet?.exercise?.title ??
          `Exercise #${exerciseId || index + 1}`,
        muscleGroup: firstSet?.exercise?.muscleGroup,
      },
      note: null,
      target: {
        sets: exerciseSetLogs.length,
        minReps: 0,
        maxReps: 0,
        targetRir: 0,
        weightStep: 0,
      },
      sets: exerciseSetLogs.map((setLog, setIndex) =>
        normalizeSetLog(setLog, setIndex),
      ),
    };
  });
}

function normalizeSetLog(setLog: {
  setNumber?: number;
  weight?: number;
  reps?: number;
  rir?: number;
  label?: string;
}, index = 0): TrainingSessionSetLog {
  const fallbackSetNumber = index + 1;
  const normalizedSetNumber =
    typeof setLog.setNumber === "number" && setLog.setNumber >= 1
      ? setLog.setNumber
      : fallbackSetNumber;

  return {
    setNumber: normalizedSetNumber,
    weight: setLog.weight ?? 0,
    reps: setLog.reps ?? 0,
    rir: setLog.rir ?? 0,
    label: setLog.label,
  };
}

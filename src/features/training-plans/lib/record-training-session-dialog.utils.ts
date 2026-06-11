import type {
  MyTrainingSession,
  TrainingPlanExercise,
  TrainingPlanWorkoutDay,
} from "@/src/features/training-plans/lib/training-plans.types";
import type {
  GroupedSessionRow,
  SessionRow,
} from "@/src/features/training-plans/components/record-training-session-dialog.types";
import type {
  TrainingSessionExerciseInput,
  TrainingSessionSetInput,
} from "@/src/features/training-plans/lib/create-training-session.schema";

export function getDefaultSessionDate() {
  return new Date().toISOString().slice(0, 10);
}

export function createSessionRows(
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

export function buildExercisesPayload(
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

export function mergeExistingExerciseLogs(
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

export function groupRowsByExercise(rows: SessionRow[]): GroupedSessionRow[] {
  const exerciseMap = new Map<number, GroupedSessionRow>();

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

function getRowKey(exerciseId: number, setNumber: number) {
  return `${exerciseId}:${setNumber}`;
}

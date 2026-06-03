import type { UserProfile, UserStats } from "@/src/features/dashboard/lib/dashboard.types";

import type {
  AdminExerciseProgressItem,
  AdminTrainingPlan,
  AdminTrainingPlanExercise,
  AdminTrainingPlanWorkoutDay,
  AdminTrainingSession,
  AdminTrainingSessionExercise,
  AdminTrainingSessionSet,
  AdminUserTrainingOverview,
} from "./admin-user-training-overview.types";

type RawRecord = Record<string, unknown>;

const EMPTY_STATS: UserStats = {
  summary: {
    totalWorkouts: 0,
    totalSets: 0,
    totalReps: 0,
    totalVolume: 0,
    averageRir: null,
    currentStreak: 0,
    lastWorkout: null,
  },
  week: {
    totalWorkouts: 0,
    totalSets: 0,
    totalReps: 0,
    totalVolume: 0,
  },
  month: {
    totalWorkouts: 0,
    totalSets: 0,
    totalReps: 0,
    totalVolume: 0,
  },
  muscleGroupStats: [],
  bestEstimatedOneRepMaxByExercise: [],
};

export function normalizeAdminUserTrainingOverview(
  input: unknown,
  fallbackPage: number,
  fallbackLimit: number,
): AdminUserTrainingOverview {
  const root = asRecord(input);
  const sessions = asRecord(root.sessions);
  const plans = asRecord(root.plans);
  const overview = asRecord(root.overview);

  return {
    user: normalizeUserProfile(root.user),
    overview: {
      activePlan: normalizeTrainingPlan(overview.activePlan),
      recentSessions: asArray(overview.recentSessions).map(normalizeTrainingSession),
      topExercises: asArray(overview.topExercises).map(normalizeExerciseProgressItem),
      counts: {
        totalPlans: asNumber(asRecord(overview.counts).totalPlans),
        assignedPlans: asNumber(asRecord(overview.counts).assignedPlans),
        authoredPlans: asNumber(asRecord(overview.counts).authoredPlans),
        activeExercises: asNumber(asRecord(overview.counts).activeExercises),
      },
    },
    stats: normalizeUserStats(root.stats),
    plans: {
      assigned: asArray(plans.assigned)
        .map(normalizeTrainingPlan)
        .filter((plan): plan is AdminTrainingPlan => plan !== null),
      authored: asArray(plans.authored)
        .map(normalizeTrainingPlan)
        .filter((plan): plan is AdminTrainingPlan => plan !== null),
    },
    sessions: {
      data: asArray(sessions.data).map(normalizeTrainingSession),
      meta: {
        total: asNumber(asRecord(sessions.meta).total),
        page: asPositiveNumber(asRecord(sessions.meta).page) ?? fallbackPage,
        limit: asPositiveNumber(asRecord(sessions.meta).limit) ?? fallbackLimit,
        totalPages: asPositiveNumber(asRecord(sessions.meta).totalPages) ?? 1,
      },
    },
    exerciseProgress: asArray(root.exerciseProgress).map(normalizeExerciseProgressItem),
  };
}

function normalizeUserProfile(value: unknown): UserProfile | null {
  const record = asRecord(value);

  if (!record.id && !record.email) {
    return null;
  }

  return {
    id: asNumber(record.id),
    name: asNullableString(record.name),
    email: asString(record.email, "unknown@example.com"),
    role: asString(record.role, "user"),
    approvalStatus: asString(record.approvalStatus, "approved"),
    rejectionReason: asNullableString(record.rejectionReason),
    createdAt: asString(record.createdAt, new Date(0).toISOString()),
  };
}

function normalizeUserStats(value: unknown): UserStats {
  const record = asRecord(value);
  const summary = asRecord(record.summary);
  const week = asRecord(record.week);
  const month = asRecord(record.month);

  if (Object.keys(record).length === 0) {
    return EMPTY_STATS;
  }

  return {
    summary: {
      totalWorkouts: asNumber(summary.totalWorkouts),
      totalSets: asNumber(summary.totalSets),
      totalReps: asNumber(summary.totalReps),
      totalVolume: asNumber(summary.totalVolume),
      averageRir: asNullableNumber(summary.averageRir),
      currentStreak: asNumber(summary.currentStreak),
      lastWorkout: normalizeLastWorkout(summary.lastWorkout),
    },
    week: {
      totalWorkouts: asNumber(week.totalWorkouts),
      totalSets: asNumber(week.totalSets),
      totalReps: asNumber(week.totalReps),
      totalVolume: asNumber(week.totalVolume),
    },
    month: {
      totalWorkouts: asNumber(month.totalWorkouts),
      totalSets: asNumber(month.totalSets),
      totalReps: asNumber(month.totalReps),
      totalVolume: asNumber(month.totalVolume),
    },
    muscleGroupStats: asArray(record.muscleGroupStats).map((item) => {
      const muscleRecord = asRecord(item);

      return {
        muscleGroup: asString(muscleRecord.muscleGroup, "unknown"),
        totalSets: asNumber(muscleRecord.totalSets),
        totalReps: asNumber(muscleRecord.totalReps),
        totalVolume: asNumber(muscleRecord.totalVolume),
      };
    }),
    bestEstimatedOneRepMaxByExercise: asArray(record.bestEstimatedOneRepMaxByExercise).map(
      (item) => {
        const exerciseRecord = asRecord(item);

        return {
          exerciseId: asNumber(exerciseRecord.exerciseId),
          exerciseName: asString(exerciseRecord.exerciseName, "Exercise"),
          estimatedOneRepMax: asNumber(exerciseRecord.estimatedOneRepMax),
          weight: asNumber(exerciseRecord.weight),
          reps: asNumber(exerciseRecord.reps),
        };
      },
    ),
  };
}

function normalizeLastWorkout(value: unknown) {
  const record = asRecord(value);

  if (Object.keys(record).length === 0) {
    return null;
  }

  return {
    id: asNumber(record.id),
    date: asString(record.date, new Date(0).toISOString()),
    plan: {
      id: asNumber(asRecord(record.plan).id),
      title: asString(asRecord(record.plan).title, "Plan"),
    },
  };
}

function normalizeTrainingPlan(value: unknown): AdminTrainingPlan | null {
  const record = asRecord(value);

  if (Object.keys(record).length === 0) {
    return null;
  }

  return {
    id: asNumber(record.id),
    title: asString(record.title, "Untitled plan"),
    description: asString(record.description, ""),
    status: asString(record.status, "pending"),
    goal: asNullableString(record.goal),
    deloadAfterWeeks: asNullableNumber(record.deloadAfterWeeks),
    deloadPercent: asNullableNumber(record.deloadPercent),
    author: normalizePlanPerson(record.author),
    assignedUser: normalizePlanPerson(record.assignedUser ?? record.assignedToUser),
    workoutDays: asArray(record.workoutDays).map(normalizeWorkoutDay),
  };
}

function normalizePlanPerson(value: unknown) {
  const record = asRecord(value);

  if (Object.keys(record).length === 0) {
    return null;
  }

  return {
    id: asNumber(record.id),
    email: asString(record.email, "unknown@example.com"),
  };
}

function normalizeWorkoutDay(value: unknown): AdminTrainingPlanWorkoutDay {
  const record = asRecord(value);

  return {
    id: asNumber(record.id),
    title: asString(record.title, "Workout day"),
    order: asNumber(record.order),
    exercises: asArray(record.exercises).map(normalizeTrainingPlanExercise),
  };
}

function normalizeTrainingPlanExercise(value: unknown): AdminTrainingPlanExercise {
  const record = asRecord(value);

  return {
    id: asNumber(record.id),
    name: asString(record.name ?? record.title, "Exercise"),
    description: asNullableString(record.description),
    order: asNumber(record.order),
    type: asString(record.type, "strength"),
    muscleGroup: asString(record.muscleGroup, "unknown"),
    targetSets: asNumber(record.targetSets),
    minReps: asNumber(record.minReps),
    maxReps: asNumber(record.maxReps),
    targetRir: asNumber(record.targetRir),
    weightStep: asNumber(record.weightStep),
  };
}

function normalizeTrainingSession(value: unknown): AdminTrainingSession {
  const record = asRecord(value);
  const workoutDay = asRecord(record.workoutDay);
  const plan =
    Object.keys(asRecord(record.plan)).length > 0
      ? asRecord(record.plan)
      : asRecord(workoutDay.plan);

  return {
    id: asNumber(record.id),
    date: asString(record.date, new Date(0).toISOString()),
    plan:
      Object.keys(plan).length > 0
        ? {
            id: asNumber(plan.id ?? workoutDay.planId),
            title: asString(plan.title ?? workoutDay.planTitle, "Plan"),
          }
        : null,
    workoutDay:
      Object.keys(workoutDay).length > 0
        ? {
            id: asNumber(workoutDay.id),
            title: asString(workoutDay.title, "Workout day"),
          }
        : null,
    exercises: normalizeSessionExercises(record),
  };
}

function normalizeSessionExercises(record: RawRecord): AdminTrainingSessionExercise[] {
  const exerciseLogs = asArray(record.exerciseLogs);

  if (exerciseLogs.length > 0) {
    return exerciseLogs.map(normalizeTrainingSessionExercise);
  }

  return asArray(record.exercises).map(normalizeTrainingSessionExercise);
}

function normalizeTrainingSessionExercise(value: unknown): AdminTrainingSessionExercise {
  const record = asRecord(value);
  const exercise = asRecord(record.exercise);
  const target = asRecord(record.target);

  return {
    id: asNumber(record.id),
    exercise: {
      id: asNumber(exercise.id),
      name: asString(exercise.name ?? exercise.title, "Exercise"),
      muscleGroup: asNullableString(exercise.muscleGroup),
    },
    target: {
      sets: asNumber(target.sets),
      minReps: asNumber(target.minReps),
      maxReps: asNumber(target.maxReps),
      targetRir: asNumber(target.targetRir),
      weightStep: asNumber(target.weightStep),
    },
    sets: asArray(record.sets).map(normalizeTrainingSessionSet),
  };
}

function normalizeTrainingSessionSet(value: unknown): AdminTrainingSessionSet {
  const record = asRecord(value);

  return {
    setNumber: asPositiveNumber(record.setNumber) ?? 1,
    weight: asNumber(record.weight),
    reps: asNumber(record.reps),
    rir: asNumber(record.rir),
  };
}

function normalizeExerciseProgressItem(value: unknown): AdminExerciseProgressItem {
  const record = asRecord(value);
  const summary = asRecord(record.summary);

  return {
    exerciseId: asNumber(record.exerciseId),
    exerciseName: asString(record.exerciseName, "Exercise"),
    muscleGroup: asNullableString(record.muscleGroup),
    workoutDay: normalizeReference(record.workoutDay),
    plan: normalizeReference(record.plan),
    summary: {
      sessionsCount: asNumber(summary.sessionsCount),
      lastPerformedAt: asNullableString(summary.lastPerformedAt),
      bestEstimatedOneRepMax: asNumber(summary.bestEstimatedOneRepMax),
      totalVolume: asNumber(summary.totalVolume),
    },
    progress: asArray(record.progress).map((item) => {
      const progressRecord = asRecord(item);

      return {
        date: asString(progressRecord.date, new Date(0).toISOString()),
        setNumber: asPositiveNumber(progressRecord.setNumber) ?? 1,
        weight: asNumber(progressRecord.weight),
        reps: asNumber(progressRecord.reps),
        rir: asNumber(progressRecord.rir),
        volume: asNumber(progressRecord.volume),
        estimatedOneRepMax: asNumber(progressRecord.estimatedOneRepMax),
      };
    }),
  };
}

function normalizeReference(value: unknown) {
  const record = asRecord(value);

  if (Object.keys(record).length === 0) {
    return null;
  }

  return {
    id: asNumber(record.id),
    title: asString(record.title, "Unknown"),
  };
}

function asArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function asRecord(value: unknown): RawRecord {
  return value && typeof value === "object" ? (value as RawRecord) : {};
}

function asString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function asNullableString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function asPositiveNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;
}

function asNullableNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

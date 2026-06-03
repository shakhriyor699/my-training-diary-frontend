import type { UserProfile, UserStats } from "@/src/features/dashboard/lib/dashboard.types";

export type AdminUserTrainingOverviewQuery = {
  page: number;
  limit: number;
  date?: string;
};

export type AdminTrainingPlanExercise = {
  id: number;
  name: string;
  description: string | null;
  order: number;
  type: string;
  muscleGroup: string;
  targetSets: number;
  minReps: number;
  maxReps: number;
  targetRir: number;
  weightStep: number;
};

export type AdminTrainingPlanWorkoutDay = {
  id: number;
  title: string;
  order: number;
  exercises: AdminTrainingPlanExercise[];
};

export type AdminTrainingPlan = {
  id: number;
  title: string;
  description: string;
  status: string;
  goal: string | null;
  deloadAfterWeeks: number | null;
  deloadPercent: number | null;
  author: {
    id: number;
    email: string;
  } | null;
  assignedUser: {
    id: number;
    email: string;
  } | null;
  workoutDays: AdminTrainingPlanWorkoutDay[];
};

export type AdminTrainingSessionSet = {
  setNumber: number;
  weight: number;
  reps: number;
  rir: number;
};

export type AdminTrainingSessionExercise = {
  id: number;
  exercise: {
    id: number;
    name: string;
    muscleGroup: string | null;
  };
  target: {
    sets: number;
    minReps: number;
    maxReps: number;
    targetRir: number;
    weightStep: number;
  };
  sets: AdminTrainingSessionSet[];
};

export type AdminTrainingSession = {
  id: number;
  date: string;
  plan: {
    id: number;
    title: string;
  } | null;
  workoutDay: {
    id: number;
    title: string;
  } | null;
  exercises: AdminTrainingSessionExercise[];
};

export type AdminExerciseProgressEntry = {
  date: string;
  setNumber: number;
  weight: number;
  reps: number;
  rir: number;
  volume: number;
  estimatedOneRepMax: number;
};

export type AdminExerciseProgressItem = {
  exerciseId: number;
  exerciseName: string;
  muscleGroup: string | null;
  workoutDay: {
    id: number;
    title: string;
  } | null;
  plan: {
    id: number;
    title: string;
  } | null;
  summary: {
    sessionsCount: number;
    lastPerformedAt: string | null;
    bestEstimatedOneRepMax: number;
    totalVolume: number;
  };
  progress: AdminExerciseProgressEntry[];
};

export type AdminUserTrainingOverview = {
  user: UserProfile | null;
  overview: {
    activePlan: AdminTrainingPlan | null;
    recentSessions: AdminTrainingSession[];
    topExercises: AdminExerciseProgressItem[];
    counts: {
      totalPlans: number;
      assignedPlans: number;
      authoredPlans: number;
      activeExercises: number;
    };
  };
  stats: UserStats;
  plans: {
    assigned: AdminTrainingPlan[];
    authored: AdminTrainingPlan[];
  };
  sessions: {
    data: AdminTrainingSession[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  exerciseProgress: AdminExerciseProgressItem[];
};

export type AdminUserTrainingOverviewResult = {
  overview: AdminUserTrainingOverview;
  hasError: boolean;
  errorMessage: string | null;
};

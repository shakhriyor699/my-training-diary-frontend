export type UserApprovalStatus = "pending" | "approved" | "rejected" | string;

export type UserProfile = {
  id: number;
  name?: string | null;
  email: string;
  role: string;
  approvalStatus?: UserApprovalStatus;
  rejectionReason?: string | null;
  createdAt: string;
};

export type UserStats = {
  summary: {
    totalWorkouts: number;
    totalSets: number;
    totalReps: number;
    totalVolume: number;
    averageRir: number | null;
    currentStreak: number;
    lastWorkout: {
      id: number;
      date: string;
      plan: {
        id: number;
        title: string;
      };
    } | null;
  };
  week: {
    totalWorkouts: number;
    totalSets: number;
    totalReps: number;
    totalVolume: number;
  };
  month: {
    totalWorkouts: number;
    totalSets: number;
    totalReps: number;
    totalVolume: number;
  };
  muscleGroupStats: Array<{
    muscleGroup: string;
    totalSets: number;
    totalReps: number;
    totalVolume: number;
  }>;
  bestEstimatedOneRepMaxByExercise: Array<{
    exerciseId: number;
    exerciseName: string;
    estimatedOneRepMax: number;
    weight: number;
    reps: number;
  }>;
};

export type DashboardData = {
  profile: UserProfile | null;
  stats: UserStats;
  hasProfileError: boolean;
  hasStatsError: boolean;
};

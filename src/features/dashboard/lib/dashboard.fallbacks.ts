import type { UserStats } from "./dashboard.types";

export function createEmptyUserStats(): UserStats {
  return {
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
}

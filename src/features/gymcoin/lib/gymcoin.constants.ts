export const GYMCOIN_QUERY_KEY = ["gymcoin"] as const;
export const GYMCOIN_WALLET_QUERY_KEY = ["gymcoin", "wallet"] as const;
export const GYMCOIN_TRANSACTIONS_QUERY_KEY = ["gymcoin", "transactions"] as const;
export const GYMCOIN_RULES_QUERY_KEY = ["gymcoin", "rules"] as const;
export const GYMCOIN_ACCESS_QUERY_KEY = ["gymcoin", "access"] as const;

export function getGymCoinWalletQueryKey(userId: number) {
  return [...GYMCOIN_WALLET_QUERY_KEY, userId] as const;
}

export function getGymCoinTransactionsQueryKey(userId: number) {
  return [...GYMCOIN_TRANSACTIONS_QUERY_KEY, userId] as const;
}

export function getGymCoinAccessQueryKey(userId: number, feature: string) {
  return [...GYMCOIN_ACCESS_QUERY_KEY, userId, feature] as const;
}

export const GYMCOIN_FEATURES = {
  createTrainingPlan: "create_training_plan",
  createWorkoutDay: "create_workout_day",
  createExercise: "create_exercise",
} as const;

export type GymCoinFeature =
  (typeof GYMCOIN_FEATURES)[keyof typeof GYMCOIN_FEATURES] | (string & {});

export const DEFAULT_GYMCOIN_COSTS: Record<string, number> = {
  [GYMCOIN_FEATURES.createTrainingPlan]: 3,
  [GYMCOIN_FEATURES.createWorkoutDay]: 2,
  [GYMCOIN_FEATURES.createExercise]: 1,
};

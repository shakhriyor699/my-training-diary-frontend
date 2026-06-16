import type { GymCoinFeature } from "./gymcoin.constants";

export type GymCoinWallet = {
  balance: number;
  updatedAt: string | null;
};

export type GymCoinWalletResult = {
  wallet: GymCoinWallet;
  hasError: boolean;
  errorMessage: string | null;
};

export type GymCoinTransaction = {
  id: string;
  amount: number;
  type: string;
  title: string;
  description: string | null;
  createdAt: string | null;
};

export type GymCoinTransactionsResult = {
  transactions: GymCoinTransaction[];
  hasError: boolean;
  errorMessage: string | null;
};

export type GymCoinAccessCheck = {
  allowed: boolean;
  feature: GymCoinFeature;
  requiredCoins: number;
  currentBalance: number;
  missingCoins: number;
  message: string | null;
};

export type GymCoinRewardResponse = {
  rewarded: boolean;
  amount: number;
  message: string | null;
  reasonKey: string | null;
  title: string | null;
  wallet: GymCoinWallet | null;
};

export type GymCoinRule = {
  feature: string;
  cost: number;
  enabled: boolean;
  updatedAt: string | null;
};

export type GymCoinRulesResult = {
  rules: GymCoinRule[];
  hasError: boolean;
  errorMessage: string | null;
};

export type GymCoinTopUpResponse = {
  message: string | null;
  wallet: GymCoinWallet | null;
};

export type GymCoinFeatureSpendResponse = {
  message: string | null;
  wallet: GymCoinWallet | null;
};

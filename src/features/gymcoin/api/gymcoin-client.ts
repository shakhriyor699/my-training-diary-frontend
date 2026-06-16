"use client";

import type { QueryClient } from "@tanstack/react-query";

import { clientApiFetch } from "@/src/shared/api/client-fetch";

import {
  GYMCOIN_ACCESS_QUERY_KEY,
  GYMCOIN_QUERY_KEY,
  GYMCOIN_RULES_QUERY_KEY,
  GYMCOIN_TRANSACTIONS_QUERY_KEY,
  GYMCOIN_WALLET_QUERY_KEY,
  getGymCoinWalletQueryKey,
  type GymCoinFeature,
} from "../lib/gymcoin.constants";
import {
  normalizeGymCoinAccessCheck,
  normalizeGymCoinFeatureSpendResponse,
  normalizeGymCoinRewardResponse,
  normalizeGymCoinRules,
  normalizeGymCoinTopUpResponse,
  normalizeGymCoinTransactions,
  normalizeGymCoinWallet,
} from "../lib/gymcoin.parsers";

export async function getGymCoinWalletClient() {
  const response = await clientApiFetch<unknown>("/api/gymcoin/wallet", {
    message: "Unable to load GymCoin wallet.",
  });

  return normalizeGymCoinWallet(response);
}

export async function getGymCoinTransactionsClient() {
  const response = await clientApiFetch<unknown>(
    "/api/gymcoin/transactions?page=1&limit=10",
    {
      message: "Unable to load GymCoin transactions.",
    },
  );

  return normalizeGymCoinTransactions(response);
}

export async function claimDailyGymCoinReward() {
  const response = await clientApiFetch<unknown>("/api/gymcoin/daily-login", {
    method: "POST",
    message: "Unable to claim daily GymCoin reward.",
  });

  return normalizeGymCoinRewardResponse(response);
}

export async function checkGymCoinAccess(feature: GymCoinFeature) {
  const response = await clientApiFetch<unknown>("/api/gymcoin/check-access", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ feature }),
    message: "Unable to verify GymCoin access.",
  });

  return normalizeGymCoinAccessCheck(response, feature);
}

export async function spendGymCoinForFeature(feature: GymCoinFeature) {
  const response = await clientApiFetch<unknown>("/api/gymcoin/spend-feature", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ feature }),
    message: "Unable to spend GymCoin.",
  });

  return normalizeGymCoinFeatureSpendResponse(response);
}

export async function getGymCoinRulesClient() {
  const response = await clientApiFetch<unknown>("/api/gymcoin/rules", {
    message: "Unable to load GymCoin rules.",
  });

  return normalizeGymCoinRules(response);
}

export async function updateGymCoinRule(
  feature: string,
  payload: { cost: number; enabled: boolean },
) {
  const response = await clientApiFetch<unknown>(`/api/gymcoin/rules/${feature}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    message: "Unable to update GymCoin rule.",
  });

  return normalizeGymCoinRules(response);
}

export async function topUpGymCoin(payload: {
  userId: number;
  amount: number;
  reason?: string;
}) {
  const response = await clientApiFetch<unknown>("/api/gymcoin/top-up", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    message: "Unable to top up GymCoin.",
  });

  return normalizeGymCoinTopUpResponse(response);
}

export async function refreshGymCoinWallet(queryClient: QueryClient, userId: number) {
  return queryClient.fetchQuery({
    queryKey: getGymCoinWalletQueryKey(userId),
    queryFn: getGymCoinWalletClient,
  });
}

export async function invalidateGymCoinState(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: GYMCOIN_WALLET_QUERY_KEY }),
    queryClient.invalidateQueries({ queryKey: GYMCOIN_TRANSACTIONS_QUERY_KEY }),
    queryClient.invalidateQueries({ queryKey: GYMCOIN_RULES_QUERY_KEY }),
    queryClient.invalidateQueries({ queryKey: GYMCOIN_ACCESS_QUERY_KEY }),
  ]);
}

export function clearGymCoinState(queryClient: QueryClient) {
  queryClient.removeQueries({ queryKey: GYMCOIN_QUERY_KEY });
}

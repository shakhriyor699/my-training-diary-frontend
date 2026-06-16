import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import { normalizeGymCoinRules } from "../lib/gymcoin.parsers";
import type { GymCoinRulesResult } from "../lib/gymcoin.types";

export async function getGymCoinRules() {
  const response = await serverApiFetch<unknown>("/gymcoin/rules", {
    authenticated: true,
  });

  return normalizeGymCoinRules(response);
}

export async function getGymCoinRulesSafe(): Promise<GymCoinRulesResult> {
  try {
    const rules = await getGymCoinRules();

    return {
      rules,
      hasError: false,
      errorMessage: null,
    };
  } catch (error) {
    return {
      rules: [],
      hasError: true,
      errorMessage:
        error instanceof ApiError ? error.message : "Unable to load GymCoin rules.",
    };
  }
}

import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import { normalizeGymCoinTransactions } from "../lib/gymcoin.parsers";
import type { GymCoinTransactionsResult } from "../lib/gymcoin.types";

type GetGymCoinTransactionsOptions = {
  page?: number;
  limit?: number;
};

export async function getGymCoinTransactions(
  options?: GetGymCoinTransactionsOptions,
) {
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 10;
  const response = await serverApiFetch<unknown>(
    `/gymcoin/transactions?page=${page}&limit=${limit}`,
    {
      authenticated: true,
    },
  );

  return normalizeGymCoinTransactions(response);
}

export async function getGymCoinTransactionsSafe(
  options?: GetGymCoinTransactionsOptions,
): Promise<GymCoinTransactionsResult> {
  try {
    const transactions = await getGymCoinTransactions(options);

    return {
      transactions,
      hasError: false,
      errorMessage: null,
    };
  } catch (error) {
    return {
      transactions: [],
      hasError: true,
      errorMessage:
        error instanceof ApiError
          ? error.message
          : "Unable to load GymCoin transactions.",
    };
  }
}

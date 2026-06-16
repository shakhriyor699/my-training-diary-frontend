import { ApiError } from "@/src/shared/api/base";
import { serverApiFetch } from "@/src/shared/api/server-fetch";

import { normalizeGymCoinWallet } from "../lib/gymcoin.parsers";
import type { GymCoinWalletResult } from "../lib/gymcoin.types";

export async function getGymCoinWallet() {
  const response = await serverApiFetch<unknown>("/gymcoin/wallet", {
    authenticated: true,
  });

  return normalizeGymCoinWallet(response);
}

export async function getGymCoinWalletSafe(): Promise<GymCoinWalletResult> {
  try {
    const wallet = await getGymCoinWallet();

    return {
      wallet,
      hasError: false,
      errorMessage: null,
    };
  } catch (error) {
    return {
      wallet: {
        balance: 0,
        updatedAt: null,
      },
      hasError: true,
      errorMessage:
        error instanceof ApiError ? error.message : "Unable to load GymCoin wallet.",
    };
  }
}

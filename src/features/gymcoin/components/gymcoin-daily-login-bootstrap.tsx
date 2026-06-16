"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { claimDailyGymCoinReward } from "../api/gymcoin-client";
import {
  getGymCoinTransactionsQueryKey,
  getGymCoinWalletQueryKey,
} from "../lib/gymcoin.constants";
import {
  showGymCoinRewardToast,
  type GymCoinRewardToastLabels,
} from "../lib/gymcoin-reward-toast";

type GymCoinDailyLoginBootstrapProps = {
  userId: number;
  labels: GymCoinRewardToastLabels;
};

export function GymCoinDailyLoginBootstrap({
  userId,
  labels,
}: GymCoinDailyLoginBootstrapProps) {
  const queryClient = useQueryClient();
  const attemptedRef = useRef<string | null>(null);

  useEffect(() => {
    const dateKey = getTodayKey();
    const storageKey = `gymcoin:daily-login:${userId}`;

    if (attemptedRef.current === dateKey) {
      return;
    }

    attemptedRef.current = dateKey;

    if (typeof window === "undefined") {
      return;
    }

    if (window.localStorage.getItem(storageKey) === dateKey) {
      return;
    }

    void claimDailyGymCoinReward()
      .then((response) => {
        window.localStorage.setItem(storageKey, dateKey);

        if (response.wallet) {
          queryClient.setQueryData(getGymCoinWalletQueryKey(userId), response.wallet);
        }

        void queryClient.invalidateQueries({
          queryKey: getGymCoinTransactionsQueryKey(userId),
        });

        if (response.rewarded) {
          showGymCoinRewardToast(response, labels, {
            fallbackReasonKey: "daily_login_reward",
          });
        }
      })
      .catch(() => {
        attemptedRef.current = null;
      });
  }, [labels, queryClient, userId]);

  return null;
}

function getTodayKey() {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

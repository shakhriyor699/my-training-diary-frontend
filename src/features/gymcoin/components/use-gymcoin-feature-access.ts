"use client";

import { useQuery } from "@tanstack/react-query";

import { checkGymCoinAccess } from "../api/gymcoin-client";
import {
  getGymCoinAccessQueryKey,
  type GymCoinFeature,
} from "../lib/gymcoin.constants";

export function useGymCoinFeatureAccess(
  userId: number,
  feature: GymCoinFeature,
  enabled: boolean,
) {
  return useQuery({
    queryKey: getGymCoinAccessQueryKey(userId, feature),
    queryFn: () => checkGymCoinAccess(feature),
    enabled: enabled && userId > 0,
    staleTime: 0,
  });
}

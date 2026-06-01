import { serverApiFetch } from "@/src/shared/api/server-fetch";

import { createEmptyUserStats } from "../lib/dashboard.fallbacks";
import type { DashboardData, UserProfile, UserStats } from "../lib/dashboard.types";

export async function getDashboardData() {
  const [profileResult, statsResult] = await Promise.allSettled([
    serverApiFetch<UserProfile>("/users/me", { authenticated: true }),
    serverApiFetch<UserStats>("/users/me/stats", { authenticated: true }),
  ]);

  const profile = profileResult.status === "fulfilled" ? profileResult.value : null;
  const stats =
    statsResult.status === "fulfilled"
      ? statsResult.value
      : createEmptyUserStats();

  return {
    profile,
    stats,
    hasProfileError: profileResult.status === "rejected",
    hasStatsError: statsResult.status === "rejected",
  } satisfies DashboardData;
}

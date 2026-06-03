import {
  formatCompactNumber,
  formatDateLabel,
  formatInteger,
  formatRole,
} from "@/src/features/dashboard/lib/dashboard.utils";

import { toAdminUserTrainingOverviewSearchParams } from "./admin-user-training-overview.query";
import type { UserTrainingOverviewLabels } from "./admin-user-training-overview.labels";
import type {
  AdminExerciseProgressItem,
  AdminUserTrainingOverview,
  AdminUserTrainingOverviewQuery,
} from "./admin-user-training-overview.types";

export function getUserTrainingOverviewDisplayName(
  overview: AdminUserTrainingOverview,
  emptyValue: string,
) {
  return overview.user?.name?.trim() || overview.user?.email || emptyValue;
}

export function formatUserOverviewRole(role: string | undefined, emptyValue: string) {
  return role ? formatRole(role) : emptyValue;
}

export function formatUserOverviewDate(value: string | undefined, emptyValue: string) {
  return value ? formatDateLabel(value) : emptyValue;
}

export function getUserTrainingOverviewResetHref(
  locale: string,
  userId: number,
  query: AdminUserTrainingOverviewQuery,
) {
  return `/${locale}/dashboard/users/${userId}?${toAdminUserTrainingOverviewSearchParams({
    page: 1,
    limit: query.limit,
  })}`;
}

export function getUserTrainingOverviewPagination(
  query: AdminUserTrainingOverviewQuery,
  overview: AdminUserTrainingOverview,
) {
  const { page, totalPages } = overview.sessions.meta;

  return {
    previousQuery: {
      ...query,
      page: Math.max(page - 1, 1),
    },
    nextQuery: {
      ...query,
      page: Math.min(page + 1, totalPages),
    },
    isPreviousDisabled: page <= 1,
    isNextDisabled: page >= totalPages,
    pageLabel: `${page} / ${totalPages}`,
  };
}

export function getExerciseProgressEntries(
  item: AdminExerciseProgressItem,
  condensed = false,
) {
  return condensed ? item.progress.slice(-2) : item.progress.slice(-3);
}

export function formatDeload(weeks: number | null, percent: number | null) {
  if (weeks === null && percent === null) {
    return "—";
  }

  return `${weeks ?? 0}w / ${percent ?? 0}%`;
}

export function formatDecimal(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 1,
  }).format(value);
}

export function buildPeriodSummary(
  period: {
    totalWorkouts: number;
    totalSets: number;
    totalReps: number;
    totalVolume: number;
  },
  labels: UserTrainingOverviewLabels["stats"],
) {
  return `${formatInteger(period.totalWorkouts)} ${labels.totalWorkouts.toLowerCase()} • ${formatInteger(period.totalSets)} ${labels.totalSets.toLowerCase()} • ${formatCompactNumber(period.totalVolume)}`;
}

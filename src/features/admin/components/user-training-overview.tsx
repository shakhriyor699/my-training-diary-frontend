import {
  getUserTrainingOverviewDisplayName,
} from "../lib/admin-user-training-overview.presentation";
import type { UserTrainingOverviewLabels } from "../lib/admin-user-training-overview.labels";
import type {
  AdminUserTrainingOverview,
  AdminUserTrainingOverviewQuery,
} from "../lib/admin-user-training-overview.types";
import {
  HighlightsSection,
  PaginatedSessionsSection,
  PlansAndProgressSection,
  RecentSessionsSection,
  StatsSection,
  UserProfileSection,
} from "./user-training-overview-sections";

type UserTrainingOverviewProps = {
  locale: string;
  userId: number;
  query: AdminUserTrainingOverviewQuery;
  overview: AdminUserTrainingOverview;
  labels: UserTrainingOverviewLabels;
};

export function UserTrainingOverview({
  locale,
  userId,
  query,
  overview,
  labels,
}: UserTrainingOverviewProps) {
  const displayName = getUserTrainingOverviewDisplayName(
    overview,
    labels.emptyValue,
  );

  return (
    <section className="space-y-8">
      <UserProfileSection
        overview={overview}
        labels={labels}
        displayName={displayName}
      />
      <HighlightsSection overview={overview} labels={labels} />
      <RecentSessionsSection overview={overview} labels={labels} />
      <StatsSection overview={overview} labels={labels} />
      <PlansAndProgressSection overview={overview} labels={labels} />
      <PaginatedSessionsSection
        locale={locale}
        userId={userId}
        query={query}
        overview={overview}
        labels={labels}
      />
    </section>
  );
}

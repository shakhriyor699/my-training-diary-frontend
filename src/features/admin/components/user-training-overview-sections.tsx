import Link from "next/link";

import {
  formatCompactNumber,
  formatDateLabel,
  formatInteger,
  formatMuscleGroup,
} from "@/src/features/dashboard/lib/dashboard.utils";
import { Input } from "@/src/shared/ui/input";

import type { UserTrainingOverviewLabels } from "../lib/admin-user-training-overview.labels";
import {
  buildPeriodSummary,
  formatDecimal,
  formatDeload,
  formatUserOverviewDate,
  formatUserOverviewRole,
  getExerciseProgressEntries,
  getUserTrainingOverviewPagination,
  getUserTrainingOverviewResetHref,
} from "../lib/admin-user-training-overview.presentation";
import type {
  AdminExerciseProgressItem,
  AdminTrainingPlan,
  AdminTrainingSession,
  AdminUserTrainingOverview,
  AdminUserTrainingOverviewQuery,
} from "../lib/admin-user-training-overview.types";
import {
  DetailItem,
  EmptyState,
  MetricCard,
  PaginationLink,
  Panel,
  SubPanel,
} from "./user-training-overview-primitives";

export function UserProfileSection({
  overview,
  labels,
  displayName,
}: {
  overview: AdminUserTrainingOverview;
  labels: UserTrainingOverviewLabels;
  displayName: string;
}) {
  const user = overview.user;

  return (
    <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <Panel title={labels.profileTitle}>
        <div className="grid gap-4 md:grid-cols-2">
          <DetailItem label={labels.name} value={displayName} />
          <DetailItem label={labels.email} value={user?.email ?? labels.emptyValue} />
          <DetailItem
            label={labels.role}
            value={formatUserOverviewRole(user?.role, labels.emptyValue)}
          />
          <DetailItem
            label={labels.status}
            value={user?.approvalStatus ?? labels.emptyValue}
          />
          <DetailItem
            label={labels.createdAt}
            value={formatUserOverviewDate(user?.createdAt, labels.emptyValue)}
          />
        </div>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard
          label={labels.counts.totalPlans}
          value={formatInteger(overview.overview.counts.totalPlans)}
        />
        <MetricCard
          label={labels.counts.assignedPlans}
          value={formatInteger(overview.overview.counts.assignedPlans)}
        />
        <MetricCard
          label={labels.counts.authoredPlans}
          value={formatInteger(overview.overview.counts.authoredPlans)}
        />
        <MetricCard
          label={labels.counts.activeExercises}
          value={formatInteger(overview.overview.counts.activeExercises)}
        />
      </div>
    </section>
  );
}

export function HighlightsSection({
  overview,
  labels,
}: {
  overview: AdminUserTrainingOverview;
  labels: UserTrainingOverviewLabels;
}) {
  return (
    <section className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
      <Panel title={labels.activePlan.title} description={labels.activePlan.description}>
        {overview.overview.activePlan ? (
          <PlanCard plan={overview.overview.activePlan} labels={labels.planDetails} />
        ) : (
          <EmptyState label={labels.activePlan.empty} />
        )}
      </Panel>

      <Panel title={labels.topExercises.title} description={labels.topExercises.description}>
        {overview.overview.topExercises.length === 0 ? (
          <EmptyState label={labels.topExercises.empty} />
        ) : (
          <div className="space-y-3">
            {overview.overview.topExercises.map((item) => (
              <ExerciseProgressCard
                key={`top-${item.exerciseId}-${item.exerciseName}`}
                item={item}
                labels={labels.progressDetails}
                condensed
              />
            ))}
          </div>
        )}
      </Panel>
    </section>
  );
}

export function RecentSessionsSection({
  overview,
  labels,
}: {
  overview: AdminUserTrainingOverview;
  labels: UserTrainingOverviewLabels;
}) {
  return (
    <Panel title={labels.recentSessions.title} description={labels.recentSessions.description}>
      {overview.overview.recentSessions.length === 0 ? (
        <EmptyState label={labels.recentSessions.empty} />
      ) : (
        <div className="space-y-4">
          {overview.overview.recentSessions.map((session) => (
            <SessionCard
              key={`recent-${session.id}`}
              session={session}
              labels={labels.sessionDetails}
            />
          ))}
        </div>
      )}
    </Panel>
  );
}

export function StatsSection({
  overview,
  labels,
}: {
  overview: AdminUserTrainingOverview;
  labels: UserTrainingOverviewLabels;
}) {
  const { stats } = overview;
  const lastWorkout = stats.summary.lastWorkout;

  return (
    <Panel title={labels.stats.title} description={labels.stats.description}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label={labels.stats.totalWorkouts} value={formatInteger(stats.summary.totalWorkouts)} />
        <MetricCard label={labels.stats.totalSets} value={formatInteger(stats.summary.totalSets)} />
        <MetricCard label={labels.stats.totalReps} value={formatCompactNumber(stats.summary.totalReps)} />
        <MetricCard label={labels.stats.totalVolume} value={formatCompactNumber(stats.summary.totalVolume)} />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="grid gap-4 md:grid-cols-2">
          <DetailItem
            label={labels.stats.averageRir}
            value={
              stats.summary.averageRir === null
                ? labels.stats.noData
                : formatDecimal(stats.summary.averageRir)
            }
          />
          <DetailItem
            label={labels.stats.currentStreak}
            value={`${formatInteger(stats.summary.currentStreak)} ${labels.stats.days}`}
          />
          <DetailItem
            label={labels.stats.lastWorkout}
            value={
              lastWorkout
                ? `${formatDateLabel(lastWorkout.date)} • ${lastWorkout.plan.title}`
                : labels.stats.noData
            }
          />
          <DetailItem
            label={labels.stats.week}
            value={buildPeriodSummary(stats.week, labels.stats)}
          />
          <DetailItem
            label={labels.stats.month}
            value={buildPeriodSummary(stats.month, labels.stats)}
          />
        </div>

        <div className="grid gap-4">
          <SubPanel title={labels.stats.muscleGroups}>
            {stats.muscleGroupStats.length === 0 ? (
              <EmptyState label={labels.stats.noData} compact />
            ) : (
              <div className="space-y-2">
                {stats.muscleGroupStats.map((item) => (
                  <div
                    key={item.muscleGroup}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-white/68"
                  >
                    <span className="font-medium text-white">
                      {formatMuscleGroup(item.muscleGroup)}
                    </span>
                    <span>
                      {formatInteger(item.totalSets)} {labels.stats.totalSets.toLowerCase()} •{" "}
                      {formatCompactNumber(item.totalVolume)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </SubPanel>

          <SubPanel title={labels.stats.bestLifts}>
            {stats.bestEstimatedOneRepMaxByExercise.length === 0 ? (
              <EmptyState label={labels.stats.noData} compact />
            ) : (
              <div className="space-y-2">
                {stats.bestEstimatedOneRepMaxByExercise.map((item) => (
                  <div
                    key={`${item.exerciseId}-${item.exerciseName}`}
                    className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3"
                  >
                    <p className="font-medium text-white">{item.exerciseName}</p>
                    <p className="mt-1 text-sm text-white/58">
                      {formatDecimal(item.estimatedOneRepMax)} 1RM • {item.weight} kg x {item.reps}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </SubPanel>
        </div>
      </div>
    </Panel>
  );
}

export function PlansAndProgressSection({
  overview,
  labels,
}: {
  overview: AdminUserTrainingOverview;
  labels: UserTrainingOverviewLabels;
}) {
  return (
    <section className="grid gap-8 xl:grid-cols-2">
      <Panel title={labels.plans.title} description={labels.plans.description}>
        <PlanGroup
          title={labels.plans.assigned}
          plans={overview.plans.assigned}
          emptyLabel={labels.plans.empty}
          labels={labels.planDetails}
        />
        <PlanGroup
          title={labels.plans.authored}
          plans={overview.plans.authored}
          emptyLabel={labels.plans.empty}
          labels={labels.planDetails}
        />
      </Panel>

      <Panel title={labels.exerciseProgress.title} description={labels.exerciseProgress.description}>
        {overview.exerciseProgress.length === 0 ? (
          <EmptyState label={labels.exerciseProgress.empty} />
        ) : (
          <div className="space-y-3">
            {overview.exerciseProgress.map((item) => (
              <ExerciseProgressCard
                key={`progress-${item.exerciseId}-${item.exerciseName}`}
                item={item}
                labels={labels.progressDetails}
              />
            ))}
          </div>
        )}
      </Panel>
    </section>
  );
}

export function PaginatedSessionsSection({
  locale,
  userId,
  query,
  overview,
  labels,
}: {
  locale: string;
  userId: number;
  query: AdminUserTrainingOverviewQuery;
  overview: AdminUserTrainingOverview;
  labels: UserTrainingOverviewLabels;
}) {
  const pagination = getUserTrainingOverviewPagination(query, overview);
  const resetHref = getUserTrainingOverviewResetHref(locale, userId, query);

  return (
    <Panel title={labels.sessions.title} description={labels.sessions.description}>
      <div className="mb-6 flex flex-col gap-4 rounded-[18px] border border-white/8 bg-white/[0.02] p-4 lg:flex-row lg:items-end lg:justify-between">
        <form className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <input type="hidden" name="page" value="1" />
          <input type="hidden" name="limit" value={String(query.limit)} />
          <label className="grid gap-2 text-sm text-white/62">
            {labels.sessions.filterDate}
            <Input
              name="date"
              type="date"
              defaultValue={query.date}
              className="min-w-[220px]"
            />
          </label>
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.04] px-5 text-sm font-medium text-white transition-colors hover:bg-white/[0.08]"
          >
            {labels.sessions.filterApply}
          </button>
        </form>

        <Link
          href={resetHref}
          className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/8 bg-black/20 px-5 text-sm font-medium text-white/78 transition-colors hover:bg-white/[0.04] hover:text-white"
        >
          {labels.sessions.filterReset}
        </Link>
      </div>

      {overview.sessions.data.length === 0 ? (
        <EmptyState label={labels.sessions.empty} />
      ) : (
        <div className="space-y-4">
          {overview.sessions.data.map((session) => (
            <SessionCard
              key={`session-${session.id}`}
              session={session}
              labels={labels.sessionDetails}
            />
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-white/45">
          {labels.sessions.page} {pagination.pageLabel}
        </p>
        <div className="flex gap-2">
          <PaginationLink
            locale={locale}
            userId={userId}
            query={pagination.previousQuery}
            disabled={pagination.isPreviousDisabled}
            label={labels.sessions.previous}
          />
          <PaginationLink
            locale={locale}
            userId={userId}
            query={pagination.nextQuery}
            disabled={pagination.isNextDisabled}
            label={labels.sessions.next}
          />
        </div>
      </div>
    </Panel>
  );
}

function PlanGroup({
  title,
  plans,
  emptyLabel,
  labels,
}: {
  title: string;
  plans: AdminTrainingPlan[];
  emptyLabel: string;
  labels: UserTrainingOverviewLabels["planDetails"];
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {plans.length === 0 ? (
        <EmptyState label={emptyLabel} compact />
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => (
            <PlanCard key={`${title}-${plan.id}`} plan={plan} labels={labels} />
          ))}
        </div>
      )}
    </div>
  );
}

function PlanCard({
  plan,
  labels,
}: {
  plan: AdminTrainingPlan;
  labels: UserTrainingOverviewLabels["planDetails"];
}) {
  return (
    <article className="rounded-[20px] border border-white/8 bg-black/20 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/58">
              ID {plan.id}
            </span>
            <span className="inline-flex rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/72">
              {plan.status}
            </span>
          </div>
          <h3 className="mt-3 text-2xl font-semibold text-white">{plan.title}</h3>
        </div>

        <div className="min-w-[220px] rounded-[18px] border border-white/8 bg-white/[0.03] p-4 text-sm text-white/64">
          <p>{labels.goal}: {plan.goal ?? "—"}</p>
          <p className="mt-2">
            {labels.deload}: {formatDeload(plan.deloadAfterWeeks, plan.deloadPercent)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <DetailItem label={labels.author} value={plan.author?.email ?? "—"} />
        <DetailItem label={labels.assignedUser} value={plan.assignedUser?.email ?? "—"} />
      </div>

      <div className="mt-4">
        <p className="text-sm text-white/42">{labels.description}</p>
        <p className="mt-2 text-sm leading-6 text-white/74">{plan.description || "—"}</p>
      </div>

      <div className="mt-5">
        <p className="text-sm text-white/42">{labels.workoutDays}</p>
        {plan.workoutDays.length === 0 ? (
          <p className="mt-2 text-sm text-white/52">{labels.noWorkoutDays}</p>
        ) : (
          <div className="mt-3 space-y-3">
            {plan.workoutDays.map((day) => (
              <div
                key={day.id}
                className="rounded-[18px] border border-white/8 bg-white/[0.02] p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex rounded-full border border-white/8 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/58">
                    #{day.order || day.id}
                  </span>
                  <p className="font-medium text-white">{day.title}</p>
                </div>

                <div className="mt-3 space-y-2">
                  {day.exercises.length === 0 ? (
                    <p className="text-sm text-white/52">{labels.noWorkoutDays}</p>
                  ) : (
                    day.exercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3"
                      >
                        <p className="font-medium text-white">{exercise.name}</p>
                        <p className="mt-1 text-sm text-white/58">
                          {labels.exercises}: {formatMuscleGroup(exercise.muscleGroup)} •{" "}
                          {exercise.targetSets} x {exercise.minReps}-{exercise.maxReps} • RIR{" "}
                          {exercise.targetRir}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function SessionCard({
  session,
  labels,
}: {
  session: AdminTrainingSession;
  labels: UserTrainingOverviewLabels["sessionDetails"];
}) {
  return (
    <article className="rounded-[20px] border border-white/8 bg-black/20 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/58">
              ID {session.id}
            </span>
            <span className="text-sm text-white/52">{formatDateLabel(session.date)}</span>
          </div>
          <h3 className="mt-3 text-2xl font-semibold text-white">
            {session.plan?.title ?? "Plan"}
          </h3>
          <p className="mt-2 text-sm text-white/58">
            {labels.workoutDay}: {session.workoutDay?.title ?? "—"}
          </p>
        </div>

        <div className="min-w-[240px] rounded-[18px] border border-white/8 bg-white/[0.03] p-4 text-sm text-white/64">
          <p>{labels.plan}: {session.plan?.title ?? "—"}</p>
          <p className="mt-2">{labels.exercises}: {formatInteger(session.exercises.length)}</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {session.exercises.length === 0 ? (
          <EmptyState label={labels.noExercises} compact />
        ) : (
          session.exercises.map((exercise) => (
            <div
              key={`${session.id}-${exercise.id}`}
              className="rounded-[18px] border border-white/8 bg-white/[0.02] p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-white">{exercise.exercise.name}</p>
                  <p className="mt-1 text-sm text-white/52">
                    {exercise.exercise.muscleGroup
                      ? formatMuscleGroup(exercise.exercise.muscleGroup)
                      : "—"}
                  </p>
                </div>
                <p className="text-sm text-white/58">
                  {labels.target}: {exercise.target.sets} x {exercise.target.minReps}-{exercise.target.maxReps} • RIR{" "}
                  {exercise.target.targetRir}
                </p>
              </div>

              <div className="mt-3 grid gap-2">
                {exercise.sets.map((setItem) => (
                  <div
                    key={`${exercise.id}-${setItem.setNumber}`}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-white/68"
                  >
                    <span>{labels.set} #{setItem.setNumber}</span>
                    <span>
                      {labels.weight}: {setItem.weight} • {labels.reps}: {setItem.reps} • {labels.rir}: {setItem.rir}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </article>
  );
}

function ExerciseProgressCard({
  item,
  labels,
  condensed = false,
}: {
  item: AdminExerciseProgressItem;
  labels: UserTrainingOverviewLabels["progressDetails"];
  condensed?: boolean;
}) {
  const recentEntries = getExerciseProgressEntries(item, condensed);

  return (
    <article className="rounded-[20px] border border-white/8 bg-black/20 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm text-white/42">{labels.exercise}</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{item.exerciseName}</h3>
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-white/56">
            <span>
              {labels.muscleGroup}: {item.muscleGroup ? formatMuscleGroup(item.muscleGroup) : "—"}
            </span>
            <span>{labels.workoutDay}: {item.workoutDay?.title ?? "—"}</span>
            <span>{labels.plan}: {item.plan?.title ?? "—"}</span>
          </div>
        </div>

        <div className="grid min-w-[260px] gap-2 rounded-[18px] border border-white/8 bg-white/[0.03] p-4 text-sm text-white/64">
          <p>{labels.sessionsCount}: {formatInteger(item.summary.sessionsCount)}</p>
          <p>
            {labels.lastPerformedAt}:{" "}
            {item.summary.lastPerformedAt
              ? formatDateLabel(item.summary.lastPerformedAt)
              : "—"}
          </p>
          <p>{labels.bestEstimatedOneRepMax}: {formatDecimal(item.summary.bestEstimatedOneRepMax)}</p>
          <p>{labels.totalVolume}: {formatCompactNumber(item.summary.totalVolume)}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-white/42">{labels.recentEntries}</p>
        {recentEntries.length === 0 ? (
          <p className="mt-2 text-sm text-white/52">{labels.noEntries}</p>
        ) : (
          <div className="mt-3 grid gap-2">
            {recentEntries.map((entry, index) => (
              <div
                key={`${item.exerciseId}-${entry.date}-${entry.setNumber}-${index}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3 text-sm text-white/68"
              >
                <span>{formatDateLabel(entry.date)}</span>
                <span>
                  #{entry.setNumber} • {entry.weight} x {entry.reps} • RIR {entry.rir} • 1RM{" "}
                  {formatDecimal(entry.estimatedOneRepMax)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

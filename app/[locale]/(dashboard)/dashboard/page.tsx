import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";

import { getDashboardData } from "@/src/features/dashboard/api/get-dashboard-data";
import { getMyTrainingPlansSafe } from "@/src/features/training-plans/api/get-my-training-plans";
import { getGymCoinTransactionsSafe } from "@/src/features/gymcoin/api/get-gymcoin-transactions";
import { getGymCoinWalletSafe } from "@/src/features/gymcoin/api/get-gymcoin-wallet";
import { GymCoinWalletPanel } from "@/src/features/gymcoin/components/gymcoin-wallet-panel";
import { getDashboardHomeLinks } from "@/src/features/dashboard/lib/dashboard-home-links";
import {
  formatCompactNumber,
  formatDateLabel,
  formatInteger,
  formatMuscleGroup,
  formatRole,
  getDisplayNameFromEmail,
} from "@/src/features/dashboard/lib/dashboard.utils";

type DashboardPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [
    t,
    gymCoinT,
    { profile, stats, hasProfileError, hasStatsError },
    walletResult,
    transactionsResult,
  ] = await Promise.all([
    getTranslations("Dashboard"),
    getTranslations("GymCoin.wallet"),
    getDashboardData(),
    getGymCoinWalletSafe(),
    getGymCoinTransactionsSafe(),
  ]);
  const trainingPlansResult = profile
    ? await getMyTrainingPlansSafe()
    : { plans: [], hasError: true, errorMessage: "Profile unavailable." };

  const displayName = profile
    ? getDisplayNameFromEmail(profile.email)
    : t("fallbackName");
  const topMuscleGroup = stats.muscleGroupStats[0];
  const bestLift = stats.bestEstimatedOneRepMaxByExercise[0];
  const lastWorkout = stats.summary.lastWorkout;
  const averageRirLabel =
    stats.summary.averageRir === null
      ? t("activity.emptySecondary")
      : t("cards.averageRirHint", {
          count: stats.summary.averageRir.toFixed(1),
        });
  const { activeWorkout, nextWorkoutHref, quickActions } = getDashboardHomeLinks({
    locale,
    plans: trainingPlansResult.plans,
    currentUserId: profile?.id,
    currentUserRole: profile?.role,
    lastWorkoutPlanId: lastWorkout?.plan.id,
  });
  const nextWorkoutTitle =
    activeWorkout?.plan.title ?? lastWorkout?.plan.title ?? t("nextWorkout.fallbackTitle");
  const nextWorkoutSecondary = activeWorkout?.day.title
    ? activeWorkout.day.title
    : lastWorkout
      ? formatDateLabel(lastWorkout.date)
      : t("nextWorkout.fallbackTime");
  const nextWorkoutExerciseCount = activeWorkout?.day.exercises?.length ?? 0;

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-6 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-[1240px] space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {t("title", { name: displayName })}
          </h1>
          <p className="text-lg text-white/46">{t("subtitle")}</p>
        </header>

        {hasProfileError || hasStatsError ? (
          <section className="rounded-[20px] border border-[#ff6b5d]/16 bg-[#ff6b5d]/8 px-5 py-4 text-sm text-white/78">
            {hasProfileError && hasStatsError
              ? t("errors.profileAndStats")
              : hasProfileError
                ? t("errors.profile")
                : t("errors.stats")}
          </section>
        ) : null}

        <section className="grid gap-4 xl:grid-cols-4">
          <StatCard
            label={t("cards.workoutsWeek")}
            value={formatInteger(stats.week.totalWorkouts)}
            accent={t("cards.workoutsWeekHint", {
              count: stats.month.totalWorkouts - stats.week.totalWorkouts,
            })}
            accentClassName="text-[#39d353]"
          />
          <StatCard
            label={t("cards.totalVolume")}
            value={formatCompactNumber(stats.summary.totalVolume)}
            accent={t("cards.totalVolumeHint", {
              count: formatCompactNumber(stats.week.totalVolume),
            })}
            accentClassName="text-[#ff6b5d]"
          />
          <StatCard
            label={t("cards.currentStreak")}
            value={formatInteger(stats.summary.currentStreak)}
            suffix={t("cards.days")}
            valueClassName="text-[#84cc16]"
          />
          <StatCard
            label={t("cards.totalReps")}
            value={formatCompactNumber(stats.summary.totalReps)}
            accent={averageRirLabel}
            accentClassName="text-[#ff6b5d]"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[32px] font-semibold text-white">
                  {t("nextWorkout.title")}
                </h2>
                <p className="text-lg text-white/42">
                  {t("nextWorkout.subtitle")}
                </p>
              </div>
              <div className="text-[#ff6b5d]">
                <BoltBadgeIcon />
              </div>
            </div>

            <div className="rounded-[18px] border border-[#36530d] bg-[linear-gradient(90deg,rgba(34,84,0,0.55),rgba(39,22,14,0.92))] p-4 sm:p-5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-3">
                  <h3 className="text-[34px] font-semibold text-white">
                    {nextWorkoutTitle}
                  </h3>
                  <p className="text-lg text-white/54">
                    {nextWorkoutSecondary}
                  </p>
                  <p className="text-lg text-white/64">
                    {t("nextWorkout.exerciseCount", {
                      count: Math.max(nextWorkoutExerciseCount, 1),
                    })}
                  </p>
                </div>

                <Link
                  href={nextWorkoutHref}
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-[#1cc31c] px-5 text-base font-medium text-white transition-colors hover:bg-[#27d927]"
                >
                  {t("nextWorkout.cta")}
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <GymCoinWalletPanel
              userId={profile?.id ?? 0}
              locale={locale}
              initialWallet={walletResult}
              initialTransactions={transactionsResult}
              labels={{
                title: gymCoinT("title"),
                subtitle: gymCoinT("subtitle"),
                balance: gymCoinT("balance"),
                emptyHistory: gymCoinT("emptyHistory"),
                earned: gymCoinT("earned"),
                spent: gymCoinT("spent"),
                unavailable: gymCoinT("unavailable"),
                transactionTitles: {
                  daily_login_reward: gymCoinT("transactions.daily_login_reward"),
                  welcome_bonus: gymCoinT("transactions.welcome_bonus"),
                  create_training_plan: gymCoinT("transactions.create_training_plan"),
                  create_workout_day: gymCoinT("transactions.create_workout_day"),
                  create_exercise: gymCoinT("transactions.create_exercise"),
                  donation_topup: gymCoinT("transactions.donation_topup"),
                  access_payment: gymCoinT("transactions.access_payment"),
                  top_up: gymCoinT("transactions.top_up"),
                  admin_top_up: gymCoinT("transactions.admin_top_up"),
                  spend_feature: gymCoinT("transactions.spend_feature"),
                },
              }}
            />

            <div className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
              <h2 className="text-[32px] font-semibold text-white">
                {t("quickActions.title")}
              </h2>
              <div className="mt-6 space-y-2.5">
                <QuickAction
                  href={quickActions.logWorkoutHref}
                  icon={<PlusIcon />}
                  label={t("quickActions.logWorkout")}
                />
                <QuickAction
                  href={quickActions.viewPlansHref}
                  icon={<CalendarLineIcon />}
                  label={t("quickActions.viewPlans")}
                />
                <QuickAction
                  href={quickActions.findCoachHref}
                  icon={<UsersLineIcon />}
                  label={t("quickActions.findCoach")}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
          <div className="mb-6">
            <h2 className="text-[32px] font-semibold text-white">
              {t("activity.title")}
            </h2>
            <p className="mt-1 text-lg text-white/42">{t("activity.subtitle")}</p>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <InfoPanel
                title={t("activity.profile")}
                description={t("activity.profileDescription")}
                value={profile?.email ?? t("activity.empty")}
                secondary={
                  profile
                    ? `${formatRole(profile.role)} • ${formatDateLabel(profile.createdAt)}`
                    : t("activity.emptySecondary")
                }
              />
              <InfoPanel
                title={t("activity.bestLift")}
                description={t("activity.bestLiftDescription")}
                value={
                  bestLift
                    ? `${bestLift.exerciseName} • ${bestLift.estimatedOneRepMax.toFixed(1)} kg`
                    : t("activity.empty")
                }
                secondary={
                  bestLift
                    ? `${bestLift.weight} kg × ${bestLift.reps}`
                    : t("activity.emptySecondary")
                }
              />
            </div>

            <div className="space-y-4">
              <InfoPanel
                title={t("activity.muscleFocus")}
                description={t("activity.muscleFocusDescription")}
                value={
                  topMuscleGroup
                    ? formatMuscleGroup(topMuscleGroup.muscleGroup)
                    : t("activity.empty")
                }
                secondary={
                  topMuscleGroup
                    ? `${formatInteger(topMuscleGroup.totalSets)} sets • ${formatCompactNumber(topMuscleGroup.totalVolume)} volume`
                    : t("activity.emptySecondary")
                }
              />
              <InfoPanel
                title={t("activity.monthSummary")}
                description={t("activity.monthSummaryDescription")}
                value={`${formatInteger(stats.month.totalWorkouts)} workouts`}
                secondary={`${formatInteger(stats.month.totalSets)} sets • ${formatCompactNumber(stats.month.totalReps)} reps`}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  suffix?: string;
  accent?: string;
  accentClassName?: string;
  valueClassName?: string;
};

function StatCard({
  label,
  value,
  suffix,
  accent,
  accentClassName,
  valueClassName,
}: StatCardProps) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.2)]">
      <p className="text-[15px] text-white/42">{label}</p>
      <div className="mt-10 flex items-end gap-2">
        <span className={["text-[54px] font-semibold tracking-tight text-white", valueClassName].filter(Boolean).join(" ")}>
          {value}
        </span>
        {suffix ? <span className="pb-2 text-lg text-white/35">{suffix}</span> : null}
      </div>
      {accent ? <p className={["mt-1 text-sm", accentClassName ?? "text-white/42"].join(" ")}>{accent}</p> : null}
    </div>
  );
}

type QuickActionProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

function QuickAction({ href, icon, label }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="flex h-15 w-full items-center gap-3 rounded-xl border border-white/7 bg-white/[0.02] px-4 text-left text-lg text-white/92 transition-colors hover:bg-white/[0.05]"
    >
      <span className="text-white/78">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

type InfoPanelProps = {
  title: string;
  description: string;
  value: string;
  secondary: string;
};

function InfoPanel({ title, description, value, secondary }: InfoPanelProps) {
  return (
    <div className="rounded-[18px] border border-white/7 bg-white/[0.02] p-4">
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="mt-1 text-sm text-white/42">{description}</p>
      <p className="mt-4 text-lg font-medium text-white">{value}</p>
      <p className="mt-1 text-sm text-white/42">{secondary}</p>
    </div>
  );
}

function BoltBadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="m13.5 3.75-7.5 9h5.25l-.75 7.5 7.5-9H12.75l.75-7.5Z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5.25v13.5M5.25 12h13.5" />
    </svg>
  );
}

function CalendarLineIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75V6m9-2.25V6M4.5 9h15M5.25 5.25h13.5a.75.75 0 0 1 .75.75v12.75a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V6a.75.75 0 0 1 .75-.75Z" />
    </svg>
  );
}

function UsersLineIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 18.75v-.75A3.75 3.75 0 0 0 12 14.25H6.75A3.75 3.75 0 0 0 3 18v.75" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.375 10.5a2.625 2.625 0 1 0 0-5.25 2.625 2.625 0 0 0 0 5.25ZM20.25 18.75v-.75A3.75 3.75 0 0 0 17.25 14.34M15 5.37a2.625 2.625 0 0 1 0 5.13" />
    </svg>
  );
}

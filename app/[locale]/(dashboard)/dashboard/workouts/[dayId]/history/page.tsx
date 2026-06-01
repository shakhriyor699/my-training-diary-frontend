import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";

import { requireCurrentUser } from "@/src/features/auth/api/get-current-user";
import { UsersPageHeader } from "@/src/features/admin/components/users-page-header";
import { getDisplayNameFromEmail } from "@/src/features/dashboard/lib/dashboard.utils";
import { getWorkoutDayHistorySafe } from "@/src/features/training-plans/api/get-workout-day-history";
import { WorkoutDayHistoryPanel } from "@/src/features/training-plans/components/workout-day-history-panel";

type WorkoutDayHistoryPageProps = {
  params: Promise<{
    locale: string;
    dayId: string;
  }>;
};

export default async function WorkoutDayHistoryPage({
  params,
}: WorkoutDayHistoryPageProps) {
  const { locale, dayId } = await params;
  setRequestLocale(locale);

  const parsedDayId = Number.parseInt(dayId, 10);

  const [t, currentUser, historyResult] = Number.isFinite(parsedDayId) && parsedDayId > 0
    ? await Promise.all([
        getTranslations("WorkoutDayHistoryPage"),
        requireCurrentUser(locale),
        getWorkoutDayHistorySafe(parsedDayId),
      ])
    : await Promise.all([
        getTranslations("WorkoutDayHistoryPage"),
        requireCurrentUser(locale),
        Promise.resolve({
          response: null,
          hasError: true,
          errorMessage: "Workout day id is invalid.",
        }),
      ]);

  const workoutDayTitle = historyResult.response?.workoutDay.title ?? `#${dayId}`;
  const planTitle = historyResult.response?.workoutDay.planTitle ?? t("unknownPlan");

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-6 text-white sm:px-8 lg:px-8">
      <div className="mx-auto max-w-[1240px] space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <UsersPageHeader
            title={t("title")}
            description={t("description", {
              name: getDisplayNameFromEmail(currentUser.email),
              workoutDay: workoutDayTitle,
              plan: planTitle,
            })}
          />

          <Link
            href={`/${locale}/dashboard/workouts`}
            className="inline-flex h-11 items-center justify-center rounded-[12px] border border-white/14 bg-transparent px-5 text-sm font-medium text-white/82 transition hover:bg-white/[0.04] hover:text-white"
          >
            {t("back")}
          </Link>
        </div>

        {historyResult.hasError ? (
          <section className="rounded-[20px] border border-[#ff6b5d]/16 bg-[#ff6b5d]/8 px-5 py-4 text-sm text-white/78">
            {t("error", {
              message: historyResult.errorMessage ?? t("errorFallback"),
            })}
          </section>
        ) : null}

        {historyResult.response ? (
          <WorkoutDayHistoryPanel
            locale={locale}
            history={historyResult.response}
            labels={{
              title: t("panel.title"),
              description: t("panel.description"),
              empty: t("panel.empty"),
              date: t("panel.date"),
              notes: t("panel.notes"),
              set: t("panel.set"),
              target: t("panel.target"),
              type: t("panel.type"),
              muscleGroup: t("panel.muscleGroup"),
              noNotes: t("panel.noNotes"),
            }}
          />
        ) : (
          <section className="rounded-[24px] border border-white/8 bg-[#070707] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
            <div className="rounded-[18px] border border-dashed border-white/10 bg-black/20 px-6 py-12 text-center text-white/52">
              {t("panel.empty")}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

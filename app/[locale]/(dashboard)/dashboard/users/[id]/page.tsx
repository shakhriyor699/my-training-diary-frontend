import { getTranslations, setRequestLocale } from "next-intl/server";

import { getUserTrainingOverviewSafe } from "@/src/features/admin/api/get-user-training-overview";
import { UserDetailsHeader } from "@/src/features/admin/components/user-details-header";
import { UserTrainingOverview } from "@/src/features/admin/components/user-training-overview";
import { parseAdminUserTrainingOverviewQuery } from "@/src/features/admin/lib/admin-user-training-overview.query";

type UserDetailsPageProps = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function UserDetailsPage({
  params,
  searchParams,
}: UserDetailsPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const userId = Number.parseInt(id, 10);
  const query = parseAdminUserTrainingOverviewQuery(await searchParams);

  const [t, result] = await Promise.all([
    getTranslations("AdminUserDetails"),
    Number.isFinite(userId) && userId > 0
      ? getUserTrainingOverviewSafe(userId, query)
      : Promise.resolve({
          overview: null,
          hasError: true,
          errorMessage: "Invalid user id.",
        }),
  ]);

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-6 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-[1240px] space-y-8">
        <UserDetailsHeader
          locale={locale}
          labels={{
            back: t("back"),
            title: t("title"),
          }}
        />

        {result.hasError ? (
          <section className="rounded-[20px] border border-[#ff6b5d]/16 bg-[#ff6b5d]/8 px-5 py-4 text-sm text-white/78">
            {t("error", {
              message: result.errorMessage ?? t("errorFallback"),
            })}
          </section>
        ) : null}

        <UserTrainingOverview
          locale={locale}
          userId={userId}
          query={query}
          overview={result.overview ?? {
            user: null,
            overview: {
              activePlan: null,
              recentSessions: [],
              topExercises: [],
              counts: {
                totalPlans: 0,
                assignedPlans: 0,
                authoredPlans: 0,
                activeExercises: 0,
              },
            },
            stats: {
              summary: {
                totalWorkouts: 0,
                totalSets: 0,
                totalReps: 0,
                totalVolume: 0,
                averageRir: null,
                currentStreak: 0,
                lastWorkout: null,
              },
              week: {
                totalWorkouts: 0,
                totalSets: 0,
                totalReps: 0,
                totalVolume: 0,
              },
              month: {
                totalWorkouts: 0,
                totalSets: 0,
                totalReps: 0,
                totalVolume: 0,
              },
              muscleGroupStats: [],
              bestEstimatedOneRepMaxByExercise: [],
            },
            plans: {
              assigned: [],
              authored: [],
            },
            sessions: {
              data: [],
              meta: {
                total: 0,
                page: query.page,
                limit: query.limit,
                totalPages: 1,
              },
            },
            exerciseProgress: [],
          }}
          labels={{
            profileTitle: t("profile.title"),
            name: t("profile.name"),
            email: t("card.email"),
            role: t("card.role"),
            status: t("card.status"),
            createdAt: t("card.createdAt"),
            emptyValue: t("profile.emptyValue"),
            counts: {
              totalPlans: t("counts.totalPlans"),
              assignedPlans: t("counts.assignedPlans"),
              authoredPlans: t("counts.authoredPlans"),
              activeExercises: t("counts.activeExercises"),
            },
            activePlan: {
              title: t("activePlan.title"),
              description: t("activePlan.description"),
              empty: t("activePlan.empty"),
            },
            recentSessions: {
              title: t("recentSessions.title"),
              description: t("recentSessions.description"),
              empty: t("recentSessions.empty"),
            },
            topExercises: {
              title: t("topExercises.title"),
              description: t("topExercises.description"),
              empty: t("topExercises.empty"),
            },
            stats: {
              title: t("stats.title"),
              description: t("stats.description"),
              totalWorkouts: t("stats.totalWorkouts"),
              totalSets: t("stats.totalSets"),
              totalReps: t("stats.totalReps"),
              totalVolume: t("stats.totalVolume"),
              averageRir: t("stats.averageRir"),
              currentStreak: t("stats.currentStreak"),
              days: t("stats.days"),
              lastWorkout: t("stats.lastWorkout"),
              week: t("stats.week"),
              month: t("stats.month"),
              muscleGroups: t("stats.muscleGroups"),
              bestLifts: t("stats.bestLifts"),
              noData: t("stats.noData"),
            },
            plans: {
              title: t("plans.title"),
              description: t("plans.description"),
              assigned: t("plans.assigned"),
              authored: t("plans.authored"),
              empty: t("plans.empty"),
            },
            sessions: {
              title: t("sessions.title"),
              description: t("sessions.description"),
              empty: t("sessions.empty"),
              page: t("sessions.page"),
              previous: t("sessions.previous"),
              next: t("sessions.next"),
              filterDate: t("sessions.filterDate"),
              filterApply: t("sessions.filterApply"),
              filterReset: t("sessions.filterReset"),
            },
            exerciseProgress: {
              title: t("exerciseProgress.title"),
              description: t("exerciseProgress.description"),
              empty: t("exerciseProgress.empty"),
            },
            planDetails: {
              description: t("planDetails.description"),
              goal: t("planDetails.goal"),
              author: t("planDetails.author"),
              assignedUser: t("planDetails.assignedUser"),
              deload: t("planDetails.deload"),
              workoutDays: t("planDetails.workoutDays"),
              exercises: t("planDetails.exercises"),
              noWorkoutDays: t("planDetails.noWorkoutDays"),
            },
            sessionDetails: {
              plan: t("sessionDetails.plan"),
              workoutDay: t("sessionDetails.workoutDay"),
              exercises: t("sessionDetails.exercises"),
              noExercises: t("sessionDetails.noExercises"),
              target: t("sessionDetails.target"),
              sets: t("sessionDetails.sets"),
              set: t("sessionDetails.set"),
              weight: t("sessionDetails.weight"),
              reps: t("sessionDetails.reps"),
              rir: t("sessionDetails.rir"),
            },
            progressDetails: {
              exercise: t("progressDetails.exercise"),
              muscleGroup: t("progressDetails.muscleGroup"),
              workoutDay: t("progressDetails.workoutDay"),
              plan: t("progressDetails.plan"),
              sessionsCount: t("progressDetails.sessionsCount"),
              lastPerformedAt: t("progressDetails.lastPerformedAt"),
              bestEstimatedOneRepMax: t("progressDetails.bestEstimatedOneRepMax"),
              totalVolume: t("progressDetails.totalVolume"),
              recentEntries: t("progressDetails.recentEntries"),
              noEntries: t("progressDetails.noEntries"),
            },
          }}
        />
      </div>
    </main>
  );
}

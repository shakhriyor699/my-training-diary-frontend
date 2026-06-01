import { getTranslations, setRequestLocale } from "next-intl/server";

import { requireCurrentUser } from "@/src/features/auth/api/get-current-user";
import { UsersPageHeader } from "@/src/features/admin/components/users-page-header";
import { getDisplayNameFromEmail } from "@/src/features/dashboard/lib/dashboard.utils";
import { getSavedTrainingPlansSafe } from "@/src/features/training-plans/api/get-saved-training-plans";
import { TrainingPlansList } from "@/src/features/training-plans/components/training-plans-list";
import type { PublicTrainingPlansQuery } from "@/src/features/training-plans/lib/training-plans.types";

type FavoriteTrainingPlansPageProps = {
  params: Promise<{ locale: string }>;
};

const DEFAULT_QUERY: PublicTrainingPlansQuery = {
  sort: "createdAt",
  order: "desc",
  page: 1,
  limit: 20,
};

export default async function FavoriteTrainingPlansPage({
  params,
}: FavoriteTrainingPlansPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, currentUser, result] = await Promise.all([
    getTranslations("FavoriteTrainingPlans"),
    requireCurrentUser(locale),
    getSavedTrainingPlansSafe(DEFAULT_QUERY),
  ]);

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-6 text-white sm:px-8 lg:px-8">
      <div className="mx-auto max-w-[1240px] space-y-8">
        <UsersPageHeader
          title={t("title")}
          description={t("description", {
            name: getDisplayNameFromEmail(currentUser.email),
          })}
        />

        {result.hasError ? (
          <section className="rounded-[20px] border border-[#ff6b5d]/16 bg-[#ff6b5d]/8 px-5 py-4 text-sm text-white/78">
            {t("error", {
              message: result.errorMessage ?? t("errorFallback"),
            })}
          </section>
        ) : null}

        <TrainingPlansList
          locale={locale}
          response={result.response}
          query={DEFAULT_QUERY}
          labels={{
            title: t("list.title"),
            description: t("list.description"),
            empty: t("list.empty"),
            previous: t("list.previous"),
            next: t("list.next"),
            page: t("list.page"),
            statusApproved: t("list.statusApproved"),
            approvedCount: t("list.savedCount", {
              count: result.response.meta.total,
            }),
            byAuthor: t("list.byAuthor"),
            createdAt: t("list.createdAt"),
            likes: t("list.likes"),
            like: t("list.like"),
            likedAction: t("list.likedAction"),
            save: t("list.save"),
            savedAction: t("list.savedAction"),
            saved: t("list.saved"),
            liked: t("list.liked"),
            yes: t("list.yes"),
            notSaved: t("list.notSaved"),
            notLiked: t("list.notLiked"),
            workoutDays: t("list.workoutDays"),
            exercises: t("list.exercises"),
            day: t("list.day"),
            target: t("list.target"),
            rir: t("list.rir"),
            weightStep: t("list.weightStep"),
            likeErrorFallback: t("list.likeErrorFallback"),
            saveErrorFallback: t("list.saveErrorFallback"),
          }}
        />
      </div>
    </main>
  );
}

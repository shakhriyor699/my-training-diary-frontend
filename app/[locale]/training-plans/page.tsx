import { getTranslations, setRequestLocale } from "next-intl/server";

import { getPublicTrainingPlansSafe } from "@/src/features/training-plans/api/get-public-training-plans";
import { TrainingPlansFilters } from "@/src/features/training-plans/components/training-plans-filters";
import { TrainingPlansList } from "@/src/features/training-plans/components/training-plans-list";
import { parsePublicTrainingPlansQuery } from "@/src/features/training-plans/lib/training-plans.query";

type TrainingPlansPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TrainingPlansPage({
  params,
  searchParams,
}: TrainingPlansPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const query = parsePublicTrainingPlansQuery(await searchParams);
  const [t, result] = await Promise.all([
    getTranslations("TrainingPlans"),
    getPublicTrainingPlansSafe(query),
  ]);

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-6 text-white sm:px-8 lg:px-8">
      <div className="mx-auto max-w-[1240px] space-y-8">
        <header className="overflow-hidden rounded-[28px] border border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(250,97,77,0.14),transparent_28%),linear-gradient(180deg,#080808_0%,#050505_100%)] px-6 py-8 shadow-[0_30px_100px_rgba(0,0,0,0.28)] sm:px-8">
          <div className="max-w-4xl space-y-4">
            <span className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/72">
              {t("eyebrow")}
            </span>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              {t("title")}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-white/58">
              {t("description")}
            </p>
          </div>
        </header>

        {result.hasError ? (
          <section className="rounded-[20px] border border-[#ff6b5d]/16 bg-[#ff6b5d]/8 px-5 py-4 text-sm text-white/78">
            {t("error", {
              message: result.errorMessage ?? t("errorFallback"),
            })}
          </section>
        ) : null}

        <TrainingPlansFilters
          locale={locale}
          query={query}
          labels={{
            title: t("filters.title"),
            description: t("filters.description"),
            search: t("filters.search"),
            searchPlaceholder: t("filters.searchPlaceholder"),
            authorId: t("filters.authorId"),
            authorIdPlaceholder: t("filters.authorIdPlaceholder"),
            sort: t("filters.sort"),
            order: t("filters.order"),
            apply: t("filters.apply"),
            reset: t("filters.reset"),
            sortOptions: {
              createdAt: t("filters.sortOptions.createdAt"),
              title: t("filters.sortOptions.title"),
            },
            orderOptions: {
              asc: t("filters.orderOptions.asc"),
              desc: t("filters.orderOptions.desc"),
            },
          }}
        />

        <TrainingPlansList
          locale={locale}
          response={result.response}
          query={query}
          labels={{
            title: t("list.title"),
            description: t("list.description"),
            empty: t("list.empty"),
            previous: t("list.previous"),
            next: t("list.next"),
            page: t("list.page"),
            statusApproved: t("list.statusApproved"),
            approvedCount: t("list.approvedCount", {
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

import { getTranslations, setRequestLocale } from "next-intl/server";

import { requireCurrentUser } from "@/src/features/auth/api/get-current-user";
import { getDisplayNameFromEmail } from "@/src/features/dashboard/lib/dashboard.utils";
import { getMyNutritionPlansSafe } from "@/src/features/nutrition/api/get-my-nutrition-plans";
import { MyNutritionPlansList } from "@/src/features/nutrition/components/my-nutrition-plans-list";

type NutritionPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function NutritionPage({ params }: NutritionPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, currentUser] = await Promise.all([
    getTranslations("NutritionPage"),
    requireCurrentUser(locale),
  ]);
  const nutritionPlansResult = await getMyNutritionPlansForUser(currentUser.role);

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-6 text-white sm:px-8 lg:px-8">
      <div className="mx-auto max-w-[1240px] space-y-8">
        <header className="space-y-3">
          <span className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/72">
            {t("eyebrow")}
          </span>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {t("title")}
            </h1>
            <p className="max-w-3xl text-lg text-white/46">
              {t("description", {
                name: getDisplayNameFromEmail(currentUser.email),
              })}
            </p>
          </div>
        </header>

        {nutritionPlansResult.hasError ? (
          <section className="rounded-[20px] border border-[#ff6b5d]/16 bg-[#ff6b5d]/8 px-5 py-4 text-sm text-white/78">
            {t("error", {
              message: nutritionPlansResult.errorMessage ?? t("errorFallback"),
            })}
          </section>
        ) : null}

        <MyNutritionPlansList
          locale={locale}
          plans={nutritionPlansResult.plans}
          labels={{
            title: t("list.title"),
            description: t("list.description"),
            empty: t("list.empty"),
            viewDetails: t("list.viewDetails"),
            coach: t("list.coach"),
            coachEmail: t("list.coachEmail"),
            coachRole: t("list.coachRole"),
            goal: t("list.goal"),
            dailyCalories: t("list.dailyCalories"),
            protein: t("list.protein"),
            fat: t("list.fat"),
            carbs: t("list.carbs"),
            kcalPerDay: t("list.kcalPerDay"),
            gramsPerDay: t("list.gramsPerDay"),
            goals: {
              bulk: t("list.goals.bulk"),
              cut: t("list.goals.cut"),
              maintain: t("list.goals.maintain"),
            },
          }}
        />
      </div>
    </main>
  );
}

async function getMyNutritionPlansForUser(role: string) {
  if (role !== "user" && role !== "admin") {
    return {
      plans: [],
      hasError: true,
      errorMessage: "Student access only.",
    };
  }

  return getMyNutritionPlansSafe();
}

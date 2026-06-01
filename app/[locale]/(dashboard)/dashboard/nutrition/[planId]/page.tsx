import { getTranslations, setRequestLocale } from "next-intl/server";

import { requireCurrentUser } from "@/src/features/auth/api/get-current-user";
import { getNutritionPlanByIdSafe } from "@/src/features/nutrition/api/get-nutrition-plan-by-id";
import { NutritionPlanDetailsCard } from "@/src/features/nutrition/components/nutrition-plan-details-card";
import { NutritionPlanDetailsHeader } from "@/src/features/nutrition/components/nutrition-plan-details-header";

type NutritionPlanDetailsPageProps = {
  params: Promise<{ locale: string; planId: string }>;
};

export default async function NutritionPlanDetailsPage({
  params,
}: NutritionPlanDetailsPageProps) {
  const { locale, planId } = await params;
  setRequestLocale(locale);

  await requireCurrentUser(locale);

  const parsedPlanId = Number.parseInt(planId, 10);

  const [t, result] = await Promise.all([
    getTranslations("NutritionPlanDetailsPage"),
    Number.isFinite(parsedPlanId) && parsedPlanId > 0
      ? getNutritionPlanByIdSafe(parsedPlanId)
      : Promise.resolve({
          plan: null,
          hasError: true,
          errorMessage: "Invalid nutrition plan id.",
        }),
  ]);

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-6 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-[1240px] space-y-8">
        <NutritionPlanDetailsHeader
          backHref={`/${locale}/dashboard/nutrition`}
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

        <NutritionPlanDetailsCard
          plan={result.plan}
          labels={{
            title: t("card.title"),
            empty: t("card.empty"),
            emptyDescription: t("card.emptyDescription"),
            goal: t("card.goal"),
            coach: t("card.coach"),
            coachEmail: t("card.coachEmail"),
            coachRole: t("card.coachRole"),
            student: t("card.student"),
            studentEmail: t("card.studentEmail"),
            studentRole: t("card.studentRole"),
            dailyCalories: t("card.dailyCalories"),
            protein: t("card.protein"),
            fat: t("card.fat"),
            carbs: t("card.carbs"),
            kcalPerDay: t("card.kcalPerDay"),
            gramsPerDay: t("card.gramsPerDay"),
            days: t("card.days"),
            dayNumber: t("card.dayNumber"),
            meals: t("card.meals"),
            noMeals: t("card.noMeals"),
            foods: t("card.foods"),
            noFoods: t("card.noFoods"),
            grams: t("card.grams"),
            calories: t("card.calories"),
            time: t("card.time"),
            goals: {
              bulk: t("card.goals.bulk"),
              cut: t("card.goals.cut"),
              maintain: t("card.goals.maintain"),
            },
          }}
        />
      </div>
    </main>
  );
}


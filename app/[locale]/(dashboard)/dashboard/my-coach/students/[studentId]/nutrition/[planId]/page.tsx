import { getTranslations, setRequestLocale } from "next-intl/server";

import { requireCurrentUser } from "@/src/features/auth/api/get-current-user";
import { getNutritionPlanByIdSafe } from "@/src/features/nutrition/api/get-nutrition-plan-by-id";
import { CreateNutritionDayDialog } from "@/src/features/nutrition/components/create-nutrition-day-dialog";
import { CreateNutritionFoodDialog } from "@/src/features/nutrition/components/create-nutrition-food-dialog";
import { CreateNutritionMealDialog } from "@/src/features/nutrition/components/create-nutrition-meal-dialog";
import { DeleteNutritionPlanButton } from "@/src/features/nutrition/components/delete-nutrition-plan-button";
import { NutritionPlanDetailsCard } from "@/src/features/nutrition/components/nutrition-plan-details-card";
import { NutritionPlanDetailsHeader } from "@/src/features/nutrition/components/nutrition-plan-details-header";

type CoachStudentNutritionPlanDetailsPageProps = {
  params: Promise<{ locale: string; studentId: string; planId: string }>;
};

export default async function CoachStudentNutritionPlanDetailsPage({
  params,
}: CoachStudentNutritionPlanDetailsPageProps) {
  const { locale, studentId, planId } = await params;
  setRequestLocale(locale);

  const currentUser = await requireCurrentUser(locale);
  const parsedPlanId = Number.parseInt(planId, 10);

  const [t, result] = await Promise.all([
    getTranslations("NutritionPlanDetailsPage"),
    Number.isFinite(parsedPlanId) && parsedPlanId > 0 && currentUser.role === "coach"
      ? getNutritionPlanByIdSafe(parsedPlanId)
      : Promise.resolve({
          plan: null,
          hasError: true,
          errorMessage:
              currentUser.role === "coach" 
              ? "Invalid nutrition plan id."
              : "Coach access only.",
        }),
  ]);

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-6 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-[1240px] space-y-8">
        <NutritionPlanDetailsHeader
          backHref={`/${locale}/dashboard/my-coach/students/${studentId}`}
          action={
            result.plan ? (
              <DeleteNutritionPlanButton
                planId={result.plan.id}
                redirectHref={`/${locale}/dashboard/my-coach/students/${studentId}`}
                labels={{
                  trigger: t("delete.trigger"),
                  confirmTitle: t("delete.confirmTitle"),
                  confirmDescription: t("delete.confirmDescription"),
                  confirm: t("delete.confirm"),
                  deleting: t("delete.deleting"),
                  cancel: t("delete.cancel"),
                  success: t("delete.success"),
                  errorFallback: t("delete.errorFallback"),
                }}
              />
            ) : null
          }
          labels={{
            back: t("backToStudent"),
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
          daysAction={
            result.plan ? (
              <CreateNutritionDayDialog
                planId={result.plan.id}
                labels={{
                  trigger: t("card.createDay.trigger"),
                  title: t("card.createDay.title"),
                  description: t("card.createDay.description"),
                  dayNumberLabel: t("card.createDay.dayNumberLabel"),
                  dayNumberPlaceholder: t("card.createDay.dayNumberPlaceholder"),
                  titleLabel: t("card.createDay.titleLabel"),
                  titlePlaceholder: t("card.createDay.titlePlaceholder"),
                  submit: t("card.createDay.submit"),
                  submitting: t("card.createDay.submitting"),
                  cancel: t("card.createDay.cancel"),
                  success: t("card.createDay.success"),
                  errorFallback: t("card.createDay.errorFallback"),
                }}
              />
            ) : null
          }
          renderDayAction={(day) => (
            <CreateNutritionMealDialog
              dayId={day.id}
              labels={{
                trigger: t("card.createMeal.trigger"),
                title: t("card.createMeal.title"),
                description: t("card.createMeal.description", {
                  day: day.title,
                }),
                nameLabel: t("card.createMeal.nameLabel"),
                namePlaceholder: t("card.createMeal.namePlaceholder"),
                timeLabel: t("card.createMeal.timeLabel"),
                timePlaceholder: t("card.createMeal.timePlaceholder"),
                submit: t("card.createMeal.submit"),
                submitting: t("card.createMeal.submitting"),
                cancel: t("card.createMeal.cancel"),
                success: t("card.createMeal.success"),
                errorFallback: t("card.createMeal.errorFallback"),
              }}
            />
          )}
          renderMealAction={(meal) => (
            <CreateNutritionFoodDialog
              mealId={meal.id}
              labels={{
                trigger: t("card.createFood.trigger"),
                title: t("card.createFood.title"),
                description: t("card.createFood.description", {
                  meal: meal.name,
                }),
                nameLabel: t("card.createFood.nameLabel"),
                namePlaceholder: t("card.createFood.namePlaceholder"),
                gramsLabel: t("card.createFood.gramsLabel"),
                gramsPlaceholder: t("card.createFood.gramsPlaceholder"),
                caloriesLabel: t("card.createFood.caloriesLabel"),
                caloriesPlaceholder: t("card.createFood.caloriesPlaceholder"),
                proteinLabel: t("card.createFood.proteinLabel"),
                proteinPlaceholder: t("card.createFood.proteinPlaceholder"),
                fatLabel: t("card.createFood.fatLabel"),
                fatPlaceholder: t("card.createFood.fatPlaceholder"),
                carbsLabel: t("card.createFood.carbsLabel"),
                carbsPlaceholder: t("card.createFood.carbsPlaceholder"),
                submit: t("card.createFood.submit"),
                submitting: t("card.createFood.submitting"),
                cancel: t("card.createFood.cancel"),
                success: t("card.createFood.success"),
                errorFallback: t("card.createFood.errorFallback"),
              }}
            />
          )}
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
            createDay: {
              trigger: t("card.createDay.trigger"),
            },
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

import type {
  nutritionActivityValues,
  nutritionGenderValues,
  nutritionGoalValues,
} from "./create-student-nutrition-plan.schema";

type Translator = (key: string) => string;

export function getNutritionGoalLabel(
  goal: (typeof nutritionGoalValues)[number],
  t: Translator,
) {
  switch (goal) {
    case "bulk":
      return t("bulk");
    case "cut":
      return t("cut");
    case "maintain":
      return t("maintain");
  }
}

export function getNutritionGenderLabel(
  gender: (typeof nutritionGenderValues)[number],
  t: Translator,
) {
  switch (gender) {
    case "male":
      return t("male");
    case "female":
      return t("female");
  }
}

export function getNutritionActivityLabel(
  activity: (typeof nutritionActivityValues)[number],
  t: Translator,
) {
  switch (activity) {
    case "low":
      return t("low");
    case "medium":
      return t("medium");
    case "high":
      return t("high");
  }
}


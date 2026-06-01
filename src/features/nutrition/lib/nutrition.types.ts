import type { CreateStudentNutritionPlanInput } from "./create-student-nutrition-plan.schema";
import type { CreateNutritionDayInput } from "./create-nutrition-day.schema";
import type { CreateNutritionMealInput } from "./create-nutrition-meal.schema";
import type { CreateNutritionFoodInput } from "./create-nutrition-food.schema";

export type NutritionOption = {
  value: string;
  label: string;
};

export type NutritionPlan = {
  id: number;
  coachId: number;
  studentId: number;
  title: string;
  goal: string;
  weightKg: number;
  heightCm: number;
  age: number;
  gender: string;
  activity: string;
  dailyCalories: number;
  proteinGrams: number;
  fatGrams: number;
  carbsGrams: number;
};

export type MyNutritionPlan = {
  id: number;
  title: string;
  goal: string;
  dailyCalories: number;
  proteinGrams: number;
  fatGrams: number;
  carbsGrams: number;
  coach: {
    id: number;
    email: string;
    role: string;
  };
};

export type MyNutritionPlansResult = {
  plans: MyNutritionPlan[];
  hasError: boolean;
  errorMessage: string | null;
};

export type CoachStudentNutritionPlan = {
  id: number;
  coachId: number;
  studentId: number;
  title: string;
  goal: string;
  dailyCalories: number;
  proteinGrams: number;
  fatGrams: number;
  carbsGrams: number;
};

export type CoachStudentNutritionPlansResult = {
  plans: CoachStudentNutritionPlan[];
  hasError: boolean;
  errorMessage: string | null;
};

export type NutritionPlanFood = {
  id: number;
  name: string;
  grams: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

export type CreatedNutritionFood = {
  id: number;
  mealId: number;
  name: string;
  grams: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

export type NutritionPlanMeal = {
  id: number;
  name: string;
  time: string;
  foods: NutritionPlanFood[];
};

export type CreatedNutritionMeal = {
  id: number;
  dayId: number;
  name: string;
  time: string;
};

export type NutritionPlanDay = {
  id: number;
  dayNumber: number;
  title: string;
  meals: NutritionPlanMeal[];
};

export type CreatedNutritionDay = {
  id: number;
  planId: number;
  dayNumber: number;
  title: string;
};

export type NutritionPlanDetails = {
  id: number;
  title: string;
  goal: string;
  dailyCalories: number;
  proteinGrams: number;
  fatGrams: number;
  carbsGrams: number;
  coach: {
    id: number;
    email: string;
    role: string;
  };
  student: {
    id: number;
    email: string;
    role: string;
  };
  days: NutritionPlanDay[];
};

export type NutritionPlanDetailsResult = {
  plan: NutritionPlanDetails | null;
  hasError: boolean;
  errorMessage: string | null;
};

export type DeleteNutritionPlanResponse = {
  success: boolean;
  message: string;
};

export type CreateStudentNutritionPlanMutation = (
  payload: CreateStudentNutritionPlanInput,
) => Promise<NutritionPlan>;

export type CreateStudentNutritionPlanLabels = {
  trigger: string;
  title: string;
  description: string;
  titleLabel: string;
  titlePlaceholder: string;
  goalLabel: string;
  weightLabel: string;
  weightPlaceholder: string;
  heightLabel: string;
  heightPlaceholder: string;
  ageLabel: string;
  agePlaceholder: string;
  genderLabel: string;
  activityLabel: string;
  submit: string;
  submitting: string;
  cancel: string;
  success: string;
  errorFallback: string;
};

export type MyNutritionPlansListLabels = {
  title: string;
  description: string;
  empty: string;
  coach: string;
  viewDetails: string;
  coachEmail: string;
  coachRole: string;
  goal: string;
  dailyCalories: string;
  protein: string;
  fat: string;
  carbs: string;
  kcalPerDay: string;
  gramsPerDay: string;
  goals: Record<string, string>;
};

export type CoachStudentNutritionPlansListLabels = {
  title: string;
  description: string;
  empty: string;
  viewDetails: string;
  goal: string;
  dailyCalories: string;
  protein: string;
  fat: string;
  carbs: string;
  kcalPerDay: string;
  gramsPerDay: string;
  goals: Record<string, string>;
};

export type NutritionPlanDetailsCardLabels = {
  title: string;
  empty: string;
  emptyDescription: string;
  goal: string;
  coach: string;
  coachEmail: string;
  coachRole: string;
  student: string;
  studentEmail: string;
  studentRole: string;
  dailyCalories: string;
  protein: string;
  fat: string;
  carbs: string;
  kcalPerDay: string;
  gramsPerDay: string;
  days: string;
  dayNumber: string;
  meals: string;
  noMeals: string;
  foods: string;
  noFoods: string;
  grams: string;
  calories: string;
  time: string;
  goals: Record<string, string>;
  createDay?: {
    trigger: string;
  };
};

export type CreateNutritionDayMutation = (
  payload: CreateNutritionDayInput,
) => Promise<CreatedNutritionDay>;

export type CreateNutritionMealMutation = (
  payload: CreateNutritionMealInput,
) => Promise<CreatedNutritionMeal>;

export type CreateNutritionFoodMutation = (
  payload: CreateNutritionFoodInput,
) => Promise<CreatedNutritionFood>;

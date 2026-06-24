import type { DiseaseType, Product, SubscriptionPlan } from "@/types";

export interface HealthProfileInput {
  age: number;
  gender: string;
  weight: number;
  height: number;
  activityLevel: "Sedentary" | "Light" | "Moderate" | "Active";
  diseaseType: DiseaseType;
  healthGoal: string;
}

export interface NutritionTarget {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface MealSlot {
  label: string;
  time: string;
  suggestion: string;
}

export interface RecommendationResult {
  bmi: number;
  bmiCategory: string;
  nutritionTarget: NutritionTarget;
  mealSchedule: MealSlot[];
  recommendedProducts: Product[];
  recommendedPlans: SubscriptionPlan[];
  guidance: string[];
}

const ACTIVITY_MULTIPLIER: Record<HealthProfileInput["activityLevel"], number> = {
  Sedentary: 1.2,
  Light: 1.375,
  Moderate: 1.55,
  Active: 1.725,
};

const DISEASE_GUIDANCE: Record<DiseaseType, string[]> = {
  Diabetes: [
    "Favor low glycemic-index grains like millets over polished rice.",
    "Spread carbohydrates evenly across meals rather than in one large serving.",
    "Pair carbs with protein or fiber to slow sugar absorption.",
  ],
  PCOS: [
    "Prioritize fiber-rich, low-GI meals to support insulin sensitivity.",
    "Include healthy fats (nuts, seeds) and limit refined sugar.",
    "Regular meal timing tends to help more than strict calorie counting.",
  ],
  "Weight Loss": [
    "Aim for a moderate calorie deficit — large deficits are hard to sustain.",
    "Protein at every meal helps preserve muscle while losing fat.",
    "Fiber-rich foods improve satiety, so you eat less without feeling deprived.",
  ],
  "Weight Gain": [
    "Eat in a calorie surplus with nutrient-dense, not just calorie-dense, food.",
    "Add a protein source to every meal to support lean mass gain.",
    "Frequent smaller meals can help if appetite is the limiting factor.",
  ],
  "Gut Health": [
    "Include fermented foods and prebiotic fiber (millets, vegetables) daily.",
    "Stay consistent with meal timing — irregular eating disrupts gut rhythm.",
    "Limit ultra-processed food, which tends to reduce microbiome diversity.",
  ],
  Detox: [
    "Focus on whole foods, plenty of water, and reducing processed sugar.",
    "Bitter greens and citrus are traditionally paired with detox routines.",
    "\"Detox\" works best as a reset of habits, not a single short-term fix.",
  ],
  Cholesterol: [
    "Favor soluble fiber (oats, millets, legumes), which binds cholesterol in digestion.",
    "Limit saturated fat from fried food and processed snacks.",
    "Regular physical activity meaningfully raises HDL ('good') cholesterol.",
  ],
  "Healthy Lifestyle": [
    "Consistency in meal timing and variety in whole foods beats any single 'superfood'.",
    "Balance is more sustainable than restriction.",
    "Small, repeatable habits compound more than occasional big changes.",
  ],
};

function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
}

function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Healthy range";
  if (bmi < 30) return "Above healthy range";
  return "Well above healthy range";
}

/**
 * Mifflin-St Jeor for BMR, scaled by activity level for daily calorie needs,
 * then adjusted slightly toward the stated goal. This is a reasonable
 * estimate for guidance purposes — not a substitute for clinical advice,
 * which the UI states explicitly alongside these numbers.
 */
function estimateNutritionTarget(input: HealthProfileInput): NutritionTarget {
  const isMale = input.gender.toLowerCase().startsWith("m");
  const bmr = isMale
    ? 10 * input.weight + 6.25 * input.height - 5 * input.age + 5
    : 10 * input.weight + 6.25 * input.height - 5 * input.age - 161;

  let calories = bmr * ACTIVITY_MULTIPLIER[input.activityLevel];

  if (input.diseaseType === "Weight Loss") calories *= 0.85;
  if (input.diseaseType === "Weight Gain") calories *= 1.12;

  calories = Math.round(calories / 10) * 10;

  const protein = Math.round((calories * 0.25) / 4);
  const fat = Math.round((calories * 0.28) / 9);
  const carbs = Math.round((calories * 0.47) / 4);
  const fiber = input.diseaseType === "Gut Health" || input.diseaseType === "Diabetes" ? 35 : 28;

  return { calories, protein, carbs, fat, fiber };
}

function buildMealSchedule(diseaseType: DiseaseType): MealSlot[] {
  const base: MealSlot[] = [
    { label: "Breakfast", time: "7:30–8:30 AM", suggestion: "Millet-based breakfast with protein" },
    { label: "Mid-morning", time: "11:00 AM", suggestion: "Fruit or a handful of nuts" },
    { label: "Lunch", time: "1:00–2:00 PM", suggestion: "Whole grain, vegetable, and protein" },
    { label: "Evening", time: "5:00 PM", suggestion: "Herbal tea or a light detox drink" },
    { label: "Dinner", time: "7:30–8:30 PM", suggestion: "Lighter portion, finished 2–3 hrs before bed" },
  ];

  if (diseaseType === "Diabetes" || diseaseType === "PCOS") {
    base[1].suggestion = "Small protein snack to avoid sugar dips";
  }
  if (diseaseType === "Gut Health" || diseaseType === "Detox") {
    base[3].suggestion = "Fermented drink or warm lemon water";
  }
  return base;
}

export function getRecommendations(
  input: HealthProfileInput,
  products: Product[],
  plans: SubscriptionPlan[]
): RecommendationResult {
  const bmi = calculateBMI(input.weight, input.height);

  const recommendedProducts = products
    .filter((p) =>
      p.benefits.some((b) => b.toLowerCase().includes(input.diseaseType.toLowerCase().split(" ")[0]))
    )
    .slice(0, 6);

  // Fall back to a broader slice if disease-specific matching is too narrow —
  // an empty result is a worse experience than a loosely-relevant one.
  const productResults = recommendedProducts.length > 0 ? recommendedProducts : products.slice(0, 6);

  const recommendedPlans = plans.filter(
    (p) => p.diseaseType === input.diseaseType || p.diseaseType === "All"
  );
  const planResults = recommendedPlans.length > 0 ? recommendedPlans : plans.slice(0, 3);

  return {
    bmi,
    bmiCategory: bmiCategory(bmi),
    nutritionTarget: estimateNutritionTarget(input),
    mealSchedule: buildMealSchedule(input.diseaseType),
    recommendedProducts: productResults,
    recommendedPlans: planResults,
    guidance: DISEASE_GUIDANCE[input.diseaseType],
  };
}

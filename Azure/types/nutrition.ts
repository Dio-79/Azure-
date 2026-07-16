export interface NutritionSummary {
  totalFoods: number;
  totalDiets: number;
  totalCuisines: number;
  averageCalories: number;
  averageProtein: number;
  averageCarbohydrates: number;
  averageFat: number;
  highestCalories: number;
  highestProtein: number;
}

export interface DietNutrition {
  diet: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
}

export interface ScatterPoint {
  food: string;
  diet: string;
  cuisine: string;
  x: number;
  y: number;
}

export interface HeatmapPoint {
  x: string;
  y: string;
  value: number;
}

export interface CaloriesPiePoint {
  name: string;
  value: number;
}

export interface CuisineNutrition {
  cuisine: string;
  protein: number;
  carbohydrates: number;
  fat: number;
  calories: number;
}

export interface TopRecipe {
  food: string;
  diet_type: string;
  cuisine: string;
  protein: number;
  carbohydrates: number;
  fat: number;
  calories: number;
}

export interface NutritionAnalysis {
  summary: NutritionSummary;
  byDiet: DietNutrition[];
  scatter: ScatterPoint[];
  heatmap: HeatmapPoint[];
  caloriesPie: CaloriesPiePoint[];
  byCuisine: CuisineNutrition[];
  topRecipes: TopRecipe[];
  table: Record<string, string | number | null>[];
  metadata: {
    rows: number;
    columns: string[];
    nutrients: string[];
    caloriesAreEstimated: boolean;
    calorieFormula: string;
  };
}

export interface NutritionApiResponse {
  success: boolean;
  message?: string;
  generatedAt?: string;
  data?: NutritionAnalysis;
  error?: string;
  details?: string;
}
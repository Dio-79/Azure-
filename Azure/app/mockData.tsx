import type { DashboardData } from '@/Types/DashboardData';

export const mockData: DashboardData = {
  byDiet: [
    { Diet: "Vegan", AvgCalories: 1850 },
    { Diet: "Keto", AvgCalories: 2100 },
    { Diet: "Mediterranean", AvgCalories: 1950 },
  ],
  scatter: [
    { Protein: 45, Calories: 1850, Diet: "Vegan" },
    { Protein: 90, Calories: 2100, Diet: "Keto" },
    { Protein: 60, Calories: 1950, Diet: "Mediterranean" },
  ],
  heatmap: [
    { Diet: "Vegan", Nutrient: "Protein", Value: 45 },
    { Diet: "Vegan", Nutrient: "Fibre", Value: 30 },
    { Diet: "Keto", Nutrient: "Protein", Value: 90 },
    { Diet: "Keto", Nutrient: "Fibre", Value: 10 },
    { Diet: "Mediterranean", Nutrient: "Protein", Value: 60 },
    { Diet: "Mediterranean", Nutrient: "Fibre", Value: 40 },
  ],
  executionMs: 0,
};
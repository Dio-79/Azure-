
export const mockData: DashboardData = {
  byDiet: [
    { Diet: "Vegan",       AvgCalories: 1850 },
    { Diet: "Keto",        AvgCalories: 2100 },
    { Diet: "Mediterranean", AvgCalories: 1950 },
  ],
  scatter: [
    { Protein: 45, Calories: 1850, Diet: "Vegan" },
    { Protein: 90, Calories: 2100, Diet: "Keto" },
    { Protein: 60, Calories: 1950, Diet: "Mediterranean" },
  ],
  heatmap: [
    { Diet: "Vegan", Nutrient: "Protein", Value: 45 },
    { Diet: "Vegan", Nutrient: "Fibre",   Value: 30 },
    { Diet: "Keto",  Nutrient: "Protein", Value: 90 },
    { Diet: "Keto",  Nutrient: "Fibre",   Value: 10 },
  ],
  executionMs: 0,
};
export interface DietSummary { Diet: string; AvgCalories: number; }
export interface ScatterPoint { Protein: number; Calories: number; Diet: string; }
export interface HeatCell { Diet: string; Nutrient: string; Value: number; }

export interface DashboardData {
  byDiet: DietSummary[];
  scatter: ScatterPoint[];
  heatmap: HeatCell[];
  executionMs: number;
}
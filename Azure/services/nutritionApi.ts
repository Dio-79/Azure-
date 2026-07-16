import type {
  NutritionAnalysis,
  NutritionApiResponse,
} from "@/types/nutrition";

export type NutritionApiData = NutritionAnalysis;
export type SuccessfulNutritionResponse = NutritionApiResponse & {
  success: true;
  data: NutritionAnalysis;
};

const API_URL = process.env.NEXT_PUBLIC_NUTRITION_API_URL;

export async function getNutritionAnalysis(
  food?: string,
  signal?: AbortSignal
): Promise<SuccessfulNutritionResponse> {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_NUTRITION_API_URL is missing from .env.local"
    );
  }

  const url = new URL(API_URL);

  if (food?.trim()) {
    url.searchParams.set("food", food.trim());
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
    signal,
  });

  let result: NutritionApiResponse;

  try {
    result = (await response.json()) as NutritionApiResponse;
  } catch {
    throw new Error(
      `The API returned an invalid response. HTTP ${response.status}`
    );
  }

  if (!response.ok) {
    throw new Error(
      result.details ||
        result.error ||
        `API request failed with HTTP ${response.status}`
    );
  }

  if (!result.success) {
    throw new Error(result.error || "Nutrition analysis failed.");
  }

  if (!result.data) {
    throw new Error("The API response did not include nutrition data.");
  }

  return result as SuccessfulNutritionResponse;
}

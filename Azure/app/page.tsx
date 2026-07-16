"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  getNutritionAnalysis,
} from "@/services/nutritionApi";
import type { NutritionApiData } from "@/services/nutritionApi";

import CaloriesBar from "@/components/CaloriesBar";
import CaloriesPie from "@/components/CaloriesPie";
import NutrientHeatmap from "@/components/NutrientHeatmap";
import ProteinCaloriesScatter from "@/components/ProteinCaloriesScatter";

export default function Home() {
  const [nutritionData, setNutritionData] =
    useState<NutritionApiData | null>(null);

  const [food, setFood] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [generatedAt, setGeneratedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadNutritionData(foodName?: string) {
    try {
      setLoading(true);
      setError("");

      const response = await getNutritionAnalysis(foodName);

      setNutritionData(response.data);
      setGeneratedAt(response.generatedAt ?? "");
    } catch (err) {
      setNutritionData(null);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load nutrition information."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    getNutritionAnalysis(undefined, controller.signal)
      .then((response) => {
        setNutritionData(response.data);
        setGeneratedAt(response.generatedAt ?? "");
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        setNutritionData(null);
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load nutrition information."
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearchValue(food.trim());
    void loadNutritionData(food);
  }

  function handleClear() {
    setFood("");
    setSearchValue("");
    void loadNutritionData();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="mb-2 text-sm uppercase tracking-widest text-emerald-400">
            Azure Nutrition Analytics
          </p>

          <h1 className="text-4xl font-bold">
            Nutritional Insights Dashboard
          </h1>

          <p className="mt-3 text-slate-400">
            Live analysis generated from the nutrition dataset stored in Azure
            Blob Storage.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mb-8 flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            value={food}
            onChange={(event) => setFood(event.target.value)}
            placeholder="Search for a food, for example chicken breast"
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Loading..." : "Analyze"}
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="rounded-lg border border-slate-600 px-6 py-3 font-semibold"
          >
            Clear
          </button>
        </form>

        {searchValue && !loading && !error && (
          <p className="mb-5 text-sm text-slate-400">
            Showing results for:{" "}
            <span className="font-semibold text-white">{searchValue}</span>
          </p>
        )}

        {loading && (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
            Loading nutrition analysis from Azure...
          </div>
        )}

        {error && (
          <div className="mb-8 rounded-xl border border-red-500/40 bg-red-950/40 p-5">
            <h2 className="font-semibold text-red-300">
              Unable to load dashboard
            </h2>

            <p className="mt-2 text-sm text-red-200">{error}</p>

            <button
              type="button"
              onClick={() => void loadNutritionData(searchValue)}
              className="mt-4 rounded-lg bg-red-400 px-4 py-2 font-semibold text-red-950"
            >
              Try again
            </button>
          </div>
        )}

        {nutritionData && !loading && (
          <>
            <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <SummaryCard
                label="Total foods"
                value={nutritionData.summary.totalFoods}
              />

              <SummaryCard
                label="Diet types"
                value={nutritionData.summary.totalDiets}
              />

              <SummaryCard
                label="Cuisines"
                value={nutritionData.summary.totalCuisines}
              />

              <SummaryCard
                label="Average calories"
                value={nutritionData.summary.averageCalories.toFixed(2)}
              />

              <SummaryCard
                label="Average protein"
                value={`${nutritionData.summary.averageProtein.toFixed(2)} g`}
              />
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <ChartCard title="Average calories by diet">
                <CaloriesBar data={nutritionData.byDiet} />
              </ChartCard>

              <ChartCard title="Diet distribution">
                <CaloriesPie data={nutritionData.caloriesPie} />
              </ChartCard>

              <ChartCard title="Protein and calories">
                <ProteinCaloriesScatter data={nutritionData.scatter} />
              </ChartCard>

              <ChartCard title="Nutrient heatmap">
                <NutrientHeatmap data={nutritionData.heatmap} />
              </ChartCard>
            </section>

            {generatedAt && (
              <p className="mt-6 text-right text-xs text-slate-500">
                Generated: {new Date(generatedAt).toLocaleString()}
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-emerald-400">
        {value}
      </p>
    </article>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {children}
    </article>
  );
}

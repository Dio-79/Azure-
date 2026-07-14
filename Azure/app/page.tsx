"use client";

import { useState } from 'react';
import CaloriesBar from '@/components/CaloriesBar';
import CaloriesPie from '@/components/CaloriesPie';
import ProteinCaloriesScatter from '@/components/ProteinCaloriesScatter';
import NutrientHeatmap from '@/components/NutrientHeatmap';
import { mockData } from './mockdata';

export default function MainScreen() {
  const [search, setSearch] = useState('');
  const [dietFilter, setDietFilter] = useState('all');

  const data = mockData;

  const byDiet = data.byDiet.filter(d =>
    (dietFilter === 'all' || d.Diet.toLowerCase() === dietFilter) &&
    d.Diet.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-600 p-4 text-white">
        <h1 className="text-3xl font-semibold">Nutritional Insights</h1>
      </header>

      <main className="container mx-auto p-6">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Explore Nutritional Insights</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className="bg-white p-4 shadow-lg rounded-lg">
              <h3 className="font-semibold">Bar Chart</h3>
              <p className="text-sm text-gray-600 mb-2">Average macronutrient content by diet type.</p>
              <CaloriesBar data={byDiet} />
            </div>

            <div className="bg-white p-4 shadow-lg rounded-lg">
              <h3 className="font-semibold">Scatter Plot</h3>
              <p className="text-sm text-gray-600 mb-2">Nutrient relationships (protein vs calories).</p>
              <ProteinCaloriesScatter data={data.scatter} />
            </div>

            <div className="bg-white p-4 shadow-lg rounded-lg">
              <h3 className="font-semibold">Heatmap</h3>
              <p className="text-sm text-gray-600 mb-2">Nutrient correlations.</p>
              <NutrientHeatmap data={data.heatmap} />
            </div>

            <div className="bg-white p-4 shadow-lg rounded-lg">
              <h3 className="font-semibold">Pie Chart</h3>
              <p className="text-sm text-gray-600 mb-2">Recipe distribution by diet type.</p>
              <CaloriesPie data={byDiet} />
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Filters and Data Interaction</h2>
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search by Diet Type"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="p-2 border rounded w-full sm:w-auto"
            />
            <select
              value={dietFilter}
              onChange={e => setDietFilter(e.target.value)}
              className="p-2 border rounded w-full sm:w-auto"
            >
              <option value="all">All Diet Types</option>
              <option value="vegan">Vegan</option>
              <option value="keto">Keto</option>
            </select>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">API Data Interaction</h2>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 text-white py-2 px-4 rounded">
              Get Nutritional Insights
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Function executed in {data.executionMs} ms
          </p>
        </section>
      </main>

      <footer className="bg-blue-600 p-4 text-white text-center mt-10">
        <p>&copy; 2025 Nutritional Insights. All Rights Reserved.</p>
      </footer>
    </div>
  );
}



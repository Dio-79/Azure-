"use client";

import { Fragment } from 'react';
import type { HeatCell } from '@/Types/DashboardData';

export default function NutrientHeatmap({ data }: { data: HeatCell[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-gray-500 py-12 text-center">No data to display.</p>;
  }

  // unique rows (diets) and columns (nutrients), in first-seen order
  const diets     = [...new Set(data.map(d => d.Diet))];
  const nutrients = [...new Set(data.map(d => d.Nutrient))];
  const max = Math.max(...data.map(d => d.Value));

  const valueAt = (diet: string, nutrient: string) =>
    data.find(d => d.Diet === diet && d.Nutrient === nutrient)?.Value ?? 0;

  return (
    <div
      className="grid gap-1 py-4 text-xs"
      style={{ gridTemplateColumns: `90px repeat(${nutrients.length}, 1fr)` }}
    >
      {/* top-left empty corner + column headers */}
      <div />
      {nutrients.map(n => (
        <div key={n} className="text-center font-medium text-gray-600">{n}</div>
      ))}

      {/* one row per diet: label cell + coloured value cells */}
      {diets.map(diet => (
        <Fragment key={diet}>
          <div className="flex items-center font-medium text-gray-600">{diet}</div>
          {nutrients.map(n => {
            const v = valueAt(diet, n);
            const intensity = max ? v / max : 0;          // 0 → 1
            return (
              <div
                key={n}
                title={`${diet} · ${n}: ${v}`}
                className="text-center py-3 rounded"
                style={{
                  background: `rgba(37, 99, 235, ${intensity})`,
                  color: intensity > 0.5 ? '#fff' : '#1f2937',
                }}
              >
                {v}
              </div>
            );
          })}
        </Fragment>
      ))}
    </div>
  );
}
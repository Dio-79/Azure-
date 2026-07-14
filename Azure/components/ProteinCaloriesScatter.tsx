"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ScatterPoint } from '@/Types/DashboardData';

export default function ProteinCaloriesScatter({ data }: { data: ScatterPoint[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-gray-500 py-12 text-center">No data to display.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ScatterChart margin={{ top: 8, right: 16, bottom: 16, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          type="number"
          dataKey="Protein"
          name="Protein"
          unit="g"
          tick={{ fontSize: 12 }}
          label={{ value: 'Protein (g)', position: 'insideBottom', offset: -8, fontSize: 12 }}
        />
        <YAxis
          type="number"
          dataKey="Calories"
          name="Calories"
          unit=" kcal"
          tick={{ fontSize: 12 }}
        />
        <ZAxis range={[60, 60]} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter data={data} fill="#2563eb" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
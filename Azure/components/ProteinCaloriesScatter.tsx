"use client";

import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import type { ScatterPoint } from "@/types/nutrition";

interface ProteinCaloriesScatterProps {
  data: ScatterPoint[];
}

export default function ProteinCaloriesScatter({
  data,
}: ProteinCaloriesScatterProps) {
  if (data.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-gray-500">
        No data to display.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ScatterChart
        margin={{ top: 8, right: 16, bottom: 16, left: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          type="number"
          dataKey="x"
          name="Protein"
          unit="g"
          tick={{ fontSize: 12 }}
          label={{
            value: "Protein (g)",
            position: "insideBottom",
            offset: -8,
            fontSize: 12,
          }}
        />
        <YAxis
          type="number"
          dataKey="y"
          name="Calories"
          unit=" kcal"
          tick={{ fontSize: 12 }}
        />
        <ZAxis range={[60, 60]} />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Scatter data={data} fill="#2563eb" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

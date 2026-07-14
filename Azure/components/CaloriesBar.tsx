"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { DietSummary } from '@/Types/DashboardData';

export default function CaloriesBar({data}:{data:DietSummary[]}){
    if (data.length==0){
        return<p className="text-sm text-gray-500 py-12 text-center">No data to display.</p>
    }
    return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="Diet"
          tick={{ fontSize: 12 }}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          label={{ value: 'kcal', angle: -90, position: 'insideLeft', fontSize: 12 }}
        />
        <Tooltip />
        <Bar dataKey="AvgCalories" fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>)
}

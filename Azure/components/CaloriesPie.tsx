"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import type { DietSummary } from '@/Types/DashboardData';

const COLORS = ['#2563eb', '#16a34a', '#9333ea', '#ea580c', '#0891b2', '#ca8a04'];

export default function CaloriesPie({data}:{data:DietSummary[]}){
    if (data.length==0){
        return<p className="text-sm text-gray-500 py-12 text-center">No data to display.</p>
    }
    return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="AvgCalories"
          nameKey="Diet"
          cx="50%"
          cy="50%"
          outerRadius={90}
          label={({ name }) => name}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        </PieChart>
    </ResponsiveContainer>)
}

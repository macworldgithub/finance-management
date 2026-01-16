"use client";
import { useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

type ProcessSeverityItem = {
  No: string | number;
  Process: string;
  Scale: number;
  Rating: string;
};

interface Props {
  data: ProcessSeverityItem[];
}

const COLORS = [
  "#2563eb",
  "#f97316",
  "#9ca3af",
  "#eab308",
  "#60a5fa",
  "#22c55e",
  "#1e40af",
  "#92400e",
  "#0f766e",
  "#7c3aed",
  "#ef4444",
  "#16a34a",
];

export default function ProcessSeverityDonutChart({ data }: Props) {
  const chartData = useMemo(() => {
    return (data || []).map((item, idx) => ({
      key: idx,
      name: `${item.No} ${item.Process}`.trim(),
      value: 1,
    }));
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Process Severity</h2>

      <div className="h-[520px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={1}
              isAnimationActive={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.key}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

"use client";
import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type EffectivenessLineData = {
  month: number;
  actualDesign: number;
  actualSustainability: number;
  actualOperating: number;
  actualEffectiveness: number;
  stdDesign: number;
  stdOperating: number;
  stdSustainability: number;
  stdEffectiveness: number;
};

interface Props {
  data?: EffectivenessLineData[];
}

const COLORS = {
  actualDesign: "#2563eb",
  actualSustainability: "#6b7280",
  actualOperating: "#f97316",
  actualEffectiveness: "#eab308",
  stdDesign: "#93c5fd",
  stdOperating: "#22c55e",
  stdSustainability: "#1e40af",
  stdEffectiveness: "#92400e",
};

const defaultData: EffectivenessLineData[] = [
  {
    month: 1,
    actualDesign: 7,
    actualSustainability: 4.5,
    actualOperating: 8.5,
    actualEffectiveness: 19.5,
    stdDesign: 5,
    stdOperating: 10,
    stdSustainability: 4.5,
    stdEffectiveness: 24,
  },
  {
    month: 2,
    actualDesign: 8,
    actualSustainability: 4.5,
    actualOperating: 8.5,
    actualEffectiveness: 20.5,
    stdDesign: 5,
    stdOperating: 10,
    stdSustainability: 4.5,
    stdEffectiveness: 24,
  },
  {
    month: 3,
    actualDesign: 8.5,
    actualSustainability: 4.5,
    actualOperating: 8.5,
    actualEffectiveness: 20,
    stdDesign: 5,
    stdOperating: 10,
    stdSustainability: 4.5,
    stdEffectiveness: 24,
  },
  {
    month: 4,
    actualDesign: 6,
    actualSustainability: 4.5,
    actualOperating: 8.5,
    actualEffectiveness: 18,
    stdDesign: 5,
    stdOperating: 10,
    stdSustainability: 4.5,
    stdEffectiveness: 24,
  },
  {
    month: 5,
    actualDesign: 7,
    actualSustainability: 4.5,
    actualOperating: 8.5,
    actualEffectiveness: 20,
    stdDesign: 5,
    stdOperating: 10,
    stdSustainability: 4.5,
    stdEffectiveness: 24,
  },
  {
    month: 6,
    actualDesign: 9,
    actualSustainability: 4.5,
    actualOperating: 8.5,
    actualEffectiveness: 21,
    stdDesign: 5,
    stdOperating: 10,
    stdSustainability: 4.5,
    stdEffectiveness: 24,
  },
  {
    month: 7,
    actualDesign: 5,
    actualSustainability: 4.5,
    actualOperating: 8.5,
    actualEffectiveness: 17.5,
    stdDesign: 5,
    stdOperating: 10,
    stdSustainability: 4.5,
    stdEffectiveness: 24,
  },
  {
    month: 8,
    actualDesign: 8,
    actualSustainability: 4.5,
    actualOperating: 8.5,
    actualEffectiveness: 22,
    stdDesign: 5,
    stdOperating: 10,
    stdSustainability: 4.5,
    stdEffectiveness: 24,
  },
  {
    month: 9,
    actualDesign: 7,
    actualSustainability: 4.5,
    actualOperating: 8.5,
    actualEffectiveness: 19,
    stdDesign: 5,
    stdOperating: 10,
    stdSustainability: 4.5,
    stdEffectiveness: 24,
  },
  {
    month: 10,
    actualDesign: 8,
    actualSustainability: 4.5,
    actualOperating: 8.5,
    actualEffectiveness: 19.5,
    stdDesign: 5,
    stdOperating: 10,
    stdSustainability: 4.5,
    stdEffectiveness: 24,
  },
  {
    month: 11,
    actualDesign: 7,
    actualSustainability: 4.5,
    actualOperating: 8.5,
    actualEffectiveness: 18.5,
    stdDesign: 5,
    stdOperating: 10,
    stdSustainability: 4.5,
    stdEffectiveness: 24,
  },
  {
    month: 12,
    actualDesign: 6,
    actualSustainability: 4.5,
    actualOperating: 8.5,
    actualEffectiveness: 21,
    stdDesign: 5,
    stdOperating: 10,
    stdSustainability: 4.5,
    stdEffectiveness: 24,
  },
];

export default function EffectivenessLineChart({ data = defaultData }: Props) {
  const chartData = useMemo(() => data, [data]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        Assessment of Effectiveness
      </h2>

      <div className="h-[500px]">
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />

            <XAxis
              dataKey="month"
              label={{ value: "Month", position: "insideBottom", offset: -10 }}
              tick={{ fontSize: 12 }}
            />

            <YAxis
              label={{ value: "Score", angle: -90, position: "insideLeft" }}
              tick={{ fontSize: 12 }}
              domain={[0, 25]}
            />

            {/* Actual Scores - Solid Lines */}
            <Line
              type="monotone"
              dataKey="actualDesign"
              stroke={COLORS.actualDesign}
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Actual - Design Score"
            />
            <Line
              type="monotone"
              dataKey="actualSustainability"
              stroke={COLORS.actualSustainability}
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Actual - Sustainability Score"
            />
            <Line
              type="monotone"
              dataKey="actualOperating"
              stroke={COLORS.actualOperating}
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Actual - Operating Score"
            />
            <Line
              type="monotone"
              dataKey="actualEffectiveness"
              stroke={COLORS.actualEffectiveness}
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Actual - Effectiveness Score"
            />

            {/* Standard Scores - Dashed Lines */}
            <Line
              type="monotone"
              dataKey="stdDesign"
              stroke={COLORS.stdDesign}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3 }}
              name="Standard - Design Score (0-10)"
            />
            <Line
              type="monotone"
              dataKey="stdOperating"
              stroke={COLORS.stdOperating}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3 }}
              name="Standard - Operating Score (0-10)"
            />
            <Line
              type="monotone"
              dataKey="stdSustainability"
              stroke={COLORS.stdSustainability}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3 }}
              name="Standard - Sustainability Score (0-5)"
            />
            <Line
              type="monotone"
              dataKey="stdEffectiveness"
              stroke={COLORS.stdEffectiveness}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3 }}
              name="Standard - Effectiveness Score (0-25)"
            />

            <Tooltip />
            <Legend
              verticalAlign="bottom"
              height={100}
              wrapperStyle={{ fontSize: 11 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

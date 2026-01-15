"use client";
import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type EffectivenessItem = {
  Id: string;
  No: string | number;
  Process: string;
  Date: string;
  DesignScore: number;
  OperatingScore: number;
  SustainabilityScore: number;
  EffectivenessScore: number;
  TotalScore: string;
  Scale: number;
  Rating: string;
};

interface EffectivenessChartProps {
  data: EffectivenessItem[];
}

const COLORS = [
  "#8884d8", // Actual Design
  "#82ca9d", // Actual Operating
  "#ffc658", // Actual Sustainability
  "#ff7f7f", // Actual Effectiveness
  "#d0ed57", // Standard Design
  "#8dd1e1", // Standard Operating
  "#b794f6", // Standard Sustainability
  "#f6ad55", // Standard Effectiveness
];

const LEGEND_ITEMS = [
  { color: COLORS[0], label: "Actual - Design Score" },
  { color: COLORS[1], label: "Actual - Operating Score" },
  { color: COLORS[2], label: "Actual - Sustainability Score" },
  { color: COLORS[3], label: "Actual - Effectiveness Score" },
  { color: COLORS[4], label: "Standard - Design Score (0-10)" },
  { color: COLORS[5], label: "Standard - Operating Score (0-10)" },
  { color: COLORS[6], label: "Standard - Sustainability Score (0-5)" },
  { color: COLORS[7], label: "Standard - Effectiveness Score (0-25)" },
];

export default function EffectivenessChart({ data }: EffectivenessChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      id: item.Id,
      process: item.Process || "Unknown Process",
      // Actual scores
      actualDesign: Number(item.DesignScore || 0),
      actualOperating: Number(item.OperatingScore || 0),
      actualSustainability: Number(item.SustainabilityScore || 0),
      actualEffectiveness: Number(item.EffectivenessScore || 0),
      // Standard scores (fixed values based on requirements)
      standardDesign: 10,
      standardOperating: 10,
      standardSustainability: 5,
      standardEffectiveness: 25,
    }));
  }, [data]);

  const truncateLabel = (label: string) =>
    label.length > 15 ? `${label.slice(0, 15)}...` : label;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Assessment of Effectiveness
      </h2>

      <div className="h-80 w-full mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="process"
              interval={0}
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 10 }}
              stroke="#6b7280"
              tickFormatter={(value) => truncateLabel(value)}
            />
            <YAxis domain={[0, 30]} tick={{ fontSize: 11 }} stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
              formatter={(value, name) => [value, name]}
              labelFormatter={(label) => `Process: ${label}`}
            />

            {/* Actual Scores */}
            <Bar
              dataKey="actualDesign"
              fill={COLORS[0]}
              name="Actual - Design Score"
              barSize={12}
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="actualOperating"
              fill={COLORS[1]}
              name="Actual - Operating Score"
              barSize={12}
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="actualSustainability"
              fill={COLORS[2]}
              name="Actual - Sustainability Score"
              barSize={12}
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="actualEffectiveness"
              fill={COLORS[3]}
              name="Actual - Effectiveness Score"
              barSize={12}
              radius={[2, 2, 0, 0]}
            />

            {/* Standard Scores */}
            <Bar
              dataKey="standardDesign"
              fill={COLORS[4]}
              name="Standard - Design Score (0-10)"
              barSize={12}
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="standardOperating"
              fill={COLORS[5]}
              name="Standard - Operating Score (0-10)"
              barSize={12}
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="standardSustainability"
              fill={COLORS[6]}
              name="Standard - Sustainability Score (0-5)"
              barSize={12}
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="standardEffectiveness"
              fill={COLORS[7]}
              name="Standard - Effectiveness Score (0-25)"
              barSize={12}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Color Legend */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Color Legend
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {LEGEND_ITEMS.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

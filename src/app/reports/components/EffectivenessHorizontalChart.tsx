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

interface EffectivenessHorizontalChartProps {
  data: EffectivenessItem[];
}

const COLORS = [
  "#8884d8", // Actual - Design
  "#82ca9d", // Actual - Operating
  "#ffc658", // Actual - Sustainability
  "#ff7f7f", // Actual - Effectiveness
  "#d0ed57", // Standard - Design
  "#8dd1e1", // Standard - Operating
  "#b794f6", // Standard - Sustainability
  "#f6ad55", // Standard - Effectiveness
];

export default function EffectivenessHorizontalChart({
  data,
}: EffectivenessHorizontalChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      process: item.Process || "Unknown Process",
      actualDesign: Number(item.DesignScore || 0),
      actualOperating: Number(item.OperatingScore || 0),
      actualSustainability: Number(item.SustainabilityScore || 0),
      actualEffectiveness: Number(item.EffectivenessScore || 0),
      standardDesign: 10,
      standardOperating: 10,
      standardSustainability: 5,
      standardEffectiveness: 25,
    }));
  }, [data]);

  const truncateLabel = (label: string) =>
    label.length > 35 ? `${label.slice(0, 35)}...` : label;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Assessment of Effectiveness - Horizontal
      </h2>

      <div className="h-[700px] w-full mb-8">
        {" "}
        {/* Increased height for better visibility */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 220, bottom: 20 }} // More left space for long labels
            barGap={3}
            barCategoryGap={14} // ← key: space between groups of bars
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

            <XAxis
              type="number"
              domain={[0, 30]}
              tick={{ fontSize: 11 }}
              stroke="#6b7280"
            />

            <YAxis
              dataKey="process"
              type="category"
              width={200} // More width for process names
              tick={{ fontSize: 10 }}
              stroke="#6b7280"
              tickFormatter={truncateLabel}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />

            <Legend
              wrapperStyle={{ fontSize: "12px", bottom: -10 }}
              verticalAlign="bottom"
              height={60}
            />

            {/* 8 separate bars – NO stackId */}
            <Bar
              dataKey="actualDesign"
              fill={COLORS[0]}
              name="Actual - Design"
              barSize={10}
            />
            <Bar
              dataKey="actualOperating"
              fill={COLORS[1]}
              name="Actual - Operating"
              barSize={10}
            />
            <Bar
              dataKey="actualSustainability"
              fill={COLORS[2]}
              name="Actual - Sustainability"
              barSize={10}
            />
            <Bar
              dataKey="actualEffectiveness"
              fill={COLORS[3]}
              name="Actual - Effectiveness"
              barSize={10}
            />

            <Bar
              dataKey="standardDesign"
              fill={COLORS[4]}
              name="Std - Design (10)"
              barSize={10}
            />
            <Bar
              dataKey="standardOperating"
              fill={COLORS[5]}
              name="Std - Operating (10)"
              barSize={10}
            />
            <Bar
              dataKey="standardSustainability"
              fill={COLORS[6]}
              name="Std - Sustainability (5)"
              barSize={10}
            />
            <Bar
              dataKey="standardEffectiveness"
              fill={COLORS[7]}
              name="Std - Effectiveness (25)"
              barSize={10}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

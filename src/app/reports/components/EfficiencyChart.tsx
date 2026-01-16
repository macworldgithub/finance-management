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

type EfficiencyItem = {
  Id: string;
  No: string | number;
  Process: string;
  Date: string;
  ObjectiveAchievementScore: number;
  TimelinessThroughputScore: number;
  ResourceConsumptionScore: number;
  EfficiencyScore: number;
  TotalScore: string;
  Scale: number;
  Rating: string;
};

interface EfficiencyChartProps {
  data: EfficiencyItem[];
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f7f",
  "#d0ed57",
  "#8dd1e1",
  "#b794f6",
  "#f6ad55",
];

const LEGEND_ITEMS = [
  { color: COLORS[0], label: "Actual - Objective Achievement Score" },
  { color: COLORS[1], label: "Actual - Process Timeliness & Throughput Score" },
  { color: COLORS[2], label: "Actual - Resource Consumption Score" },
  { color: COLORS[3], label: "Actual - Efficiency Score" },
  { color: COLORS[4], label: "Standard - Objective Achievement Score (0-10)" },
  {
    color: COLORS[5],
    label: "Standard - Process Timeliness & Throughput Score (0-10)",
  },
  { color: COLORS[6], label: "Standard - Resource Consumption Score (0-5)" },
  { color: COLORS[7], label: "Standard - Efficiency Score (0-25)" },
];

export default function EfficiencyChart({ data }: EfficiencyChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      id: item.Id,
      process: item.Process || "Unknown Process",
      actualObjectiveAchievement: Number(item.ObjectiveAchievementScore || 0),
      actualTimelinessThroughput: Number(item.TimelinessThroughputScore || 0),
      actualResourceConsumption: Number(item.ResourceConsumptionScore || 0),
      actualEfficiency: Number(item.EfficiencyScore || 0),
      standardObjectiveAchievement: 10,
      standardTimelinessThroughput: 10,
      standardResourceConsumption: 5,
      standardEfficiency: 25,
    }));
  }, [data]);

  const truncateLabel = (label: string) =>
    label.length > 15 ? `${label.slice(0, 15)}...` : label;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Assessment of Efficiency
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

            <Bar
              dataKey="actualObjectiveAchievement"
              fill={COLORS[0]}
              name="Actual - Objective Achievement Score"
              barSize={12}
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="actualTimelinessThroughput"
              fill={COLORS[1]}
              name="Actual - Process Timeliness & Throughput Score"
              barSize={12}
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="actualResourceConsumption"
              fill={COLORS[2]}
              name="Actual - Resource Consumption Score"
              barSize={12}
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="actualEfficiency"
              fill={COLORS[3]}
              name="Actual - Efficiency Score"
              barSize={12}
              radius={[2, 2, 0, 0]}
            />

            <Bar
              dataKey="standardObjectiveAchievement"    
              fill={COLORS[4]}
              name="Standard - Objective Achievement Score (0-10)"
              barSize={12}
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="standardTimelinessThroughput"
              fill={COLORS[5]}
              name="Standard - Process Timeliness & Throughput Score (0-10)"
              barSize={12}
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="standardResourceConsumption"
              fill={COLORS[6]}
              name="Standard - Resource Consumption Score (0-5)"
              barSize={12}
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="standardEfficiency"
              fill={COLORS[7]}
              name="Standard - Efficiency Score (0-25)"
              barSize={12}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

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

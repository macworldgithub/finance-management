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

interface EfficiencyHorizontalChartProps {
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

export default function EfficiencyHorizontalChart({
  data,
}: EfficiencyHorizontalChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
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
    label.length > 35 ? `${label.slice(0, 35)}...` : label;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Assessment of Efficiency - Horizontal
      </h2>

      <div className="h-[700px] w-full mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 220, bottom: 20 }}
            barGap={3}
            barCategoryGap={14}
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
              width={200}
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

            <Bar
              dataKey="actualObjectiveAchievement"
              fill={COLORS[0]}
              name="Actual - Objective Achievement"
              barSize={10}
            />
            <Bar
              dataKey="actualTimelinessThroughput"
              fill={COLORS[1]}
              name="Actual - Process Timeliness & Throughput"
              barSize={10}
            />
            <Bar
              dataKey="actualResourceConsumption"
              fill={COLORS[2]}
              name="Actual - Resource Consumption"
              barSize={10}
            />
            <Bar
              dataKey="actualEfficiency"
              fill={COLORS[3]}
              name="Actual - Efficiency"
              barSize={10}
            />

            <Bar
              dataKey="standardObjectiveAchievement"
              fill={COLORS[4]}
              name="Std - Objective Achievement (10)"
              barSize={10}
            />
            <Bar
              dataKey="standardTimelinessThroughput"
              fill={COLORS[5]}
              name="Std - Process Timeliness & Throughput (10)"
              barSize={10}
            />
            <Bar
              dataKey="standardResourceConsumption"
              fill={COLORS[6]}
              name="Std - Resource Consumption (5)"
              barSize={10}
            />
            <Bar
              dataKey="standardEfficiency"
              fill={COLORS[7]}
              name="Std - Efficiency (25)"
              barSize={10}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

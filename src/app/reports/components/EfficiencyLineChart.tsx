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

type EfficiencyItem = {
  Process: string;
  ObjectiveAchievementScore: number;
  TimelinessThroughputScore: number;
  ResourceConsumptionScore: number;
  EfficiencyScore: number;
};

type ChartPoint = {
  index: number;
  process: string;
  actualObjectiveAchievement: number;
  actualTimelinessThroughput: number;
  actualResourceConsumption: number;
  actualEfficiency: number;
  stdObjectiveAchievement: number;
  stdTimelinessThroughput: number;
  stdResourceConsumption: number;
  stdEfficiency: number;
};

interface Props {
  data: EfficiencyItem[];
}

const COLORS = {
  actualObjectiveAchievement: "#2563eb",
  actualTimelinessThroughput: "#f97316",
  actualResourceConsumption: "#6b7280",
  actualEfficiency: "#eab308",

  stdObjectiveAchievement: "#93c5fd",
  stdTimelinessThroughput: "#22c55e",
  stdResourceConsumption: "#1e40af",
  stdEfficiency: "#92400e",
};

export default function EfficiencyLineChart({ data }: Props) {
  const chartData = useMemo<ChartPoint[]>(() => {
    return (data || []).map((item, idx) => ({
      index: idx + 1,
      process: item.Process || "",
      actualObjectiveAchievement: Number(item.ObjectiveAchievementScore || 0),
      actualTimelinessThroughput: Number(item.TimelinessThroughputScore || 0),
      actualResourceConsumption: Number(item.ResourceConsumptionScore || 0),
      actualEfficiency: Number(item.EfficiencyScore || 0),
      stdObjectiveAchievement: 10,
      stdTimelinessThroughput: 10,
      stdResourceConsumption: 5,
      stdEfficiency: 25,
    }));
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Assessment of Efficiency</h2>

      <div className="h-[500px]">
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />

            <XAxis
              dataKey="index"
              label={{
                value: "Process #",
                position: "insideBottom",
                offset: -10,
              }}
              tick={{ fontSize: 12 }}
            />

            <YAxis
              label={{ value: "Score", angle: -90, position: "insideLeft" }}
              tick={{ fontSize: 12 }}
              domain={[0, 25]}
            />

            <Line
              type="monotone"
              dataKey="actualObjectiveAchievement"
              stroke={COLORS.actualObjectiveAchievement}
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Actual - Objective Achievement Score"
            />
            <Line
              type="monotone"
              dataKey="actualTimelinessThroughput"
              stroke={COLORS.actualTimelinessThroughput}
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Actual - Process Timeliness & Throughput Score"
            />
            <Line
              type="monotone"
              dataKey="actualResourceConsumption"
              stroke={COLORS.actualResourceConsumption}
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Actual - Resource Consumption Score"
            />
            <Line
              type="monotone"
              dataKey="actualEfficiency"
              stroke={COLORS.actualEfficiency}
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Actual - Efficiency Score"
            />

            <Line
              type="monotone"
              dataKey="stdObjectiveAchievement"
              stroke={COLORS.stdObjectiveAchievement}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3 }}
              name="Standard - Objective Achievement Score (0-10)"
            />
            <Line
              type="monotone"
              dataKey="stdTimelinessThroughput"
              stroke={COLORS.stdTimelinessThroughput}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3 }}
              name="Standard - Process Timeliness & Throughput Score (0-10)"
            />
            <Line
              type="monotone"
              dataKey="stdResourceConsumption"
              stroke={COLORS.stdResourceConsumption}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3 }}
              name="Standard - Resource Consumption Score (0-5)"
            />
            <Line
              type="monotone"
              dataKey="stdEfficiency"
              stroke={COLORS.stdEfficiency}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3 }}
              name="Standard - Efficiency Score (0-25)"
            />

            <Tooltip
              labelFormatter={(label: any) => {
                const idx = Number(label);
                const p = chartData[idx - 1]?.process;
                return p ? `Process #${idx}: ${p}` : `Process #${idx}`;
              }}
            />
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

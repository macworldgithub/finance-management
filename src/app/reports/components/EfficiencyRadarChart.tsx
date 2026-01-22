"use client";
import { useMemo } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
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

interface Props {
  data: EfficiencyItem[];
}

const to25From10 = (v: number) => (v / 10) * 25;
const to25From5 = (v: number) => (v / 5) * 25;

const COLORS = {
  actualObjectiveAchievement: "#2563eb", // Blue like Design
  actualTimelinessThroughput: "#f97316", // Orange like Sustainability
  actualResourceConsumption: "#9ca3af", // Gray like Scalability
  actualEfficiency: "#eab308", // Yellow like Adequacy

  stdObjectiveAchievement: "#93c5fd", // Light blue like Design Standard
  stdTimelinessThroughput: "#22c55e", // Green like Sustainability Standard
  stdResourceConsumption: "#1e40af", // Dark blue like Scalability Standard
  stdEfficiency: "#92400e", // Dark orange like Adequacy Standard
};

const CustomAngleTick = (props: any) => {
  const { payload, x, y, textAnchor } = props;

  const words = payload.value.split(" ");
  const lines: string[] = [];
  let line = "";

  words.forEach((word: string) => {
    if ((line + word).length > 20) {
      lines.push(line.trim());
      line = word + " ";
    } else {
      line += word + " ";
    }
  });

  if (line) lines.push(line.trim());

  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((text, index) => (
        <text
          key={index}
          x={0}
          y={index * 12}
          dy={8}
          textAnchor={textAnchor}
          fontSize={9}
          fill="#374151"
        >
          {text}
        </text>
      ))}
    </g>
  );
};

export default function EfficiencyRadarChart({ data }: Props) {
  const chartData = useMemo(
    () =>
      data.map((item, index) => ({
        processLabel: `5.${index + 1} ${item.Process}`,

        actualObjectiveAchievement: to25From10(
          item.ObjectiveAchievementScore || 0,
        ),
        actualTimelinessThroughput: to25From10(
          item.TimelinessThroughputScore || 0,
        ),
        actualResourceConsumption: to25From5(
          item.ResourceConsumptionScore || 0,
        ),
        actualEfficiency: item.EfficiencyScore || 0,

        stdObjectiveAchievement: 25,
        stdTimelinessThroughput: 25,
        stdResourceConsumption: 25,
        stdEfficiency: 25,
      })),
    [data],
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Assessment of Efficiency</h2>

      <div className="h-[650px]">
        <ResponsiveContainer>
          <RadarChart outerRadius="70%" data={chartData}>
            <PolarGrid stroke="#d1d5db" />

            <PolarAngleAxis dataKey="processLabel" tick={CustomAngleTick} />

            <PolarRadiusAxis
              domain={[0, 25]}
              tickCount={6}
              tick={{ fontSize: 10 }}
            />

            <Radar
              name="Actual – Objective Achievement"
              dataKey="actualObjectiveAchievement"
              stroke={COLORS.actualObjectiveAchievement}
              strokeWidth={2.5}
              fillOpacity={0}
            />
            <Radar
              name="Actual – Process Timeliness & Throughput"
              dataKey="actualTimelinessThroughput"
              stroke={COLORS.actualTimelinessThroughput}
              strokeWidth={2.5}
              fillOpacity={0}
            />
            <Radar
              name="Actual – Resource Consumption"
              dataKey="actualResourceConsumption"
              stroke={COLORS.actualResourceConsumption}
              strokeWidth={2.5}
              fillOpacity={0}
            />
            <Radar
              name="Actual – Efficiency"
              dataKey="actualEfficiency"
              stroke={COLORS.actualEfficiency}
              strokeWidth={2.5}
              fillOpacity={0}
            />

            <Radar
              name="Standard – Objective Achievement (10)"
              dataKey="stdObjectiveAchievement"
              stroke={COLORS.stdObjectiveAchievement}
              strokeWidth={3}
              strokeDasharray="6 4"
              fillOpacity={0}
            />
            <Radar
              name="Standard – Process Timeliness & Throughput (10)"
              dataKey="stdTimelinessThroughput"
              stroke={COLORS.stdTimelinessThroughput}
              strokeWidth={3}
              strokeDasharray="6 4"
              fillOpacity={0}
            />
            <Radar
              name="Standard – Resource Consumption (5)"
              dataKey="stdResourceConsumption"
              stroke={COLORS.stdResourceConsumption}
              strokeWidth={3}
              strokeDasharray="6 4"
              fillOpacity={0}
            />
            <Radar
              name="Standard – Efficiency (25)"
              dataKey="stdEfficiency"
              stroke={COLORS.stdEfficiency}
              strokeWidth={3}
              strokeDasharray="6 4"
              fillOpacity={0}
            />

            <Tooltip />
            <Legend
              verticalAlign="bottom"
              iconType="plainline"
              wrapperStyle={{ fontSize: 11 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

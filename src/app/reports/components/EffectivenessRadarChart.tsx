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

type EffectivenessItem = {
  Process: string;
  DesignScore: number;
  OperatingScore: number;
  SustainabilityScore: number;
  EffectivenessScore: number;
};

interface Props {
  data: EffectivenessItem[];
}

const to25From10 = (v: number) => (v / 10) * 25;
const to25From5 = (v: number) => (v / 5) * 25;

const COLORS = {
  actualDesign: "#2563eb", // Blue like Design
  actualOperating: "#f97316", // Orange like Sustainability
  actualSustainability: "#9ca3af", // Gray like Scalability
  actualEffectiveness: "#eab308", // Yellow like Adequacy

  stdDesign: "#93c5fd", // Light blue like Design Standard
  stdOperating: "#22c55e", // Green like Sustainability Standard
  stdSustainability: "#1e40af", // Dark blue like Scalability Standard
  stdEffectiveness: "#92400e", // Dark orange like Adequacy Standard
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

export default function EffectivenessRadarChart({ data }: Props) {
  const chartData = useMemo(
    () =>
      data.map((item, index) => ({
        // ✅ 5.1 / 5.2 numbering + process name
        processLabel: `5.${index + 1} ${item.Process}`,

        actualDesign: to25From10(item.DesignScore || 0),
        actualOperating: to25From10(item.OperatingScore || 0),
        actualSustainability: to25From5(item.SustainabilityScore || 0),
        actualEffectiveness: item.EffectivenessScore || 0,

        // STANDARD (MAX = 25)
        stdDesign: 25,
        stdOperating: 25,
        stdSustainability: 25,
        stdEffectiveness: 25,
      })),
    [data],
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        Assessment of Effectiveness
      </h2>

      <div className="h-[650px]">
        <ResponsiveContainer>
          <RadarChart outerRadius="70%" data={chartData}>
            <PolarGrid stroke="#d1d5db" />

            {/* PROCESS NUMBER + NAME */}
            <PolarAngleAxis dataKey="processLabel" tick={CustomAngleTick} />

            <PolarRadiusAxis
              domain={[0, 25]}
              tickCount={6}
              tick={{ fontSize: 10 }}
            />

            {/* ACTUAL — OUTLINE ONLY */}
            <Radar
              name="Actual – Design"
              dataKey="actualDesign"
              stroke={COLORS.actualDesign}
              strokeWidth={2.5}
              fillOpacity={0}
            />
            <Radar
              name="Actual – Operating"
              dataKey="actualOperating"
              stroke={COLORS.actualOperating}
              strokeWidth={2.5}
              fillOpacity={0}
            />
            <Radar
              name="Actual – Sustainability"
              dataKey="actualSustainability"
              stroke={COLORS.actualSustainability}
              strokeWidth={2.5}
              fillOpacity={0}
            />
            <Radar
              name="Actual – Effectiveness"
              dataKey="actualEffectiveness"
              stroke={COLORS.actualEffectiveness}
              strokeWidth={2.5}
              fillOpacity={0}
            />

            {/* STANDARD — DASHED OUTLINE ONLY */}
            <Radar
              name="Standard – Design (10)"
              dataKey="stdDesign"
              stroke={COLORS.stdDesign}
              strokeWidth={3}
              strokeDasharray="6 4"
              fillOpacity={0}
            />
            <Radar
              name="Standard – Operating (10)"
              dataKey="stdOperating"
              stroke={COLORS.stdOperating}
              strokeWidth={3}
              strokeDasharray="6 4"
              fillOpacity={0}
            />
            <Radar
              name="Standard – Sustainability (5)"
              dataKey="stdSustainability"
              stroke={COLORS.stdSustainability}
              strokeWidth={3}
              strokeDasharray="6 4"
              fillOpacity={0}
            />
            <Radar
              name="Standard – Effectiveness (25)"
              dataKey="stdEffectiveness"
              stroke={COLORS.stdEffectiveness}
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

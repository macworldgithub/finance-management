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

type ProcessSeverityItem = {
  No: string | number;
  Process: string;
  Scale: number;
  Rating: string;
};

interface Props {
  data: ProcessSeverityItem[];
}

const CustomAngleTick = (props: any) => {
  const { payload, x, y, textAnchor } = props;

  const words = String(payload.value || "").split(" ");
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

export default function ProcessSeverityRadarChart({ data }: Props) {
  const chartData = useMemo(() => {
    return (data || []).map((item) => ({
      processLabel: `${item.No} ${item.Process}`.trim(),
      scale: Number(item.Scale || 0),
    }));
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Process Severity</h2>

      <div className="h-[500px]">
        <ResponsiveContainer>
          <RadarChart outerRadius="70%" data={chartData}>
            <PolarGrid stroke="#d1d5db" />
            <PolarAngleAxis dataKey="processLabel" tick={CustomAngleTick} />
            <PolarRadiusAxis
              domain={[0, 4]}
              tickCount={5}
              tick={{ fontSize: 10 }}
            />

            <Radar
              name="Scale(1-4)"
              dataKey="scale"
              stroke="#2563eb"
              strokeWidth={3}
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

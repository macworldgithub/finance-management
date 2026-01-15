// "use client";
// import { useMemo } from "react";
// import {
//   ResponsiveContainer,
//   RadarChart,
//   Radar,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis,
//   Tooltip,
//   Legend,
// } from "recharts";

// type EffectivenessItem = {
//   Id: string;
//   No: string | number;
//   Process: string;
//   Date: string;
//   DesignScore: number;
//   OperatingScore: number;
//   SustainabilityScore: number;
//   EffectivenessScore: number;
//   TotalScore: string;
//   Scale: number;
//   Rating: string;
// };

// interface EffectivenessRadarChartProps {
//   data: EffectivenessItem[];
// }

// const COLORS = {
//   actualDesign: "#8884d8", // Purple
//   actualOperating: "#ff7f7f", // Red
//   actualSustainability: "#ffc658", // Orange
//   actualEffectiveness: "#82ca9d", // Green
//   standardDesign: "#4c1d95", // Dark Purple
//   standardOperating: "#dc2626", // Dark Red
//   standardSustainability: "#f97316", // Dark Orange
//   standardEffectiveness: "#16a34a", // Dark Green
// };

// export default function EffectivenessRadarChart({
//   data,
// }: EffectivenessRadarChartProps) {
//   const chartData = useMemo(() => {
//     return data.map((item) => ({
//       process: item.Process || "Unknown Process",
//       no: String(item.No || ""),
//       // Actual scores
//       actualDesign: Number(item.DesignScore || 0),
//       actualOperating: Number(item.OperatingScore || 0),
//       actualSustainability: Number(item.SustainabilityScore || 0),
//       actualEffectiveness: Number(item.EffectivenessScore || 0),
//       // Standard scores (fixed as per your requirement)
//       standardDesign: 10,
//       standardOperating: 10,
//       standardSustainability: 5,
//       standardEffectiveness: 25,
//     }));
//   }, [data]);

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md">
//       <h2 className="text-xl font-semibold mb-6 text-gray-800">
//         Assessment of Effectiveness - Radar Chart
//       </h2>

//       <div className="h-[600px] w-full">
//         <ResponsiveContainer width="100%" height="100%">
//           <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="80%">
//             <PolarGrid stroke="#e5e7eb" strokeWidth={1} />

//             <PolarAngleAxis
//               dataKey="no"
//               tick={{ fontSize: 11, fill: "#374151" }}
//               tickLine={false}
//             />

//             <PolarRadiusAxis
//               angle={90}
//               domain={[0, 30]}
//               tick={{ fontSize: 10, fill: "#6b7280" }}
//               tickCount={7}
//             />

//             {/* Actual Scores */}
//             <Radar
//               name="Actual - Design Score"
//               dataKey="actualDesign"
//               stroke={COLORS.actualDesign}
//               fill={COLORS.actualDesign}
//               fillOpacity={0.4}
//               strokeWidth={2}
//               dot={false}
//             />
//             <Radar
//               name="Actual - Operating Score"
//               dataKey="actualOperating"
//               stroke={COLORS.actualOperating}
//               fill={COLORS.actualOperating}
//               fillOpacity={0.4}
//               strokeWidth={2}
//               dot={false}
//             />
//             <Radar
//               name="Actual - Sustainability Score"
//               dataKey="actualSustainability"
//               stroke={COLORS.actualSustainability}
//               fill={COLORS.actualSustainability}
//               fillOpacity={0.4}
//               strokeWidth={2}
//               dot={false}
//             />
//             <Radar
//               name="Actual - Effectiveness Score"
//               dataKey="actualEffectiveness"
//               stroke={COLORS.actualEffectiveness}
//               fill={COLORS.actualEffectiveness}
//               fillOpacity={0.4}
//               strokeWidth={2}
//               dot={false}
//             />

//             {/* Standard Scores */}
//             <Radar
//               name="Standard - Design (0-10)"
//               dataKey="standardDesign"
//               stroke={COLORS.standardDesign}
//               fill={COLORS.standardDesign}
//               fillOpacity={0.2}
//               strokeWidth={3}
//               strokeDasharray="5 5"
//             />
//             <Radar
//               name="Standard - Operating (0-10)"
//               dataKey="standardOperating"
//               stroke={COLORS.standardOperating}
//               fill={COLORS.standardOperating}
//               fillOpacity={0.2}
//               strokeWidth={3}
//               strokeDasharray="5 5"
//             />
//             <Radar
//               name="Standard - Sustainability (0-5)"
//               dataKey="standardSustainability"
//               stroke={COLORS.standardSustainability}
//               fill={COLORS.standardSustainability}
//               fillOpacity={0.2}
//               strokeWidth={3}
//               strokeDasharray="5 5"
//             />
//             <Radar
//               name="Standard - Effectiveness (0-25)"
//               dataKey="standardEffectiveness"
//               stroke={COLORS.standardEffectiveness}
//               fill={COLORS.standardEffectiveness}
//               fillOpacity={0.2}
//               strokeWidth={3}
//               strokeDasharray="5 5"
//             />

//             <Tooltip
//               contentStyle={{
//                 backgroundColor: "#fff",
//                 border: "1px solid #e5e7eb",
//                 borderRadius: "8px",
//                 fontSize: "12px",
//               }}
//               formatter={(value: number) => value.toFixed(1)}
//             />

//             <Legend
//               verticalAlign="bottom"
//               height={80}
//               iconType="line"
//               wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
//             />
//           </RadarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }
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

interface EffectivenessRadarChartProps {
  data: EffectivenessItem[];
}

const COLORS = {
  actualDesign: "#8884d8", // Light Purple
  actualOperating: "#ff7f7f", // Light Red
  actualSustainability: "#ffc658", // Light Orange
  actualEffectiveness: "#82ca9d", // Light Green
  standardDesign: "#6b21a8", // Darker Purple
  standardOperating: "#dc2626", // Dark Red
  standardSustainability: "#ea580c", // Dark Orange
  standardEffectiveness: "#15803d", // Dark Green
};

export default function EffectivenessRadarChart({
  data,
}: EffectivenessRadarChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      fullProcess: item.Process?.trim() || "Unknown Process",
      no: String(item.No || ""),
      // Actual scores
      actualDesign: Number(item.DesignScore || 0),
      actualOperating: Number(item.OperatingScore || 0),
      actualSustainability: Number(item.SustainabilityScore || 0),
      actualEffectiveness: Number(item.EffectivenessScore || 0),
      // Standard (fixed max values)
      standardDesign: 10,
      standardOperating: 10,
      standardSustainability: 5,
      standardEffectiveness: 25,
    }));
  }, [data]);

  // Custom tick formatter - show full name with better readability
  const customTick = (props: any) => {
    const { payload, x, y, textAnchor } = props;
    const value = payload.value; // fullProcess
    const words = value.split(" ");
    const lines = [];
    let currentLine = "";

    // Split into 2-3 lines if too long
    for (const word of words) {
      if ((currentLine + word).length > 18) {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        currentLine += word + " ";
      }
    }
    if (currentLine.trim()) lines.push(currentLine.trim());

    return (
      <g transform={`translate(${x},${y})`}>
        {lines.map((line, i) => (
          <text
            key={i}
            x={0}
            y={i * 12}
            dy={8}
            fontSize={9}
            fill="#374151"
            textAnchor={textAnchor}
            style={{ pointerEvents: "none" }}
          >
            {line}
          </text>
        ))}
      </g>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Assessment of Effectiveness - Radar Chart
      </h2>

      <div className="h-[700px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="72%" data={chartData}>
            <PolarGrid stroke="#d1d5db" strokeWidth={1} />

            <PolarAngleAxis
              dataKey="fullProcess"
              tick={customTick}
              tickLine={false}
              axisLine={false}
            />

            <PolarRadiusAxis
              angle={90}
              domain={[0, 30]}
              tick={{ fontSize: 10, fill: "#6b7280" }}
              tickCount={7}
              //@ts-ignore
              axisLineType="circle"
            />
    
            {/* Actual Scores - solid lines */}
            <Radar
              name="Actual - Design Score"
              dataKey="actualDesign"
              stroke={COLORS.actualDesign}
              fill={COLORS.actualDesign}
              fillOpacity={0.35}
              strokeWidth={2.5}
            />
            <Radar
              name="Actual - Operating Score"
              dataKey="actualOperating"
              stroke={COLORS.actualOperating}
              fill={COLORS.actualOperating}
              fillOpacity={0.35}
              strokeWidth={2.5}
            />
            <Radar
              name="Actual - Sustainability Score"
              dataKey="actualSustainability"
              stroke={COLORS.actualSustainability}
              fill={COLORS.actualSustainability}
              fillOpacity={0.35}
              strokeWidth={2.5}
            />
            <Radar
              name="Actual - Effectiveness Score"
              dataKey="actualEffectiveness"
              stroke={COLORS.actualEffectiveness}
              fill={COLORS.actualEffectiveness}
              fillOpacity={0.35}
              strokeWidth={2.5}
            />

            {/* Standard Scores - dashed darker lines */}
            <Radar
              name="Std Design (0-10)"
              dataKey="standardDesign"
              stroke={COLORS.standardDesign}
              fill={COLORS.standardDesign}
              fillOpacity={0.15}
              strokeWidth={3}
              strokeDasharray="6 4"
            />
            <Radar
              name="Std Operating (0-10)"
              dataKey="standardOperating"
              stroke={COLORS.standardOperating}
              fill={COLORS.standardOperating}
              fillOpacity={0.15}
              strokeWidth={3}
              strokeDasharray="6 4"
            />
            <Radar
              name="Std Sustainability (0-5)"
              dataKey="standardSustainability"
              stroke={COLORS.standardSustainability}
              fill={COLORS.standardSustainability}
              fillOpacity={0.15}
              strokeWidth={3}
              strokeDasharray="6 4"
            />
            <Radar
              name="Std Effectiveness (0-25)"
              dataKey="standardEffectiveness"
              stroke={COLORS.standardEffectiveness}
              fill={COLORS.standardEffectiveness}
              fillOpacity={0.15}
              strokeWidth={3}
              strokeDasharray="6 4"
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number) => `${value.toFixed(1)}`}
            />

            <Legend
              verticalAlign="bottom"
              height={100}
              iconType="plainline"
              wrapperStyle={{ fontSize: "11px", paddingTop: "20px" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

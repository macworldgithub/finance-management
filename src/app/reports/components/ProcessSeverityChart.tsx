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

type ProcessSeverityItem = {
  Id: string;
  No: string | number;
  Process: string;
  Date: string;
  Scale: number;
  Rating: string;
};

interface Props {
  data: ProcessSeverityItem[];
}

const ratingToScale = (rating: string): number => {
  const r = String(rating || "").toLowerCase();
  if (r.includes("critical")) return 4;
  if (r.includes("high")) return 3;
  if (r.includes("medium")) return 2;
  if (r.includes("low")) return 1;
  return 0;
};

export default function ProcessSeverityChart({ data }: Props) {
  const chartData = useMemo(() => {
    return (data || []).map((item) => {
      const no = item.No ?? "";
      const process = item.Process || "";
      return {
        id: item.Id,
        processLabel: `${no} ${process}`.trim(),
        scale: Number(item.Scale || 0),
        severityLevel: ratingToScale(item.Rating),
      };
    });
  }, [data]);

  const truncateLabel = (label: string) =>
    label.length > 18 ? `${label.slice(0, 18)}...` : label;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Process Severity
      </h2>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="processLabel"
              interval={0}
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 10 }}
              stroke="#6b7280"
              tickFormatter={(value) => truncateLabel(String(value))}
            />
            <YAxis domain={[0, 4.5]} tick={{ fontSize: 11 }} stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={50}
              wrapperStyle={{ fontSize: 11 }}
            />

            <Bar
              dataKey="scale"
              fill="#2563eb"
              name="Process Severity Scale(1-4)"
              barSize={18}
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="severityLevel"
              fill="#f97316"
              name="Process Severity Levels"
              barSize={18}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

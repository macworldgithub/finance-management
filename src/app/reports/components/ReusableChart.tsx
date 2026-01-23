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
  BarChart,
  Bar,
} from "recharts";

interface ScoreData {
  id: string | number;
  short: string;
  processLabel: string;
  fullProcess: string;
  score: number;
  standard: number;
}

interface ReusableChartProps {
  title: string;
  data: ScoreData[];
  scoreKey: string;
  standardKey: string;
  scoreColor: string;
  standardColor: string;
  chartType: "line" | "bar" | "horizontal";
}

const COLORS = {
  primary: "#2563eb",
  secondary: "#93c5fd",
  success: "#22c55e",
  warning: "#f97316",
  info: "#9ca3af",
  danger: "#ef4444",
};

export default function ReusableChart({
  title,
  data,
  scoreKey,
  standardKey,
  scoreColor,
  standardColor,
  chartType,
}: ReusableChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      [scoreKey]: item.score,
      [standardKey]: item.standard,
    }));
  }, [data, scoreKey, standardKey]);

  const commonProps = {
    data: chartData,
    margin: { top: 8, right: 12, left: 40, bottom: 28 },
  };

  const commonAxisProps = {
    tick: { fontSize: 11 },
    stroke: "#6b7280",
  };

  const tooltipProps = {
    contentStyle: {
      backgroundColor: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
    },
  };

  const legendProps = {
    verticalAlign: "bottom" as const,
    height: 72,
    wrapperStyle: { fontSize: "11px" },
  };

  if (chartType === "line") {
    return (
      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
          {title}
        </h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="processLabel"
                interval={0}
                angle={-45}
                textAnchor="end"
                height={90}
                {...commonAxisProps}
              />
              <YAxis
                allowDecimals={false}
                domain={[0, 30]}
                {...commonAxisProps}
              />
              <Tooltip {...tooltipProps} />
              <Legend {...legendProps} />
              <Line
                type="monotone"
                dataKey={scoreKey}
                stroke={scoreColor}
                strokeWidth={2}
                dot={{ r: 3 }}
                name={`Actual - ${title}`}
                animationDuration={900}
              />
              <Line
                type="monotone"
                dataKey={standardKey}
                stroke={standardColor}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name={`Standard - ${title}`}
                animationDuration={900}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  if (chartType === "bar") {
    return (
      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
          {title}
        </h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="processLabel"
                interval={0}
                angle={-45}
                textAnchor="end"
                height={90}
                {...commonAxisProps}
              />
              <YAxis
                allowDecimals={false}
                domain={[0, 30]}
                {...commonAxisProps}
              />
              <Tooltip {...tooltipProps} />
              <Legend {...legendProps} />
              <Bar
                dataKey={scoreKey}
                fill={scoreColor}
                name={`Actual - ${title}`}
                barSize={data.length > 12 ? 10 : 14}
                animationDuration={900}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey={standardKey}
                fill={standardColor}
                name={`Standard - ${title}`}
                barSize={data.length > 12 ? 10 : 14}
                animationDuration={900}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  if (chartType === "horizontal") {
    return (
      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
          {title}
        </h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 8, right: 12, left: 0, bottom: 28 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                type="number"
                allowDecimals={false}
                domain={[0, 30]}
                {...commonAxisProps}
              />
              <YAxis
                dataKey="processLabel"
                type="category"
                width={120}
                tick={{ fontSize: 10 }}
                stroke="#6b7280"
              />
              <Tooltip {...tooltipProps} />
              <Legend {...legendProps} />
              <Bar
                dataKey={scoreKey}
                fill={scoreColor}
                name={`Actual - ${title}`}
                animationDuration={900}
                radius={[0, 4, 4, 0]}
                barSize={10}
              />
              <Bar
                dataKey={standardKey}
                fill={standardColor}
                name={`Standard - ${title}`}
                animationDuration={900}
                radius={[0, 4, 4, 0]}
                barSize={10}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return null;
}

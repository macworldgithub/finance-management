"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import EffectivenessSpeedometerChart from "./EffectivenessSpeedometerChart";
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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type AssessmentItem = {
  Id: string;
  No: string | number;
  Process: string;
  Date: string;
  DesignAdequacyScore: number;
  SustainabilityScore: number;
  ScalabilityScore: number;
  AdequacyScore: number;
  TotalScore: string;
  Scale: number;
  Rating: string;
};

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f7f",
  "#a4de6c",
  "#d0ed57",
  "#8dd1e1",
  "#83a6ed",
  "#b794f6",
  "#f6ad55",
  "#fc8181",
  "#63b3ed",
  "#68d391",
  "#f687b3",
  "#ed8936",
  "#9f7aea",
];

const pieLabel = (entry: any) =>
  `${entry?.name ?? "Unknown"} (${entry?.value ?? 0})`;

const donutLabel = (props: any) => {
  const name = props?.name;
  const percent = props?.percent;
  return `${(name ?? "Unknown").toString().split(" - ")[0]} (${(
    (percent ?? 0) * 100
  ).toFixed(0)}%)`;
};

export default function AdequacyReport() {
  const [data, setData] = useState<AssessmentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const avgScale = useMemo(() => {
    const scales = data
      .map((d) => Number(d.Scale))
      .filter((n) => Number.isFinite(n));
    if (!scales.length) return 1;
    return scales.reduce((a, b) => a + b, 0) / scales.length;
  }, [data]);

  const API_URL =
    "https://financedotnet.omnisuiteai.com/api/AssessmentOfAdequacy?page=1&pageSize=100";

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API_URL, {
          headers: { accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const items: AssessmentItem[] = Array.isArray(json.items)
          ? json.items
          : Array.isArray(json)
          ? json
          : [];
        if (mounted) setData(items);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Failed to fetch data");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  // Pre-process: change second occurrence of "5.1" to "5.10"
  const processedData = useMemo(() => {
    const result: AssessmentItem[] = [];
    let seen51Count = 0;
    for (const item of data) {
      const newItem = { ...item };
      if (String(item.No).trim() === "5.1") {
        seen51Count++;
        if (seen51Count === 2) {
          newItem.No = "5.10";
        }
      }
      result.push(newItem);
    }
    return result;
  }, [data]);

  // Natural sort on processed No
  const naturalSortKey = (item: AssessmentItem): [number, number] => {
    const noStr = String(item.No ?? "0");
    const parts = noStr.split(".");
    let major = 0;
    let minor = 0;
    try {
      major = parseInt(parts[0], 10) || 0;
      minor = parts[1] ? parseInt(parts[1], 10) || 0 : 0;
    } catch {}
    return [major, minor];
  };

  const sortedData = useMemo(() => {
    return [...processedData].sort((a, b) => {
      const [aMajor, aMinor] = naturalSortKey(a);
      const [bMajor, bMinor] = naturalSortKey(b);
      if (aMajor !== bMajor) return aMajor - bMajor;
      return aMinor - bMinor;
    });
  }, [processedData]);

  // Display uses (already modified) No directly
  const displayNo = (no: string | number) => String(no);

  const truncateLabel = (label: string) =>
    label.length > 15 ? `${label.slice(0, 15)}…` : label;

  const chartData = useMemo(() => {
    return sortedData
      .filter(Boolean)
      .map((d) => ({
        id: d.No ?? 0,
        short: displayNo(d.No),
        processLabel: truncateLabel(d.Process || "(unnamed)"),
        fullProcess: `${displayNo(d.No)} - ${d.Process || "(unnamed)"}`,
        Design: Number(d.DesignAdequacyScore ?? 0),
        Sustainability: Number(d.SustainabilityScore ?? 0),
        Scalability: Number(d.ScalabilityScore ?? 0),
        Adequacy: Number(d.AdequacyScore ?? 0),
        StdDesign: 10,
        StdSustainability: 10,
        StdScalability: 5,
        StdAdequacy: 25,
        fullScore: 10,
        Rating: d.Rating || "-",
      }))
      .slice(0, 50);
  }, [sortedData]);

  const ratingDistribution = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of sortedData) map.set(d.Rating, (map.get(d.Rating) || 0) + 1);
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [sortedData]);

  const designShare = useMemo(() => {
    const total = sortedData.reduce(
      (s, d) => s + (Number(d.DesignAdequacyScore) || 0),
      0
    );
    if (total === 0) return [];
    return sortedData.map((d) => ({
      name: `${displayNo(d.No)} - ${d.Process || "(unnamed)"}`,
      value: Number(d.DesignAdequacyScore || 0),
    }));
  }, [sortedData]);

  const columns: ColumnsType<AssessmentItem> = [
    {
      title: "No",
      dataIndex: "No",
      key: "No",
      width: 80,
      align: "center" as const,
      render: (_v: any, row) => displayNo(row.No),
    },
    {
      title: "Process",
      dataIndex: "Process",
      key: "Process",
      width: 260,
      ellipsis: true,
    },
    {
      title: "Design Adequacy Score",
      children: [
        {
          title: "Actual",
          dataIndex: "DesignAdequacyScore",
          key: "DesignAdequacyScore",
          width: 90,
          align: "center" as const,
          render: (value: number) => value || 0,
        },
        {
          title: "Standard",
          key: "StandardDesignAdequacy",
          width: 90,
          align: "center" as const,
          render: () => "10",
        },
      ],
    },
    {
      title: "Sustainability Score",
      children: [
        {
          title: "Actual",
          dataIndex: "SustainabilityScore",
          key: "SustainabilityScore",
          width: 90,
          align: "center" as const,
          render: (value: number) => value || 0,
        },
        {
          title: "Standard",
          key: "StandardSustainability",
          width: 90,
          align: "center" as const,
          render: () => "10",
        },
      ],
    },
    {
      title: "Scalability Score",
      children: [
        {
          title: "Actual",
          dataIndex: "ScalabilityScore",
          key: "ScalabilityScore",
          width: 90,
          align: "center" as const,
          render: (value: number) => value || 0,
        },
        {
          title: "Standard",
          key: "StandardScalability",
          width: 90,
          align: "center" as const,
          render: () => "5",
        },
      ],
    },
    {
      title: "Adequacy Score",
      children: [
        {
          title: "Actual",
          dataIndex: "AdequacyScore",
          key: "AdequacyScore",
          width: 90,
          align: "center" as const,
          render: (value: number) => value || 0,
        },
        {
          title: "Standard",
          key: "StandardAdequacy",
          width: 90,
          align: "center" as const,
          render: () => "25",
        },
      ],
    },
    {
      title: "Rating",
      dataIndex: "Rating",
      key: "Rating",
      width: 120,
      align: "center" as const,
      render: (rating: string) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            rating === "Excellent"
              ? "bg-green-100 text-green-800"
              : rating === "Good"
              ? "bg-blue-100 text-blue-800"
              : rating === "Average"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {rating || "-"}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "Date",
      key: "Date",
      width: 140,
      align: "center" as const,
      render: (value: string) => value || "-",
    },
  ];

  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-xl shadow-sm">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 flex-1 flex flex-col">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="xl:col-span-12 col-span-1 bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
            Assessment of Adequacy
          </h2>
          <div className="h-[500px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 8, right: 12, left: 40, bottom: 28 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="processLabel"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={90}
                  tick={{ fontSize: 11 }}
                  stroke="#6b7280"
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11 }}
                  stroke="#6b7280"
                  domain={[0, 30]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={72}
                  wrapperStyle={{ fontSize: "11px" }}
                />

                {/* Actual Scores - Solid Lines */}
                <Line
                  type="monotone"
                  dataKey="Design"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Actual - Design Adequacy Score"
                  animationDuration={900}
                />
                <Line
                  type="monotone"
                  dataKey="Sustainability"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Actual - Sustainability Score"
                  animationDuration={900}
                />
                <Line
                  type="monotone"
                  dataKey="Scalability"
                  stroke="#9ca3af"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Actual - Scalability Score"
                  animationDuration={900}
                />
                <Line
                  type="monotone"
                  dataKey="Adequacy"
                  stroke="#eab308"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Actual - Adequacy Score"
                  animationDuration={900}
                />

                {/* Standard Scores - Dashed Lines (flat at max) */}
                <Line
                  type="monotone"
                  dataKey="StdDesign"
                  stroke="#93c5fd"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Standard - Design Adequacy Score(0-10)"
                  animationDuration={900}
                />
                <Line
                  type="monotone"
                  dataKey="StdSustainability"
                  stroke="#22c55e"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Standard - Sustainability Score(0-10)"
                  animationDuration={900}
                />
                <Line
                  type="monotone"
                  dataKey="StdScalability"
                  stroke="#1e40af"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Standard - Scalability Score(0-5)"
                  animationDuration={900}
                />
                <Line
                  type="monotone"
                  dataKey="StdAdequacy"
                  stroke="#92400e"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Standard - Adequacy Score(0-25)"
                  animationDuration={900}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm sm:text-base font-semibold mb-3 text-gray-800">
              Assessment of Adequacy
            </h3>
            <div className="h-[500px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 8, right: 12, left: 40, bottom: 28 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="processLabel"
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={90}
                    tick={{ fontSize: 11 }}
                    stroke="#6b7280"
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11 }}
                    stroke="#6b7280"
                    domain={[0, 30]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={72}
                    wrapperStyle={{ fontSize: "11px" }}
                  />

                  <Bar
                    dataKey="Design"
                    fill="#2563eb"
                    name="Actual - Design Adequacy Score"
                    barSize={chartData.length > 12 ? 10 : 14}
                    animationDuration={900}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Sustainability"
                    fill="#f97316"
                    name="Actual - Sustainability Score"
                    barSize={chartData.length > 12 ? 10 : 14}
                    animationDuration={900}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Scalability"
                    fill="#9ca3af"
                    name="Actual - Scalability Score"
                    barSize={chartData.length > 12 ? 10 : 14}
                    animationDuration={900}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Adequacy"
                    fill="#eab308"
                    name="Actual - Adequacy Score"
                    barSize={chartData.length > 12 ? 10 : 14}
                    animationDuration={900}
                    radius={[4, 4, 0, 0]}
                  />

                  <Bar
                    dataKey="StdDesign"
                    fill="#93c5fd"
                    name="Standard - Design Adequacy Score(0-10)"
                    barSize={chartData.length > 12 ? 10 : 14}
                    animationDuration={900}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="StdSustainability"
                    fill="#22c55e"
                    name="Standard - Sustainability Score(0-10)"
                    barSize={chartData.length > 12 ? 10 : 14}
                    animationDuration={900}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="StdScalability"
                    fill="#1e40af"
                    name="Standard - Scalability Score(0-5)"
                    barSize={chartData.length > 12 ? 10 : 14}
                    animationDuration={900}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="StdAdequacy"
                    fill="#92400e"
                    name="Standard - Adequacy Score(0-25)"
                    barSize={chartData.length > 12 ? 10 : 14}
                    animationDuration={900}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="xl:col-span-12 col-span-1 bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col gap-6"
      >
        <div>
          <h2 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">
            Assessment of Adequacy
          </h2>
          <div className="h-[500px] w-full">
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
                  tick={{ fontSize: 11 }}
                  stroke="#6b7280"
                  domain={[0, 30]}
                />
                <YAxis
                  dataKey="processLabel"
                  type="category"
                  width={120}
                  tick={{ fontSize: 10 }}
                  stroke="#6b7280"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={72}
                  wrapperStyle={{ fontSize: "11px" }}
                />

                {/* Actual Scores */}
                <Bar
                  dataKey="Design"
                  fill="#2563eb"
                  name="Actual - Design Adequacy Score"
                  animationDuration={900}
                  radius={[0, 4, 4, 0]}
                  barSize={10}
                />
                <Bar
                  dataKey="Sustainability"
                  fill="#f97316"
                  name="Actual - Sustainability Score"
                  animationDuration={900}
                  radius={[0, 4, 4, 0]}
                  barSize={10}
                />
                <Bar
                  dataKey="Scalability"
                  fill="#9ca3af"
                  name="Actual - Scalability Score"
                  animationDuration={900}
                  radius={[0, 4, 4, 0]}
                  barSize={10}
                />
                <Bar
                  dataKey="Adequacy"
                  fill="#eab308"
                  name="Actual - Adequacy Score"
                  animationDuration={900}
                  radius={[0, 4, 4, 0]}
                  barSize={10}
                />

                {/* Standard Scores (flat at max) */}
                <Bar
                  dataKey="StdDesign"
                  fill="#93c5fd"
                  name="Standard - Design Adequacy Score(0-10)"
                  animationDuration={900}
                  radius={[0, 4, 4, 0]}
                  barSize={10}
                />
                <Bar
                  dataKey="StdSustainability"
                  fill="#22c55e"
                  name="Standard - Sustainability Score(0-10)"
                  animationDuration={900}
                  radius={[0, 4, 4, 0]}
                  barSize={10}
                />
                <Bar
                  dataKey="StdScalability"
                  fill="#1e40af"
                  name="Standard - Scalability Score(0-5)"
                  animationDuration={900}
                  radius={[0, 4, 4, 0]}
                  barSize={10}
                />
                <Bar
                  dataKey="StdAdequacy"
                  fill="#92400e"
                  name="Standard - Adequacy Score(0-25)"
                  animationDuration={900}
                  radius={[0, 4, 4, 0]}
                  barSize={10}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="pt-6 border-t border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">
            Assessment of Adequacy
          </h2>
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis
                  dataKey="fullProcess"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 30]}
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                />

                {/* Actual Scores */}
                <Radar
                  name="Actual - Design Adequacy Score"
                  dataKey="Design"
                  stroke="#2563eb"
                  fill="transparent"
                  animationDuration={900}
                  strokeWidth={2}
                />
                <Radar
                  name="Actual - Sustainability Score"
                  dataKey="Sustainability"
                  stroke="#f97316"
                  fill="transparent"
                  animationDuration={900}
                  strokeWidth={2}
                />
                <Radar
                  name="Actual - Scalability Score"
                  dataKey="Scalability"
                  stroke="#9ca3af"
                  fill="transparent"
                  animationDuration={900}
                  strokeWidth={2}
                />
                <Radar
                  name="Actual - Adequacy Score"
                  dataKey="Adequacy"
                  stroke="#eab308"
                  fill="transparent"
                  animationDuration={900}
                  strokeWidth={2}
                />

                {/* Standard Scores (flat at max) */}
                <Radar
                  name="Standard - Design Adequacy Score(0-10)"
                  dataKey="StdDesign"
                  stroke="#93c5fd"
                  fill="transparent"
                  animationDuration={900}
                  strokeWidth={2}
                />
                <Radar
                  name="Standard - Sustainability Score(0-10)"
                  dataKey="StdSustainability"
                  stroke="#22c55e"
                  fill="transparent"
                  animationDuration={900}
                  strokeWidth={2}
                />
                <Radar
                  name="Standard - Scalability Score(0-5)"
                  dataKey="StdScalability"
                  stroke="#1e40af"
                  fill="transparent"
                  animationDuration={900}
                  strokeWidth={2}
                />
                <Radar
                  name="Standard - Adequacy Score(0-25)"
                  dataKey="StdAdequacy"
                  stroke="#92400e"
                  fill="transparent"
                  animationDuration={900}
                  strokeWidth={2}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={72}
                  wrapperStyle={{ fontSize: "11px" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      <EffectivenessSpeedometerChart
        title="Assessment of Adequacy - Speedometer Chart"
        value={avgScale}
        min={1}
        max={5}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45 }}
        className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex-1 flex flex-col"
      >
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
            Data Table
          </h3>
          <div className="overflow-auto">
            <Table
              columns={columns}
              dataSource={sortedData}
              rowKey="Id"
              pagination={{
                pageSize: 12,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
              scroll={{ x: 1600 }}
              size="small"
              bordered
              className="shadow-sm"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

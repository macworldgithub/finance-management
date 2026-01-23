"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import ReusableChart from "./ReusableChart";

type OwnershipScoringItem = {
  Id: string;
  No: number;
  Activity: string;
  ActivityScore: number;
  Process: string;
  ProcessScore: number;
  ProcessStage: string;
  ProcessStageScore: number;
  TotalScore: string;
  Scale: number;
  Rating: string;
  Function: string;
  FunctionScore: number;
  ClientSegmentAndOrFunctionalSegment: string;
  ClientSegmentScore: number;
  OperationalUnit: string;
  OperationalUnitScore: number;
  Division: string;
  DivisionScore: number;
  Entity: string;
  EntityScore: number;
  UnitOrDepartment: string;
  UnitOrDepartmentScore: number;
  ProductClass: string;
  ProductClassScore: number;
  ProductName: string;
  ProductNameScore: number;
};

// Score configurations - using same colors as Process Severity chart
const SCORE_CONFIGS = [
  {
    key: "ActivityScore",
    label: "Activity Score(0-25)",
    standard: 25,
    color: "#2563eb", // Same as Process Severity Scale
    standardColor: "#93c5fd",
  },
  {
    key: "ProcessScore",
    label: "Process Score(0-25)",
    standard: 25,
    color: "#f97316", // Same as Process Severity Levels
    standardColor: "#fed7aa",
  },
  {
    key: "FunctionScore",
    label: "Function Score(0-25)",
    standard: 25,
    color: "#2563eb", // Same as Process Severity Scale
    standardColor: "#93c5fd",
  },
  {
    key: "ClientSegmentScore",
    label: "Client Segment Score(0-25)",
    standard: 25,
    color: "#f97316", // Same as Process Severity Levels
    standardColor: "#fed7aa",
  },
  {
    key: "OperationalUnitScore",
    label: "Operational Unit Score(0-25)",
    standard: 25,
    color: "#2563eb", // Same as Process Severity Scale
    standardColor: "#93c5fd",
  },
  {
    key: "DivisionScore",
    label: "Division Score(0-25)",
    standard: 25,
    color: "#f97316", // Same as Process Severity Levels
    standardColor: "#fed7aa",
  },
  {
    key: "EntityScore",
    label: "Entity Score(0-25)",
    standard: 25,
    color: "#2563eb", // Same as Process Severity Scale
    standardColor: "#93c5fd",
  },
  {
    key: "UnitOrDepartmentScore",
    label: "Unit / Department Score(0-25)",
    standard: 25,
    color: "#f97316", // Same as Process Severity Levels
    standardColor: "#fed7aa",
  },
  {
    key: "ProductClassScore",
    label: "Product Class Score(0-25)",
    standard: 25,
    color: "#2563eb", // Same as Process Severity Scale
    standardColor: "#93c5fd",
  },
  {
    key: "ProductNameScore",
    label: "Product Name Score(0-25)",
    standard: 25,
    color: "#f97316", // Same as Process Severity Levels
    standardColor: "#fed7aa",
  },
];

export default function OwnershipScoringReport() {
  const [data, setData] = useState<OwnershipScoringItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const API_URL = `https://financedotnet.omnisuiteai.com/api/OwnershipScorings?page=${currentPage}&pageSize=${pageSize}&search=&sortByNoAsc=true`;

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
        const items: OwnershipScoringItem[] = Array.isArray(json.items)
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
  }, [API_URL]);

  // Natural sort on No
  const naturalSortKey = (item: OwnershipScoringItem): [number, number] => {
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
    return [...data].sort((a, b) => {
      const [aMajor, aMinor] = naturalSortKey(a);
      const [bMajor, bMinor] = naturalSortKey(b);
      if (aMajor !== bMajor) return aMajor - bMajor;
      return aMinor - bMinor;
    });
  }, [data]);

  const displayNo = (no: number) => String(no);

  const truncateLabel = (label: string) =>
    label.length > 15 ? `${label.slice(0, 15)}…` : label;

  // Prepare chart data for each score type
  const chartData = useMemo(() => {
    return sortedData
      .filter(Boolean)
      .map((d) => ({
        id: d.No ?? 0,
        short: displayNo(d.No),
        processLabel: truncateLabel(d.Process || "(unnamed)"),
        fullProcess: `${displayNo(d.No)} - ${d.Process || "(unnamed)"}`,
      }))
      .slice(0, 50);
  }, [sortedData]);

  // Prepare score data for each configuration
  const getScoreData = (config: (typeof SCORE_CONFIGS)[0]) => {
    return chartData.map((item, index) => {
      const originalData = sortedData[index];
      return {
        ...item,
        score: Number(
          originalData?.[config.key as keyof OwnershipScoringItem] || 0,
        ),
        standard: config.standard,
      };
    });
  };

  // Table columns - only show No, Process, and score columns
  const columns: ColumnsType<OwnershipScoringItem> = [
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
      width: 300,
      ellipsis: true,
    },
    ...SCORE_CONFIGS.map((config) => ({
      title: config.label,
      dataIndex: config.key,
      key: config.key,
      width: 140,
      align: "center" as const,
      render: (value: number) => value || 0,
    })),
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
      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 flex-shrink-0">
        {SCORE_CONFIGS.map((config, index) => (
          <motion.div
            key={config.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.1 }}
            className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="space-y-6">
              {/* Line Chart */}
              <ReusableChart
                title={config.label}
                data={getScoreData(config)}
                scoreKey="score"
                standardKey="standard"
                scoreColor={config.color}
                standardColor={config.standardColor}
                chartType="line"
              />

              {/* Bar Chart */}
              <div className="pt-6 border-t border-gray-200">
                <ReusableChart
                  title={config.label}
                  data={getScoreData(config)}
                  scoreKey="score"
                  standardKey="standard"
                  scoreColor={config.color}
                  standardColor={config.standardColor}
                  chartType="bar"
                />
              </div>

              {/* Horizontal Bar Chart */}
              <div className="pt-6 border-t border-gray-200">
                <ReusableChart
                  title={config.label}
                  data={getScoreData(config)}
                  scoreKey="score"
                  standardKey="standard"
                  scoreColor={config.color}
                  standardColor={config.standardColor}
                  chartType="horizontal"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Data Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45 }}
        className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex-1 flex flex-col"
      >
        <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
          Ownership Scoring Data Table
        </h3>
        <div className="overflow-auto flex-1">
          <Table
            columns={columns}
            dataSource={sortedData}
            rowKey="Id"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size || 100);
              },
            }}
            scroll={{ x: 1400 }}
            size="small"
            bordered
            className="shadow-sm"
          />
        </div>
      </motion.div>
    </div>
  );
}

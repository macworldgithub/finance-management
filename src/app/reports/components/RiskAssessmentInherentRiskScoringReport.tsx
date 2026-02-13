"use client";

import { useEffect, useMemo, useState } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

type RiskAssessmentItem = {
  Id: string;
  Date: string;
  No: number;
  Process: string;
  RiskId: string;
  RiskType: string;
  RiskDescription: string;
  SeverityImpact: string;
  ProbabilityLikelihood: string;
  Classification: string;
  RiskIdSeverityImpact: number; // Y axis
  RiskIdProbabilityLikelihood: number; // X axis
  RiskIdClassification: number;
};

const probabilityLabels = ["Lowest", "Low", "Moderate", "High", "Very High"];
const severityLabels = [
  "Insignificant",
  "Minor",
  "Moderate",
  "Major",
  "Catastrophic",
];

type HeatCell = {
  x: number; // probability
  y: number; // severity
  count: number;
  risks: RiskAssessmentItem[];
  left: number;
  top: number;
};

const getCellPosition = (x: number, y: number) => {
  const cellWidth = 100 / 5;
  const cellHeight = 100 / 5;

  const left = (x - 1) * cellWidth + cellWidth / 2;
  const top = 100 - ((y - 1) * cellHeight + cellHeight / 2);

  return { left, top };
};

export default function RiskAssessmentHeatMapReport() {
  const [data, setData] = useState<RiskAssessmentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Tooltip state
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    cell: HeatCell | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    cell: null,
  });

  const API_URL = `https://financedotnet.omnisuiteai.com/api/RiskAssessmentInherentRiskScorings?page=${currentPage}&pageSize=${pageSize}&search=&sortByNoAsc=true`;

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
        const items: RiskAssessmentItem[] = Array.isArray(json.items)
          ? json.items
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

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => (a.No ?? 0) - (b.No ?? 0));
  }, [data]);

  // Group risks by (probability, severity)
  const groupedCells: HeatCell[] = useMemo(() => {
    const map = new Map<string, RiskAssessmentItem[]>();

    sortedData.forEach((risk) => {
      const x = risk.RiskIdProbabilityLikelihood || 1;
      const y = risk.RiskIdSeverityImpact || 1;

      const key = `${x}-${y}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(risk);
    });

    const cells: HeatCell[] = [];

    map.forEach((risks, key) => {
      const [xStr, yStr] = key.split("-");
      const x = Number(xStr);
      const y = Number(yStr);

      const pos = getCellPosition(x, y);

      cells.push({
        x,
        y,
        risks,
        count: risks.length,
        left: pos.left,
        top: pos.top,
      });
    });

    return cells;
  }, [sortedData]);

  const columns: ColumnsType<RiskAssessmentItem> = [
    {
      title: "No",
      dataIndex: "No",
      key: "No",
      width: 70,
      align: "center",
    },
    {
      title: "Process",
      dataIndex: "Process",
      key: "Process",
      width: 140,
      ellipsis: true,
    },
    {
      title: "Risk ID",
      dataIndex: "RiskId",
      key: "RiskId",
      width: 100,
      align: "center",
      render: (v) => <span className="font-semibold text-gray-800">{v}</span>,
    },
    {
      title: "Risk Type",
      dataIndex: "RiskType",
      key: "RiskType",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Risk Description",
      dataIndex: "RiskDescription",
      key: "RiskDescription",
      width: 260,
      ellipsis: true,
    },
    {
      title: "Severity",
      dataIndex: "RiskIdSeverityImpact",
      key: "RiskIdSeverityImpact",
      width: 110,
      align: "center",
    },
    {
      title: "Probability",
      dataIndex: "RiskIdProbabilityLikelihood",
      key: "RiskIdProbabilityLikelihood",
      width: 120,
      align: "center",
    },
    {
      title: "Classification",
      dataIndex: "RiskIdClassification",
      key: "RiskIdClassification",
      width: 130,
      align: "center",
    },
  ];

  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-xl shadow-sm">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">Loading Risk Heatmap...</p>
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
    <div className="space-y-6 flex flex-col">
      {/* Heatmap Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Risk Heatmap Matrix
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Severity (Y-axis) vs Probability (X-axis) with grouped risk counts
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
            Bubble = Risk Count
          </div>
        </div>

        <div className="p-4 sm:p-6 relative">
          <div className="grid grid-cols-[160px_1fr] gap-4">
            {/* Left Severity Labels */}
            <div className="flex flex-col justify-between h-[420px]">
              {severityLabels
                .slice()
                .reverse()
                .map((label, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center text-sm font-semibold text-gray-700 h-[20%] border border-gray-200 bg-gray-50 rounded-md"
                  >
                    {5 - index} - {label}
                  </div>
                ))}
            </div>

            {/* Heatmap */}
            <div
              className="relative w-full h-[420px] border border-gray-300 rounded-xl overflow-hidden shadow-inner"
              onMouseLeave={() =>
                setTooltip({ visible: false, x: 0, y: 0, cell: null })
              }
            >
              {/* Gradient Background */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top right, #16a34a 0%, #facc15 50%, #dc2626 100%)",
                }}
              />

              {/* Grid Lines */}
              <div className="absolute inset-0 grid grid-cols-5 grid-rows-5">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className="border border-white/40" />
                ))}
              </div>

              {/* Grouped bubbles */}
              {groupedCells.map((cell) => {
                const bubbleSize = Math.min(56, 10 + cell.count * 6);

                return (
                  <div
                    key={`${cell.x}-${cell.y}`}
                    className="absolute flex items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-xl border-2 border-white hover:scale-110 transition-transform cursor-pointer"
                    style={{
                      left: `${cell.left}%`,
                      top: `${cell.top}%`,
                      transform: "translate(-50%, -50%)",
                      width: `${bubbleSize}px`,
                      height: `${bubbleSize}px`,
                      fontSize: cell.count >= 10 ? "12px" : "8px",
                    }}
                    onMouseEnter={(e) => {
                      setTooltip({
                        visible: true,
                        x: e.clientX + 15,
                        y: e.clientY + 15,
                        cell,
                      });
                    }}
                    onMouseMove={(e) => {
                      setTooltip((prev) => ({
                        ...prev,
                        x: e.clientX + 15,
                        y: e.clientY + 15,
                      }));
                    }}
                  >
                    {cell.count}
                  </div>
                );
              })}

              {/* Tooltip */}
              {tooltip.visible && tooltip.cell && (
                <div
                  className="fixed z-[999] bg-white rounded-xl shadow-2xl border border-gray-200 w-[320px] p-4"
                  style={{
                    left: tooltip.x,
                    top: tooltip.y,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900">
                      Cell ({tooltip.cell.x}, {tooltip.cell.y})
                    </h3>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {tooltip.cell.count} risks
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    Probability: {tooltip.cell.x} (
                    {probabilityLabels[tooltip.cell.x - 1]})
                    <br />
                    Severity: {tooltip.cell.y} (
                    {severityLabels[tooltip.cell.y - 1]})
                  </p>

                  <div className="mt-3 max-h-[180px] overflow-auto space-y-2 pr-1">
                    {tooltip.cell.risks.map((r) => (
                      <div
                        key={r.Id}
                        className="p-2 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <p className="text-sm font-semibold text-gray-800">
                          {r.RiskId}{" "}
                          <span className="text-xs font-normal text-gray-500">
                            ({r.Process})
                          </span>
                        </p>

                        <p className="text-xs text-gray-600">{r.RiskType}</p>

                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {r.RiskDescription}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Axis Labels */}
              <div className="absolute left-3 top-3 bg-black/40 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                Severity ↑
              </div>
              <div className="absolute right-3 bottom-3 bg-black/40 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                Probability →
              </div>
            </div>
          </div>

          {/* Bottom Probability Labels */}
          <div className="grid grid-cols-[160px_1fr] gap-4 mt-4">
            <div></div>

            <div className="grid grid-cols-5 gap-2">
              {probabilityLabels.map((label, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg bg-gray-50 text-center py-2 text-sm font-semibold text-gray-700"
                >
                  {idx + 1} - {label}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 text-xs sm:text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-sm bg-green-600 border border-gray-200" />
              Low Risk
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-sm bg-yellow-400 border border-gray-200" />
              Moderate Risk
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-sm bg-red-600 border border-gray-200" />
              Critical Risk
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-600 border border-white shadow-md" />
              Bubble size = risk count
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-5 sm:p-6 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Risk Scoring Data Table
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Detailed risk scoring information retrieved from the API
          </p>
        </div>

        <div className="p-4 sm:p-6">
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
                setPageSize(size || 50);
              },
            }}
            scroll={{ x: 1200 }}
            size="middle"
            bordered
          />
        </div>
      </div>
    </div>
  );
}

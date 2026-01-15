"use client";
import { useEffect, useState } from "react";
import { Tabs } from "antd";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/layout/Navbar";
import AdequacyReport from "./components/AdequacyReport";
import EffectivenessReport from "./components/EffectivenessReport";
import EfficiencyReport from "./components/EfficiencyReport";
import SeverityReport from "./components/SeverityReport";

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

export default function ReportsPage() {
  const [adequacyData, setAdequacyData] = useState<AssessmentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("1");

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
        if (mounted) setAdequacyData(items);
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

  const tabItems = [
    {
      key: "1",
      label: "Assessment of Adequacy",
      children: (
        <AdequacyReport data={adequacyData} loading={loading} error={error} />
      ),
    },
    {
      key: "2",
      label: "Assessment of Effectiveness",
      children: <EffectivenessReport />,
    },
    {
      key: "3",
      label: "Assessment of Efficiency",
      children: <EfficiencyReport />,
    },
    {
      key: "4",
      label: "Process Severity",
      children: <SeverityReport />,
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        <Navbar onExcelUploadClick={() => {}} />
        <main className="max-w-[1600px] mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
              Process Management Reports
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => location.reload()}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200"
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md flex-1 flex flex-col">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              className="h-full flex flex-col"
              items={tabItems}
              tabBarStyle={{
                marginBottom: 0,
                padding: "0 1.5rem",
                backgroundColor: "#f9fafb",
                borderRadius: "0.75rem 0.75rem 0 0",
                border: "1px solid #e5e7eb",
                borderBottom: "none",
              }}
            />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

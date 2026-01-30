"use client";
import { useState } from "react";
import { Tabs } from "antd";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/layout/Navbar";
import OwnershipScoringReport from "../reports/components/OwnershipScoringReport";

export default function OwnershipReportsPage() {
  const [activeTab, setActiveTab] = useState("1");

  const tabItems = [
    {
      key: "1",
      label: "Ownership Scoring",
      children: <OwnershipScoringReport />,
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        <Navbar onExcelUploadClick={() => {}} />
        <main className="max-w-[1600px] mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
              Ownership Management Reports
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

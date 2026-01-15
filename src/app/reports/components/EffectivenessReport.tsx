"use client";
import { useEffect, useState } from "react";
import { Spin, Alert } from "antd";
import EffectivenessChart from "./EffectivenessChart";
import EffectivenessHorizontalChart from "./EffectivenessHorizontalChart";
import EffectivenessRadarChart from "./EffectivenessRadarChart";
import EffectivenessTable from "./EffectivenessTable";

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

export default function EffectivenessReport() {
  const [data, setData] = useState<EffectivenessItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL =
    "https://financedotnet.omnisuiteai.com/api/AssessmentOfEffectiveness?page=1&pageSize=100";

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
        const items: EffectivenessItem[] = Array.isArray(json.items)
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

  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-xl shadow-sm">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">Loading Effectiveness data...</p>
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
    <div className="space-y-6">
      <EffectivenessChart data={data} />
      <EffectivenessHorizontalChart data={data} />
      <EffectivenessRadarChart data={data} />
      <EffectivenessTable data={data} />
    </div>
  );
}

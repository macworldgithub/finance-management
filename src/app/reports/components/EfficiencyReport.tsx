"use client";
import { useEffect, useMemo, useState } from "react";
import EfficiencyChart from "./EfficiencyChart";
import EfficiencyHorizontalChart from "./EfficiencyHorizontalChart";
import EfficiencyRadarChart from "./EfficiencyRadarChart";
import EfficiencyLineChart from "./EfficiencyLineChart";
import EfficiencyTable from "./EfficiencyTable";
import EffectivenessSpeedometerChart from "./EffectivenessSpeedometerChart";

type EfficiencyItem = {
  Id: string;
  No: string | number;
  Process: string;
  Date: string;
  ObjectiveAchievementScore: number;
  TimelinessThroughputScore: number;
  ResourceConsumptionScore: number;
  EfficiencyScore: number;
  TotalScore: string;
  Scale: number;
  Rating: string;
};

export default function EfficiencyReport() {
  const [data, setData] = useState<EfficiencyItem[]>([]);
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
    "https://financedotnet.omnisuiteai.com/api/AssessmentOfEfficiency?page=1&pageSize=100";

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
        const items: EfficiencyItem[] = Array.isArray(json.items)
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
        <p className="mt-4 text-gray-600">Loading Efficiency data...</p>
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
      <EfficiencyChart data={data} />
      <EfficiencyHorizontalChart data={data} />
      <EfficiencyRadarChart data={data} />
      <EffectivenessSpeedometerChart
        title="Assessment of Efficiency - Speedometer Chart"
        value={avgScale}
        min={1}
        max={5}
      />
      <EfficiencyLineChart data={data} />
      <EfficiencyTable data={data} />
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import ProcessSeverityChart from "./ProcessSeverityChart";
import ProcessSeverityRadarChart from "./ProcessSeverityRadarChart";
import ProcessSeverityDonutChart from "./ProcessSeverityDonutChart";
import ProcessSeverityTable from "./ProcessSeverityTable";

type ProcessSeverityItem = {
  Id: string;
  No: number | string;
  Process: string;
  Date: string;
  Scale: number;
  Rating: string;
};

const parseNoParts = (noValue: any) => {
  const str = String(noValue ?? "");
  const [majorStr, minorStr] = str.split(".");
  return {
    major: parseInt(majorStr, 10) || 0,
    minor: parseInt(minorStr ?? "0", 10) || 0,
  };
};

const getSortableNo = (noValue: any) => {
  const { major, minor } = parseNoParts(noValue);
  return major * 1000 + minor;
};

export default function SeverityReport() {
  const [data, setData] = useState<ProcessSeverityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL =
    "https://financedotnet.omnisuiteai.com/api/ProcessSeverity?page=1&pageSize=10000&search=&sortByNoAsc=true";

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
        const items: ProcessSeverityItem[] = Array.isArray(json.items)
          ? json.items
          : Array.isArray(json)
          ? json
          : [];
        const sorted = [...items].sort((a, b) => {
          const na = getSortableNo(a.No);
          const nb = getSortableNo(b.No);
          if (na !== nb) return na - nb;
          const pa = String(a.Process ?? "");
          const pb = String(b.Process ?? "");
          if (pa !== pb) return pa.localeCompare(pb);
          return String(a.Id ?? "").localeCompare(String(b.Id ?? ""));
        });
        if (mounted) setData(sorted);
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
        <p className="mt-4 text-gray-600">Loading Process Severity data...</p>
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
      <ProcessSeverityChart data={data} />
      <ProcessSeverityRadarChart data={data} />
      <ProcessSeverityDonutChart data={data} />
      <ProcessSeverityTable data={data} />
    </div>
  );
}

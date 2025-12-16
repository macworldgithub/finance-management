// "use client";
// import { useEffect, useMemo, useState } from "react";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import Navbar from "@/components/layout/Navbar";
// import { motion } from "framer-motion";
// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   BarChart,
//   Bar,
//   RadarChart,
//   Radar,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

// type AssessmentItem = {
//   Id: string;
//   No: number;
//   Process: string;
//   Date: string;
//   DesignAdequacyScore: number;
//   SustainabilityScore: number;
//   ScalabilityScore: number;
//   AdequacyScore: number;
//   TotalScore: string;
//   Scale: number;
//   Rating: string;
// };

// const COLORS = [
//   "#8884d8",
//   "#82ca9d",
//   "#ffc658",
//   "#ff7f7f",
//   "#a4de6c",
//   "#d0ed57",
//   "#8dd1e1",
//   "#83a6ed",
//   "#b794f6",
//   "#f6ad55",
//   "#fc8181",
//   "#63b3ed",
//   "#68d391",
//   "#f687b3",
//   "#ed8936",
//   "#9f7aea",
// ];

// // helper label functions
// const pieLabel = (entry: any) =>
//   `${entry?.name ?? "Unknown"} (${entry?.value ?? 0})`;
// const donutLabel = (props: any) => {
//   const name = props?.name;
//   const percent = props?.percent;
//   return `${(name ?? "Unknown").toString().split(" - ")[0]} (${(
//     (percent ?? 0) * 100
//   ).toFixed(0)}%)`;
// };

// export default function ReportsPage() {
//   const [data, setData] = useState<AssessmentItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const API_URL =
//     "https://financedotnet.omnisuiteai.com/api/AssessmentOfAdequacy?page=1&pageSize=100";

//   useEffect(() => {
//     let mounted = true;
//     async function fetchData() {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await fetch(API_URL, {
//           headers: { accept: "application/json" },
//         });
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const json = await res.json();
//         const items: AssessmentItem[] = Array.isArray(json.items)
//           ? json.items
//           : Array.isArray(json)
//           ? json
//           : [];
//         if (mounted) setData(items);
//       } catch (err: any) {
//         console.error(err);
//         setError(err?.message || "Failed to fetch data");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     }
//     fetchData();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   // Truncate function for labels (max 15 chars)
//   const truncateLabel = (label: string) =>
//     label.length > 15 ? `${label.slice(0, 15)}…` : label;

//   // chart data – now uses only Process (truncated) for bar/line charts
//   const chartData = useMemo(() => {
//     return data
//       .filter(Boolean)
//       .map((d) => ({
//         id: d.No ?? 0,
//         short: `${d.No ?? "#"}`, // still used for radar & line if needed
//         processLabel: truncateLabel(d.Process || "(unnamed)"), // <-- only Process, truncated
//         Design: Number(d.DesignAdequacyScore ?? 0),
//         Sustainability: Number(d.SustainabilityScore ?? 0),
//         Scalability: Number(d.ScalabilityScore ?? 0),
//         Adequacy: Number(d.AdequacyScore ?? 0),
//         Rating: d.Rating || "-",
//         fullScore: 10,
//       }))
//       .slice(0, 50);
//   }, [data]);

//   const ratingDistribution = useMemo(() => {
//     const map = new Map<string, number>();
//     for (const d of data) map.set(d.Rating, (map.get(d.Rating) || 0) + 1);
//     return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
//   }, [data]);

//   const designShare = useMemo(() => {
//     const total = data.reduce(
//       (s, d) => s + (Number(d.DesignAdequacyScore) || 0),
//       0
//     );
//     if (total === 0) return [];
//     return data.map((d) => ({
//       name: `${d.No} - ${d.Process || "(unnamed)"}`,
//       value: Number(d.DesignAdequacyScore || 0),
//     }));
//   }, [data]);

//   return (
//     <ProtectedRoute>
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
//         <Navbar onExcelUploadClick={() => {}} />
//         <main className="max-w-[1600px] mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 flex-1 flex flex-col">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
//             <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
//               Process Management Reports
//             </h1>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => location.reload()}
//                 className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200"
//               >
//                 Refresh
//               </button>
//             </div>
//           </div>

//           {loading ? (
//             <div className="p-12 text-center bg-white rounded-xl shadow-sm">
//               <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
//               <p className="mt-4 text-gray-600">Loading data...</p>
//             </div>
//           ) : error ? (
//             <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
//               Error: {error}
//             </div>
//           ) : (
//             <div className="space-y-4 sm:space-y-6 flex-1 flex flex-col">
//               <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 flex-shrink-0">
//                 {/* Line and Vertical Bar */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.45 }}
//                   className="xl:col-span-8 col-span-1 bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
//                 >
//                   <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
//                     Design Adequacy — Trend (Line)
//                   </h2>
//                   <div className="h-64 w-full flex-1">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <LineChart
//                         data={chartData}
//                         margin={{ top: 8, right: 12, left: -20, bottom: 8 }}
//                       >
//                         <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                         <XAxis
//                           dataKey="processLabel"
//                           interval={0}
//                           angle={-45}
//                           textAnchor="end"
//                           height={70}
//                           tick={{ fontSize: 11 }}
//                           stroke="#6b7280"
//                         />
//                         <YAxis
//                           allowDecimals={false}
//                           tick={{ fontSize: 11 }}
//                           stroke="#6b7280"
//                         />
//                         <Tooltip
//                           contentStyle={{
//                             backgroundColor: "#fff",
//                             border: "1px solid #e5e7eb",
//                             borderRadius: "8px",
//                           }}
//                         />
//                         <Legend wrapperStyle={{ fontSize: "13px" }} />
//                         <Line
//                           type="monotone"
//                           dataKey="Design"
//                           stroke={COLORS[0]}
//                           strokeWidth={2.5}
//                           dot={{ r: 3, strokeWidth: 2 }}
//                           activeDot={{ r: 5 }}
//                           animationDuration={900}
//                         />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   </div>

//                   {/* Vertical Bar Chart – uses only Process (truncated) */}
//                   <div className="mt-6 pt-6 border-t border-gray-200">
//                     <h3 className="text-sm sm:text-base font-semibold mb-3 text-gray-800">
//                       Design Adequacy — Vertical Bar
//                     </h3>
//                     <div className="h-56 w-full">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <BarChart
//                           data={chartData}
//                           margin={{ top: 8, right: 12, left: -20, bottom: 8 }}
//                         >
//                           <CartesianGrid
//                             strokeDasharray="3 3"
//                             stroke="#e5e7eb"
//                           />
//                           <XAxis
//                             dataKey="processLabel"
//                             interval={0}
//                             angle={-45}
//                             textAnchor="end"
//                             height={80}
//                             tick={{ fontSize: 11 }}
//                             stroke="#6b7280"
//                           />
//                           <YAxis
//                             allowDecimals={false}
//                             tick={{ fontSize: 11 }}
//                             stroke="#6b7280"
//                           />
//                           <Tooltip
//                             contentStyle={{
//                               backgroundColor: "#fff",
//                               border: "1px solid #e5e7eb",
//                               borderRadius: "8px",
//                             }}
//                           />
//                           <Legend wrapperStyle={{ fontSize: "13px" }} />
//                           <Bar
//                             dataKey="Design"
//                             fill="#fbbf24"
//                             name="Obtained Score"
//                             barSize={chartData.length > 12 ? 14 : 20}
//                             animationDuration={900}
//                             radius={[4, 4, 0, 0]}
//                           />
//                           <Bar
//                             dataKey="fullScore"
//                             fill="#a855f7"
//                             name="Full Score"
//                             barSize={chartData.length > 12 ? 14 : 20}
//                             animationDuration={900}
//                             radius={[4, 4, 0, 0]}
//                           />
//                         </BarChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </div>
//                 </motion.div>

//                 {/* Horizontal Bar + Radar */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.55 }}
//                   className="xl:col-span-4 col-span-1 bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col gap-6"
//                 >
//                   <div>
//                     <h2 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">
//                       Design Adequacy — Horizontal
//                     </h2>
//                     <div className="h-64 w-full">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <BarChart
//                           layout="vertical"
//                           data={chartData}
//                           margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
//                         >
//                           <CartesianGrid
//                             strokeDasharray="3 3"
//                             stroke="#e5e7eb"
//                           />
//                           <XAxis
//                             type="number"
//                             allowDecimals={false}
//                             tick={{ fontSize: 11 }}
//                             stroke="#6b7280"
//                           />
//                           <YAxis
//                             dataKey="processLabel"
//                             type="category"
//                             width={90}
//                             tick={{ fontSize: 10 }}
//                             stroke="#6b7280"
//                           />
//                           <Tooltip
//                             contentStyle={{
//                               backgroundColor: "#fff",
//                               border: "1px solid #e5e7eb",
//                               borderRadius: "8px",
//                             }}
//                           />
//                           <Legend wrapperStyle={{ fontSize: "13px" }} />
//                           <Bar
//                             dataKey="Design"
//                             fill="#fbbf24"
//                             name="Obtained Score"
//                             animationDuration={900}
//                             radius={[0, 4, 4, 0]}
//                             barSize={chartData.length > 12 ? 12 : 16}
//                           />
//                           <Bar
//                             dataKey="fullScore"
//                             fill="#a855f7"
//                             name="Full Score"
//                             animationDuration={900}
//                             radius={[0, 4, 4, 0]}
//                             barSize={chartData.length > 12 ? 12 : 16}
//                           />
//                         </BarChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </div>

//                   <div className="pt-6 border-t border-gray-200">
//                     <h2 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">
//                       Overall — Design Adequacy (Radar)
//                     </h2>
//                     <div className="h-64 w-full">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <RadarChart
//                           cx="50%"
//                           cy="50%"
//                           outerRadius="70%"
//                           data={chartData}
//                         >
//                           <PolarGrid stroke="#e5e7eb" />
//                           <PolarAngleAxis
//                             dataKey="short"
//                             tick={{ fontSize: 10, fill: "#6b7280" }}
//                           />
//                           <PolarRadiusAxis
//                             angle={30}
//                             domain={[
//                               0,
//                               Math.max(10, ...chartData.map((c) => c.Design)),
//                             ]}
//                             tick={{ fontSize: 10, fill: "#6b7280" }}
//                           />
//                           <Radar
//                             name="Design"
//                             dataKey="Design"
//                             stroke={COLORS[2]}
//                             fill={COLORS[2]}
//                             fillOpacity={0.4}
//                             animationDuration={900}
//                             strokeWidth={2}
//                           />
//                           <Tooltip
//                             contentStyle={{
//                               backgroundColor: "#fff",
//                               border: "1px solid #e5e7eb",
//                               borderRadius: "8px",
//                             }}
//                           />
//                         </RadarChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </div>
//                 </motion.div>
//               </div>

//               {/* Bottom section: Pie, Donut, Stats, Table */}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.45 }}
//                 className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex-1 flex flex-col"
//               >
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 flex-shrink-0">
//                   {/* Rating Pie Chart */}
//                   <div className="bg-gray-50 rounded-lg p-4">
//                     <h4 className="text-sm sm:text-base font-semibold mb-3 text-gray-800">
//                       Rating Distribution (Pie)
//                     </h4>
//                     <div className="h-56 w-full">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <PieChart>
//                           <Pie
//                             data={ratingDistribution}
//                             dataKey="value"
//                             nameKey="name"
//                             cx="50%"
//                             cy="50%"
//                             outerRadius="70%"
//                             label={pieLabel as any}
//                             animationDuration={900}
//                             labelLine={{ stroke: "#6b7280" }}
//                           >
//                             {ratingDistribution.map((_, idx) => (
//                               <Cell
//                                 key={idx}
//                                 fill={COLORS[idx % COLORS.length]}
//                               />
//                             ))}
//                           </Pie>
//                           <Tooltip
//                             contentStyle={{
//                               backgroundColor: "#fff",
//                               border: "1px solid #e5e7eb",
//                               borderRadius: "8px",
//                             }}
//                           />
//                         </PieChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </div>

//                   {/* Design Share Donut Chart */}
//                   <div className="bg-gray-50 rounded-lg p-4">
//                     <h4 className="text-sm sm:text-base font-semibold mb-3 text-gray-800">
//                       Design Share (Donut)
//                     </h4>
//                     <div className="h-56 w-full">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <PieChart>
//                           <Pie
//                             data={designShare}
//                             dataKey="value"
//                             nameKey="name"
//                             cx="50%"
//                             cy="50%"
//                             innerRadius="40%"
//                             outerRadius="70%"
//                             label={donutLabel as any}
//                             animationDuration={900}
//                             labelLine={{ stroke: "#6b7280" }}
//                           >
//                             {designShare.map((_, idx) => (
//                               <Cell
//                                 key={idx}
//                                 fill={COLORS[idx % COLORS.length]}
//                               />
//                             ))}
//                           </Pie>
//                           <Tooltip
//                             contentStyle={{
//                               backgroundColor: "#fff",
//                               border: "1px solid #e5e7eb",
//                               borderRadius: "8px",
//                             }}
//                           />
//                         </PieChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </div>

//                   {/* Quick Stats */}
//                   <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-5">
//                     <h4 className="text-sm sm:text-base font-semibold mb-4 text-gray-800">
//                       Quick Stats
//                     </h4>
//                     <div className="space-y-3">
//                       <div className="flex justify-between items-center p-2 bg-white rounded-lg">
//                         <span className="text-xs sm:text-sm text-gray-600 font-medium">
//                           Total Processes
//                         </span>
//                         <span className="text-sm sm:text-base font-bold text-blue-600">
//                           {data.length}
//                         </span>
//                       </div>
//                       <div className="flex justify-between items-center p-2 bg-white rounded-lg">
//                         <span className="text-xs sm:text-sm text-gray-600 font-medium">
//                           Avg Design
//                         </span>
//                         <span className="text-sm sm:text-base font-bold text-green-600">
//                           {data.length
//                             ? (
//                                 data.reduce(
//                                   (s, d) =>
//                                     s + Number(d.DesignAdequacyScore || 0),
//                                   0
//                                 ) / data.length
//                               ).toFixed(2)
//                             : "-"}
//                         </span>
//                       </div>
//                       <div className="flex justify-between items-center p-2 bg-white rounded-lg">
//                         <span className="text-xs sm:text-sm text-gray-600 font-medium">
//                           Avg Sustainability
//                         </span>
//                         <span className="text-sm sm:text-base font-bold text-teal-600">
//                           {data.length
//                             ? (
//                                 data.reduce(
//                                   (s, d) =>
//                                     s + Number(d.SustainabilityScore || 0),
//                                   0
//                                 ) / data.length
//                               ).toFixed(2)
//                             : "-"}
//                         </span>
//                       </div>
//                       <div className="flex justify-between items-center p-2 bg-white rounded-lg">
//                         <span className="text-xs sm:text-sm text-gray-600 font-medium">
//                           Avg Scalability
//                         </span>
//                         <span className="text-sm sm:text-base font-bold text-purple-600">
//                           {data.length
//                             ? (
//                                 data.reduce(
//                                   (s, d) => s + Number(d.ScalabilityScore || 0),
//                                   0
//                                 ) / data.length
//                               ).toFixed(2)
//                             : "-"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Data Table */}
//                 <div className="mt-6 pt-6 border-t border-gray-200">
//                   <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
//                     Data Table
//                   </h3>
//                   <div className="overflow-auto flex-1 -mx-4 sm:mx-0">
//                     <div className="inline-block min-w-full align-middle">
//                       <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
//                         <table className="min-w-full divide-y divide-gray-200">
//                           <thead className="bg-gray-50">
//                             <tr>
//                               <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
//                                 No
//                               </th>
//                               <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                                 Process
//                               </th>
//                               <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
//                                 Design
//                               </th>
//                               <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
//                                 Sustainability
//                               </th>
//                               <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
//                                 Scalability
//                               </th>
//                               <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
//                                 Adequacy
//                               </th>
//                               <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
//                                 Rating
//                               </th>
//                               <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
//                                 Date
//                               </th>
//                             </tr>
//                           </thead>
//                           <tbody className="bg-white divide-y divide-gray-200">
//                             {data.map((row) => (
//                               <tr
//                                 key={row.Id}
//                                 className="hover:bg-gray-50 transition-colors duration-150"
//                               >
//                                 <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
//                                   {row.No}
//                                 </td>
//                                 <td className="px-3 py-3 text-sm text-gray-900">
//                                   {row.Process}
//                                 </td>
//                                 <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
//                                   {row.DesignAdequacyScore}
//                                 </td>
//                                 <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
//                                   {row.SustainabilityScore}
//                                 </td>
//                                 <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
//                                   {row.ScalabilityScore}
//                                 </td>
//                                 <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
//                                   {row.AdequacyScore}
//                                 </td>
//                                 <td className="px-3 py-3 whitespace-nowrap">
//                                   <span
//                                     className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                                       row.Rating === "Excellent"
//                                         ? "bg-green-100 text-green-800"
//                                         : row.Rating === "Good"
//                                         ? "bg-blue-100 text-blue-800"
//                                         : row.Rating === "Average"
//                                         ? "bg-yellow-100 text-yellow-800"
//                                         : "bg-gray-100 text-gray-800"
//                                     }`}
//                                   >
//                                     {row.Rating}
//                                   </span>
//                                 </td>
//                                 <td className="px-3 py-3 text-sm text-gray-500 whitespace-nowrap">
//                                   {row.Date}
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             </div>
//           )}
//         </main>
//       </div>
//     </ProtectedRoute>
//   );
// }
"use client";
import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
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

export default function ReportsPage() {
  const [data, setData] = useState<AssessmentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Pre-process: change the second occurrence of "5.1" to "5.10"
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

  // Natural sort on the processed No
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

  // Display uses the (already modified) No directly
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
        Design: Number(d.DesignAdequacyScore ?? 0),
        Sustainability: Number(d.SustainabilityScore ?? 0),
        Scalability: Number(d.ScalabilityScore ?? 0),
        Adequacy: Number(d.AdequacyScore ?? 0),
        Rating: d.Rating || "-",
        fullScore: 10,
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
          {loading ? (
            <div className="p-12 text-center bg-white rounded-xl shadow-sm">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading data...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
              Error: {error}
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6 flex-1 flex flex-col">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 flex-shrink-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  className="xl:col-span-8 col-span-1 bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
                    Design Adequacy — Trend (Line)
                  </h2>
                  <div className="h-64 w-full flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{ top: 8, right: 12, left: -20, bottom: 8 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="processLabel"
                          interval={0}
                          angle={-45}
                          textAnchor="end"
                          height={70}
                          tick={{ fontSize: 11 }}
                          stroke="#6b7280"
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fontSize: 11 }}
                          stroke="#6b7280"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: "13px" }} />
                        <Line
                          type="monotone"
                          dataKey="Design"
                          stroke={COLORS[0]}
                          strokeWidth={2.5}
                          dot={{ r: 3, strokeWidth: 2 }}
                          activeDot={{ r: 5 }}
                          animationDuration={900}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-sm sm:text-base font-semibold mb-3 text-gray-800">
                      Design Adequacy — Vertical Bar
                    </h3>
                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData}
                          margin={{ top: 8, right: 12, left: -20, bottom: 8 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis
                            dataKey="processLabel"
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            tick={{ fontSize: 11 }}
                            stroke="#6b7280"
                          />
                          <YAxis
                            allowDecimals={false}
                            tick={{ fontSize: 11 }}
                            stroke="#6b7280"
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#fff",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: "13px" }} />
                          <Bar
                            dataKey="Design"
                            fill="#fbbf24"
                            name="Obtained Score"
                            barSize={chartData.length > 12 ? 14 : 20}
                            animationDuration={900}
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar
                            dataKey="fullScore"
                            fill="#a855f7"
                            name="Full Score"
                            barSize={chartData.length > 12 ? 14 : 20}
                            animationDuration={900}
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55 }}
                  className="xl:col-span-4 col-span-1 bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col gap-6"
                >
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">
                      Design Adequacy — Horizontal
                    </h2>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={chartData}
                          margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis
                            type="number"
                            allowDecimals={false}
                            tick={{ fontSize: 11 }}
                            stroke="#6b7280"
                          />
                          <YAxis
                            dataKey="processLabel"
                            type="category"
                            width={90}
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
                          <Legend wrapperStyle={{ fontSize: "13px" }} />
                          <Bar
                            dataKey="Design"
                            fill="#fbbf24"
                            name="Obtained Score"
                            animationDuration={900}
                            radius={[0, 4, 4, 0]}
                            barSize={chartData.length > 12 ? 12 : 16}
                          />
                          <Bar
                            dataKey="fullScore"
                            fill="#a855f7"
                            name="Full Score"
                            animationDuration={900}
                            radius={[0, 4, 4, 0]}
                            barSize={chartData.length > 12 ? 12 : 16}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-gray-200">
                    <h2 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">
                      Overall — Design Adequacy (Radar)
                    </h2>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart
                          cx="50%"
                          cy="50%"
                          outerRadius="70%"
                          data={chartData}
                        >
                          <PolarGrid stroke="#e5e7eb" />
                          <PolarAngleAxis
                            dataKey="short"
                            tick={{ fontSize: 10, fill: "#6b7280" }}
                          />
                          <PolarRadiusAxis
                            angle={30}
                            domain={[
                              0,
                              Math.max(10, ...chartData.map((c) => c.Design)),
                            ]}
                            tick={{ fontSize: 10, fill: "#6b7280" }}
                          />
                          <Radar
                            name="Design"
                            dataKey="Design"
                            stroke={COLORS[2]}
                            fill={COLORS[2]}
                            fillOpacity={0.4}
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
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45 }}
                className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex-1 flex flex-col"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 flex-shrink-0">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm sm:text-base font-semibold mb-3 text-gray-800">
                      Rating Distribution (Pie)
                    </h4>
                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={ratingDistribution}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius="60%"
                            label={pieLabel as any}
                            animationDuration={900}
                            labelLine={{ stroke: "#6b7280" }}
                          >
                            {ratingDistribution.map((_, idx) => (
                              <Cell
                                key={idx}
                                fill={COLORS[idx % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#fff",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm sm:text-base font-semibold mb-3 text-gray-800">
                      Design Share (Donut)
                    </h4>
                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={designShare}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius="40%"
                            outerRadius="70%"
                            label={donutLabel as any}
                            animationDuration={900}
                            labelLine={{ stroke: "#6b7280" }}
                          >
                            {designShare.map((_, idx) => (
                              <Cell
                                key={idx}
                                fill={COLORS[idx % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#fff",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-5">
                    <h4 className="text-sm sm:text-base font-semibold mb-4 text-gray-800">
                      Quick Stats
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                        <span className="text-xs sm:text-sm text-gray-600 font-medium">
                          Total Processes
                        </span>
                        <span className="text-sm sm:text-base font-bold text-blue-600">
                          {sortedData.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                        <span className="text-xs sm:text-sm text-gray-600 font-medium">
                          Avg Design
                        </span>
                        <span className="text-sm sm:text-base font-bold text-green-600">
                          {sortedData.length
                            ? (
                                sortedData.reduce(
                                  (s, d) =>
                                    s + Number(d.DesignAdequacyScore || 0),
                                  0
                                ) / sortedData.length
                              ).toFixed(2)
                            : "-"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                        <span className="text-xs sm:text-sm text-gray-600 font-medium">
                          Avg Sustainability
                        </span>
                        <span className="text-sm sm:text-base font-bold text-teal-600">
                          {sortedData.length
                            ? (
                                sortedData.reduce(
                                  (s, d) =>
                                    s + Number(d.SustainabilityScore || 0),
                                  0
                                ) / sortedData.length
                              ).toFixed(2)
                            : "-"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                        <span className="text-xs sm:text-sm text-gray-600 font-medium">
                          Avg Scalability
                        </span>
                        <span className="text-sm sm:text-base font-bold text-purple-600">
                          {sortedData.length
                            ? (
                                sortedData.reduce(
                                  (s, d) => s + Number(d.ScalabilityScore || 0),
                                  0
                                ) / sortedData.length
                              ).toFixed(2)
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
                    Data Table
                  </h3>
                  <div className="overflow-auto flex-1 -mx-4 sm:mx-0">
                    <div className="inline-block min-w-full align-middle">
                      <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                No
                              </th>
                              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Process
                              </th>
                              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                Design
                              </th>
                              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                Sustainability
                              </th>
                              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                Scalability
                              </th>
                              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                Adequacy
                              </th>
                              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                Rating
                              </th>
                              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                Date
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {sortedData.map((row) => (
                              <tr
                                key={row.Id}
                                className="hover:bg-gray-50 transition-colors duration-150"
                              >
                                <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
                                  {displayNo(row.No)}
                                </td>
                                <td className="px-3 py-3 text-sm text-gray-900">
                                  {row.Process}
                                </td>
                                <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
                                  {row.DesignAdequacyScore}
                                </td>
                                <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
                                  {row.SustainabilityScore}
                                </td>
                                <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
                                  {row.ScalabilityScore}
                                </td>
                                <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">
                                  {row.AdequacyScore}
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      row.Rating === "Excellent"
                                        ? "bg-green-100 text-green-800"
                                        : row.Rating === "Good"
                                        ? "bg-blue-100 text-blue-800"
                                        : row.Rating === "Average"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {row.Rating}
                                  </span>
                                </td>
                                <td className="px-3 py-3 text-sm text-gray-500 whitespace-nowrap">
                                  {row.Date}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

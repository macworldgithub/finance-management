"use client";
import { motion } from "framer-motion";

export default function EfficiencyReport() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-xl shadow-md"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Assessment of Efficiency
      </h2>
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Efficiency Reports
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Assessment of Efficiency reports and analytics will be available here.
          This section will display charts and statistics related to process
          efficiency metrics.
        </p>
        <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Coming soon
        </div>
      </div>
    </motion.div>
  );
}

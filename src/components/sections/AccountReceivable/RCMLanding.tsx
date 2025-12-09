"use client";

import React from "react";

interface RCMLandingProps {
  onNavigate: (tabKey: string, subTabKey?: string) => void;
}

const RCMLanding: React.FC<RCMLandingProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex justify-center pt-8 pb-12">
      <div className="w-[96%] max-w-5xl bg-white shadow-md rounded-xl p-6 border border-gray-200">
        {/* RCM Header (clickable) */}
        <button
          type="button"
          className="w-full bg-[#2f5b1e] text-white text-center font-bold text-lg py-2 rounded-sm mb-4 hover:bg-[#396d28] transition cursor-pointer underline decoration-2 decoration-white/70"
          onClick={() => onNavigate("1")}
        >
          RCM
        </button>

        {/* Main RCM categories */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-6 text-center text-sm font-semibold">
          <button
            className="bg-[#1f4e79] text-white py-3 px-2 rounded-sm hover:opacity-90 transition"
            onClick={() => onNavigate("1")}
          >
            Process Management
          </button>
          <button
            className="bg-[#c00000] text-white py-3 px-2 rounded-sm hover:opacity-90 transition"
            onClick={() => onNavigate("4")}
          >
            Risk Management
          </button>
          <button
            className="bg-[#385723] text-white py-3 px-2 rounded-sm hover:opacity-90 transition"
            onClick={() => onNavigate("3", "coso")}
          >
            Internal Control Management
          </button>
          <button
            className="bg-[#002060] text-white py-3 px-2 rounded-sm hover:opacity-90 transition"
            onClick={() => onNavigate("9", "sox")}
          >
            Compliance Management
          </button>
          <button
            className="bg-[#002060] text-white py-3 px-2 rounded-sm hover:opacity-90 transition"
            onClick={() => onNavigate("10", "audit")}
          >
            Internal Audit Management
          </button>
        </div>

        {/* Risk Management row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6 text-center text-xs font-semibold">
          <button
            className="bg-[#ff0000] text-white py-2 px-2 rounded-sm hover:opacity-90 transition"
            onClick={() => onNavigate("4")}
          >
            Risk Assessment (Inherent Risk)
          </button>
          <button
            className="bg-[#ff0000] text-white py-2 px-2 rounded-sm hover:opacity-90 transition"
            onClick={() => onNavigate("5")}
          >
            Risk Responses
          </button>
          <button
            className="bg-[#ff0000] text-white py-2 px-2 rounded-sm hover:opacity-90 transition"
            onClick={() => onNavigate("8")}
          >
            Risk Assessment (Residual Risk)
          </button>
        </div>

        {/* Internal Control row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-8 text-center text-xs font-semibold">
          <button
            className="bg-[#00b050] text-white py-2 px-2 rounded-sm hover:opacity-90 transition"
            onClick={() => onNavigate("3", "coso")}
          >
            Control Environment
          </button>
          <button
            className="bg-[#00b050] text-white py-2 px-2 rounded-sm hover:opacity-90 transition"
            onClick={() => onNavigate("6")}
          >
            Control Activities
          </button>
          <button
            className="bg-[#00b0f0] text-white py-2 px-2 rounded-sm hover:opacity-90 transition"
            onClick={() => onNavigate("7")}
          >
            Control Assessment
          </button>
        </div>

        {/* RCM Assessment */}
        <div className="bg-[#2f5b1e] text-white text-center font-bold text-lg py-2 rounded-sm mb-4">
          RCM ASSESSMENT
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-6 text-center text-xs font-semibold">
          <div className="py-2 bg-[#e2efda] border border-[#c5e0b4] text-[#215623]">
            Processes
          </div>
          <div className="py-2 bg-[#e2efda] border border-[#c5e0b4] text-[#215623]">
            Assessment of Adequacy
          </div>
          <div className="py-2 bg-[#e2efda] border border-[#c5e0b4] text-[#215623]">
            Assessment of Effectiveness
          </div>
          <div className="py-2 bg-[#e2efda] border border-[#c5e0b4] text-[#215623]">
            Assessment of Efficiency
          </div>
          <div className="py-2 bg-[#e2efda] border border-[#c5e0b4] text-[#215623]">
            Process Severity
          </div>
        </div>

        {/* Dashboard */}
        <div className="bg-[#2f5b1e] text-white text-center font-bold text-lg py-2 rounded-sm mb-4">
          DASHBOARD
        </div>
        <div className="py-4 px-3 text-xs font-semibold rounded-sm bg-[#fff2cc] border border-[#ffd966] text-[#7f6000] text-center">
          PROCESS MANAGEMENT REPORTS
        </div>
      </div>
    </div>
  );
};

export default RCMLanding;

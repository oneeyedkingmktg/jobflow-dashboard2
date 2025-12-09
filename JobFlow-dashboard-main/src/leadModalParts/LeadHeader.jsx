import React from "react";
import { STATUS_COLORS, STATUS_LABELS } from "./statusConfig.js";

export default function LeadHeader({
  name,
  status,
  phone,
  onCall,
  onText,
  onMap,
}) {
  const statusColor = STATUS_COLORS[status] || "#6b7280";

  return (
    <div className="bg-white px-6 py-5 border-b border-gray-200">
      {/* NAME + STATUS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        
        {/* NAME */}
        <h2 className="text-2xl font-bold text-gray-900 break-words">
          {name || "New Lead"}
        </h2>

        {/* STATUS CHIP */}
        <span
          className="px-4 py-1 rounded-full text-white text-sm font-semibold shadow"
          style={{ backgroundColor: statusColor }}
        >
          {STATUS_LABELS[status] || status}
        </span>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3 mt-4 flex-wrap">

        {/* CALL */}
        <button
          onClick={onCall}
          className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white rounded-lg 
          shadow hover:bg-green-700 transition-all text-sm font-semibold"
        >
          Call
        </button>

        {/* TEXT */}
        <button
          onClick={onText}
          className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg 
          shadow hover:bg-blue-700 transition-all text-sm font-semibold"
        >
          Text
        </button>

        {/* MAP */}
        <button
          onClick={onMap}
          className="flex-1 sm:flex-none px-4 py-2 bg-gray-700 text-white rounded-lg 
          shadow hover:bg-gray-800 transition-all text-sm font-semibold"
        >
          Map
        </button>
      </div>
    </div>
  );
}

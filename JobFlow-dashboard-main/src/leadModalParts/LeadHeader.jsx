import React from "react";

// Colors for header based on status
const STATUS_BG = {
  lead: "#2563eb",               // blue
  appointment_set: "#7c3aed",    // purple
  sold: "#16a34a",               // green
  not_sold: "#dc2626",           // red
  complete: "#6b7280",           // gray
};

export default function LeadHeader({ name, status, phone, onCall, onText, onMap }) {
  const bgColor = STATUS_BG[status] || "#2563eb";

  return (
    <div className="w-full">
      {/* HEADER BAR */}
      <div
        className="px-6 py-5 text-white rounded-t-3xl shadow-md"
        style={{ backgroundColor: bgColor }}
      >
        <h2 className="text-2xl font-bold">{name || "New Lead"}</h2>
      </div>

      {/* WHITE ACTION STRIP UNDER HEADER */}
      <div className="bg-white px-6 pt-4 pb-4 border-b border-gray-300">
        {/* CALL / TEXT / MAPS — 3 equal buttons */}
        <div className="grid grid-cols-3 gap-3 w-full">
          
          {/* CALL */}
          <button
            onClick={onCall}
            className="w-full py-3 bg-white border border-gray-300 rounded-xl 
                       font-semibold text-gray-800 shadow-sm hover:shadow-md"
          >
            Call
          </button>

          {/* TEXT */}
          <button
            onClick={onText}
            className="w-full py-3 bg-white border border-gray-300 rounded-xl 
                       font-semibold text-gray-800 shadow-sm hover:shadow-md"
          >
            Text
          </button>

          {/* MAPS */}
          <button
            onClick={onMap}
            className="w-full py-3 bg-white border border-gray-300 rounded-xl 
                       font-semibold text-gray-800 shadow-sm hover:shadow-md"
          >
            Maps
          </button>
        </div>
      </div>
    </div>
  );
}

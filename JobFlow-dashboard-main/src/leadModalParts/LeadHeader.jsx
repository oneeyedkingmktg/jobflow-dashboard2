import React from "react";

export default function LeadHeader({ name, status, phone, onCall, onText, onMap }) {
  return (
    <div className="bg-white px-6 py-4 border-b border-gray-200">
      {/* NAME */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">{name || "New Lead"}</h2>
      </div>

      {/* STATUS & ACTIONS */}
      <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
        {/* STATUS */}
        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
          {status?.replace("_", " ").toUpperCase()}
        </span>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-3">
          {/* CALL */}
          <button
            onClick={onCall}
            className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-semibold shadow hover:bg-green-700"
          >
            Call
          </button>

          {/* TEXT */}
          <button
            onClick={onText}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold shadow hover:bg-blue-700"
          >
            Text
          </button>

          {/* MAP */}
          <button
            onClick={onMap}
            className="px-3 py-1 bg-gray-700 text-white rounded-lg text-xs font-semibold shadow hover:bg-gray-800"
          >
            Map
          </button>
        </div>
      </div>
    </div>
  );
}

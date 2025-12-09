import React from "react";
import { STATUS_COLORS } from "./statusConfig";

function ActionButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white text-gray-800 rounded-lg py-2 font-semibold shadow hover:shadow-md"
    >
      {label}
    </button>
  );
}

export default function LeadHeader({
  name,
  status,
  phone,
  onCall,
  onText,
  onMap,
}) {
  return (
    <div
      className="px-6 pt-4 pb-5"
      style={{
        backgroundColor: STATUS_COLORS[status] || "#59687d",
      }}
    >
      <h2 className="text-2xl font-bold text-white mb-4">
        {name || "New Lead"}
      </h2>

      {/* CALL / TEXT / MAPS buttons */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <ActionButton label="Call" onClick={onCall} />
        <ActionButton label="Text" onClick={onText} />
        <ActionButton label="Maps" onClick={onMap} />
      </div>
    </div>
  );
}

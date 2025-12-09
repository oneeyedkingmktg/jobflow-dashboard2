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
  name = "New Lead",
  status = "lead",
  phone = "",
  onCall,
  onText,
  onMap,
}) {
  const headerColor = STATUS_COLORS[status] || "#59687d";

  return (
    <div
      className="px-6 pt-4 pb-5"
      style={{ backgroundColor: headerColor }}
    >
      <h2 className="text-2xl font-bold text-white mb-4">{name}</h2>

      <div className="grid grid-cols-3 gap-3">
        <ActionButton label="Call" onClick={onCall} />
        <ActionButton label="Text" onClick={onText} />
        <ActionButton label="Maps" onClick={onMap} />
      </div>
    </div>
  );
}

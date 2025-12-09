import React from "react";
import { STATUS_COLORS } from "./statusConfig";

// Simple button used for Call / Text / Maps
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
  const safeName = name || "New Lead";
  const headerColor = STATUS_COLORS[status] || "#59687d";

  const handleCall = () => {
    if (!phone || !onCall) return;
    onCall();
  };

  const handleText = () => {
    if (!phone || !onText) return;
    onText();
  };

  const handleMap = () => {
    if (!onMap) return;
    onMap();
  };

  return (
    <div
      className="px-6 pt-4 pb-5"
      style={{ backgroundColor: headerColor }}
    >
      <h2 className="text-2xl font-bold text-white mb-4">
        {safeName}
      </h2>

      {/* CALL / TEXT / MAPS buttons */}
      <div className="grid grid-cols-3 gap-3">
        <ActionButton label="Call" onClick={handleCall} />
        <ActionButton label="Text" onClick={handleText} />
        <ActionButton label="Maps" onClick={handleMap} />
      </div>
    </div>
  );
}

import React from "react";

export default function LeadAddressBox({ form, onOpenMaps }) {
  return (
    <div
      onClick={onOpenMaps}
      className="bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm cursor-pointer hover:border-blue-500 transition"
    >
      <div className="text-xs text-gray-500">📍 Tap to open in Maps</div>
      <div className="text-blue-700 font-semibold">{form.address}</div>
      <div className="text-gray-700 text-sm">
        {[form.city, form.state, form.zip].filter(Boolean).join(", ")}
      </div>
    </div>
  );
}

import React from "react";

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
        backgroundColor:
          status === "lead"
            ? "#59687d"
            : status === "appointment_set"
            ? "#225ce5"
            : status === "sold"
            ? "#048c63"
            : status === "not_sold"
            ? "#c72020"
            : "#ea8e09",
      }}
    >
      <h2 className="text-2xl font-bold text-white mb-4">
        {name || "New Lead"}
      </h2>

      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={onCall}
          className="bg-white text-gray-800 rounded-lg py-2 font-semibold shadow hover:shadow-md"
        >
          Call
        </button>

        <button
          onClick={onText}
          className="bg-white text-gray-800 rounded-lg py-2 font-semibold shadow hover:shadow-md"
        >
          Text
        </button>

        <button
          onClick={onMap}
          className="bg-white text-gray-800 rounded-lg py-2 font-semibold shadow hover:shadow-md"
        >
          Maps
        </button>
      </div>
    </div>
  );
}

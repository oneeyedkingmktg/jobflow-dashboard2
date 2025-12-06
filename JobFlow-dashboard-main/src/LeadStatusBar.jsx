import React, { useState } from "react";

export default function LeadStatusBar({ form, setForm }) {
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const statuses = ["Lead", "Appointment Set", "Sold", "Not Sold", "Complete"];
  const statusColors = {
    Lead: "bg-gray-400",
    "Appointment Set": "bg-blue-500",
    Sold: "bg-green-500",
    "Not Sold": "bg-red-500",
    Complete: "bg-yellow-500",
  };

  const getNextProgression = () => {
    switch (form.status) {
      case "Lead":
        return "Appointment Set";
      case "Appointment Set":
        return "Sold";
      case "Sold":
        return "Complete";
      default:
        return null;
    }
  };

  const nextProgress = getNextProgression();

  return (
    <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
      {/* Current Status Button + Dropdown */}
      <div className="relative">
        <button
          onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
          className={`px-3 py-1 rounded text-white ${
            statusColors[form.status] || "bg-gray-400"
          } font-medium`}
        >
          {form.status}
        </button>
        {statusDropdownOpen && (
          <div className="absolute mt-1 bg-white border border-gray-300 rounded shadow-lg z-50">
            {statuses.map((s) => (
              <div
                key={s}
                onClick={() => {
                  setForm((prev) => ({ ...prev, status: s }));
                  setStatusDropdownOpen(false);
                }}
                className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Move-To Buttons */}
      <div className="flex items-center gap-2">
        {form.status === "Appointment Set" ? (
          <>
            <button
              onClick={() => setForm((prev) => ({ ...prev, status: "Sold" }))}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Sold
            </button>
            <button
              onClick={() =>
                setForm((prev) => ({ ...prev, status: "Not Sold" }))
              }
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Not Sold
            </button>
          </>
        ) : nextProgress ? (
          <button
            onClick={() =>
              setForm((prev) => ({ ...prev, status: nextProgress }))
            }
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Move to {nextProgress}
          </button>
        ) : null}
      </div>
    </div>
  );
}

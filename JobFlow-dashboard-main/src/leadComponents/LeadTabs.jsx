// File: src/leadComponents/LeadTabs.jsx
// Created: 2025-12-10

import React from "react";

export default function LeadTabs({
  TABS,
  activeTab,
  counts,
  onTabChange,
  onAddLead,
  onOpenCalendar,
}) {
  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">

        {/* MOBILE = grid 2 columns, DESKTOP = row */}
        <div className="
          grid grid-cols-2 gap-3
          sm:flex sm:flex-wrap sm:gap-3
        ">
          {TABS.map((tab) => {
            const active = activeTab === tab;

            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`
                  w-full sm:w-auto
                  px-4 py-3 rounded-xl font-semibold text-sm
                  text-center shadow-sm transition-all
                  ${active
                    ? "bg-[#225ce5] text-white shadow-md"
                    : "bg-white text-gray-800 border"
                  }
                `}
              >
                {tab} ({counts[tab]})
              </button>
            );
          })}

          {/* NEW LEAD BUTTON */}
          <button
            onClick={onAddLead}
            className="
              w-full sm:w-auto
              px-4 py-3 rounded-xl font-semibold text-sm text-center
              bg-green-600 text-white shadow-md hover:bg-green-700
            "
          >
            + New Lead
          </button>

          {/* CALENDAR BUTTON */}
          <button
            onClick={onOpenCalendar}
            className="
              w-full sm:w-auto
              px-4 py-3 rounded-xl font-semibold text-sm text-center
              bg-indigo-600 text-white shadow-md hover:bg-indigo-700
            "
          >
            Calendar
          </button>
        </div>
      </div>
    </div>
  );
}

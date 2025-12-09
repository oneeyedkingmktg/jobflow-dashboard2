import React from "react";
import {
  STATUS_LABELS,
  STATUS_COLORS,
} from "./statusConfig.js";

export default function LeadStatusBar({
  form,
  setForm,
  onOpenNotSold,
  onOpenApptModal,
}) {
  const currentStatus = form.status || "lead";

  const setStatus = (status) => {
    setForm((prev) => ({ ...prev, status }));
  };

  const handleLeadToAppt = () => setStatus("appointment_set");

  const handleSoldFromAppt = () => {
    setForm((prev) => ({
      ...prev,
      status: "sold",
      notSoldReason: "",
    }));
    onOpenApptModal && onOpenApptModal();
  };

  const handleNotSoldFromAppt = () => onOpenNotSold && onOpenNotSold();

  const handleSoldFromNotSold = () =>
    setForm((prev) => ({ ...prev, status: "sold" }));

  const handleSoldToComplete = () => setStatus("complete");

  const handleCompleteToArchive = () => {
    // Archive behavior will be added later.
  };

  const renderButtons = () => {
    if (currentStatus === "lead") {
      return (
        <button
          onClick={handleLeadToAppt}
          className="w-full sm:w-auto px-5 py-2 rounded-full text-sm font-bold shadow text-white flex items-center justify-center"
          style={{ backgroundColor: STATUS_COLORS["appointment_set"] }}
        >
          <span className="mr-1">»»</span>
          {STATUS_LABELS["appointment_set"].toUpperCase()}
        </button>
      );
    }

    if (currentStatus === "appointment_set") {
      return (
        <div className="flex w-full sm:w-auto gap-2">
          <button
            onClick={handleSoldFromAppt}
            className="flex-1 sm:flex-none px-4 py-2 rounded-full text-sm font-bold shadow text-white flex items-center justify-center"
            style={{ backgroundColor: STATUS_COLORS["sold"] }}
          >
            <span className="mr-1">»»</span>
            {STATUS_LABELS["sold"].toUpperCase()}
          </button>

          <button
            onClick={handleNotSoldFromAppt}
            className="flex-1 sm:flex-none px-4 py-2 rounded-full text-sm font-bold shadow text-white flex items-center justify-center"
            style={{ backgroundColor: STATUS_COLORS["not_sold"] }}
          >
            <span className="mr-1">»»</span>
            {STATUS_LABELS["not_sold"].toUpperCase()}
          </button>
        </div>
      );
    }

    if (currentStatus === "not_sold") {
      return (
        <button
          onClick={handleSoldFromNotSold}
          className="w-full sm:w-auto px-5 py-2 rounded-full text-sm font-bold shadow text-white flex items-center justify-center"
          style={{ backgroundColor: STATUS_COLORS["sold"] }}
        >
          <span className="mr-1">»»</span>
          {STATUS_LABELS["sold"].toUpperCase()}
        </button>
      );
    }

    if (currentStatus === "sold") {
      return (
        <button
          onClick={handleSoldToComplete}
          className="w-full sm:w-auto px-5 py-2 rounded-full text-sm font-bold shadow text-white flex items-center justify-center"
          style={{ backgroundColor: STATUS_COLORS["complete"] }}
        >
          <span className="mr-1">»»</span>
          {STATUS_LABELS["complete"].toUpperCase()}
        </button>
      );
    }

    if (currentStatus === "complete") {
      return (
        <button
          onClick={handleCompleteToArchive}
          className="w-full sm:w-auto px-5 py-2 rounded-full text-sm font-bold shadow text-white flex items-center justify-center bg-gray-700"
        >
          <span className="mr-1">»»</span>
          ARCHIVE
        </button>
      );
    }

    return (
      <button
        disabled
        className="w-full sm:w-auto px-5 py-2 rounded-full text-sm font-bold shadow text-gray-600 bg-gray-300 flex items-center justify-center"
      >
        NO NEXT STEP
      </button>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">

      {/* Status Dropdown */}
      <div className="relative w-full sm:w-auto">
        <select
          value={form.status}
          onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
          className="appearance-none bg-[#59687d] text-white text-sm font-semibold px-4 py-2 rounded-full pr-10 shadow cursor-pointer w-full sm:w-auto"
        >
          {Object.keys(STATUS_LABELS).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>

        {/* Down-arrow indicator */}
        <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-white text-xs">
          ▼
        </div>
      </div>

      {/* Progression Buttons */}
      {renderButtons()}
    </div>
  );
}

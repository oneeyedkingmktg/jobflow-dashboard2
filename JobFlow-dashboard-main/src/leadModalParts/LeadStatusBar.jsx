import React from "react";
import { STATUS_LABELS, STATUS_COLORS } from "./statusConfig.js";

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

  // === ACTIONS ===
  const handleLeadToAppt = () => setStatus("appointment_set");

  const handleSoldFromAppt = () => {
    setForm((prev) => ({
      ...prev,
      status: "sold",
      notSoldReason: "",
    }));
    if (onOpenApptModal) onOpenApptModal();
  };

  const handleNotSoldFromAppt = () => {
    if (onOpenNotSold) onOpenNotSold();
  };

  const handleSoldFromNotSold = () => {
    setForm((prev) => ({
      ...prev,
      status: "sold",
    }));
  };

  const handleSoldToComplete = () => setStatus("complete");

  const renderButtons = () => {
    if (currentStatus === "lead") {
      return (
        <button
          onClick={handleLeadToAppt}
          className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-bold shadow text-white flex items-center justify-center"
          style={{ backgroundColor: STATUS_COLORS["appointment_set"] }}
        >
          Appointment Set
        </button>
      );
    }

    if (currentStatus === "appointment_set") {
      return (
        <div className="flex w-full sm:w-auto gap-2">
          <button
            onClick={handleSoldFromAppt}
            className="flex-1 sm:flex-none px-6 py-3 rounded-full text-sm font-bold shadow text-white"
            style={{ backgroundColor: STATUS_COLORS["sold"] }}
          >
            Sold
          </button>

          <button
            onClick={handleNotSoldFromAppt}
            className="flex-1 sm:flex-none px-6 py-3 rounded-full text-sm font-bold shadow text-white"
            style={{ backgroundColor: STATUS_COLORS["not_sold"] }}
          >
            Not Sold
          </button>
        </div>
      );
    }

    if (currentStatus === "not_sold") {
      return (
        <button
          onClick={handleSoldFromNotSold}
          className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-bold shadow text-white"
          style={{ backgroundColor: STATUS_COLORS["sold"] }}
        >
          Mark Sold
        </button>
      );
    }

    if (currentStatus === "sold") {
      return (
        <button
          onClick={handleSoldToComplete}
          className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-bold shadow text-white"
          style={{ backgroundColor: STATUS_COLORS["complete"] }}
        >
          Complete
        </button>
      );
    }

    if (currentStatus === "complete") {
      return (
        <button
          disabled
          className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-bold shadow text-white bg-gray-500"
        >
          Archived
        </button>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">

      {/* STATUS DROPDOWN — now matches header color */}
      <div className="relative w-full sm:w-auto">
        <select
          value={form.status}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              status: e.target.value,
            }))
          }
          className="appearance-none text-white font-semibold rounded-full w-full px-4 pr-10 shadow cursor-pointer"
          style={{
            backgroundColor: STATUS_COLORS[form.status],
            height: "48px",
            fontSize: "1.05rem",
          }}
        >
          {Object.keys(STATUS_LABELS).map((s) => (
            <option
              key={s}
              value={s}
              style={{
                padding: "14px 0",
                fontSize: "1.1rem",
                background: "white",
                color: "black",
              }}
            >
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>

        {/* Chevron */}
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white"
          style={{ fontSize: "18px" }}
        >
          ▼
        </div>
      </div>

      {/* Status advancement button(s) */}
      {renderButtons()}
    </div>
  );
}

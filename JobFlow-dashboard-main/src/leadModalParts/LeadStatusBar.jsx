// LeadStatusBar.jsx  (Updated 2025-12-10 2:48pm)
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

  // ================================================
  // STATUS PROGRESSION MAP
  // ================================================
  const NEXT_STATUS = {
    lead: "appointment_set",
    appointment_set: "sold",
    sold: "complete",
    complete: "archived",
  };

  const NEXT_LABEL = {
    lead: "Appointment Set",
    appointment_set: "Sold",
    sold: "Complete",
    complete: "Archive",
  };

  // ================================================
  // SPECIAL CASE HANDLERS
  // ================================================
  const handleProgression = () => {
    const next = NEXT_STATUS[currentStatus];
    if (!next) return;

    // "Appointment Set" → "Sold" also opens appt modal
    if (currentStatus === "appointment_set" && next === "sold") {
      setForm((prev) => ({ ...prev, status: "sold", notSoldReason: "" }));
      if (onOpenApptModal) onOpenApptModal();
      return;
    }

    // "Appointment Set" → Not Sold (separate button)
    if (currentStatus === "appointment_set" && onOpenNotSold) {
      // this is handled by the separate "Not Sold" button
    }

    // Everything else is a direct move
    setStatus(next);
  };

  // ================================================
  // RENDER PROGRESSION BUTTON
  // ================================================
  const renderProgressButton = () => {
    // ARCHIVED → no buttons
    if (currentStatus === "archived") return null;

    // NOT SOLD → show "Mark Sold"
    if (currentStatus === "not_sold") {
      return (
        <button
          onClick={() => setStatus("sold")}
          className="px-5 py-3 rounded-lg text-white shadow flex flex-col"
          style={{ backgroundColor: STATUS_COLORS["sold"] }}
        >
          <span className="text-[10px] uppercase opacity-80">move to</span>
          <span className="text-sm font-semibold">>> Sold</span>
        </button>
      );
    }

    // APPOINTMENT SET → Sold OR Not Sold
    if (currentStatus === "appointment_set") {
      return (
        <div className="flex gap-3">
          {/* Move to Sold */}
          <button
            onClick={handleProgression}
            className="px-5 py-3 rounded-lg text-white shadow flex flex-col"
            style={{ backgroundColor: STATUS_COLORS["sold"] }}
          >
            <span className="text-[10px] uppercase opacity-80">move to</span>
            <span className="text-sm font-semibold">>> Sold</span>
          </button>

          {/* Not Sold */}
          <button
            onClick={onOpenNotSold}
            className="px-5 py-3 rounded-lg text-white shadow flex flex-col"
            style={{ backgroundColor: STATUS_COLORS["not_sold"] }}
          >
            <span className="text-[10px] uppercase opacity-80">move to</span>
            <span className="text-sm font-semibold">>> Not Sold</span>
          </button>
        </div>
      );
    }

    // Default progression button
    const next = NEXT_STATUS[currentStatus];
    const label = NEXT_LABEL[currentStatus];

    return (
      <button
        onClick={handleProgression}
        className="px-5 py-3 rounded-lg text-white shadow flex flex-col"
        style={{ backgroundColor: STATUS_COLORS[next] }}
      >
        <span className="text-[10px] uppercase opacity-80 leading-none">
          move to
        </span>
        <span className="text-sm font-semibold leading-none">
          >> {label}
        </span>
      </button>
    );
  };

  // ================================================
  // MAIN RENDER
  // ================================================
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">

      {/* STATUS DROPDOWN */}
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

        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white"
          style={{ fontSize: "18px" }}
        >
          ▼
        </div>
      </div>

      {/* PROGRESSION BUTTONS */}
      {renderProgressButton()}
    </div>
  );
}

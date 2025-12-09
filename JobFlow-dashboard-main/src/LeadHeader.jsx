import React from "react";
import { STATUS_COLORS, STATUS_LABELS, STATUS_PROGRESS } from "./statusConfig";

// Button for Call / Text / Maps
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
  form,
  setForm,
  handleSoldFromAppt,
  handleNotSoldFromAppt,
}) {
  const currentStatus = form.status;
  const nextStatus = STATUS_PROGRESS[currentStatus] || null;
  const nextStatusLabel = nextStatus ? STATUS_LABELS[nextStatus] : null;

  const nextStatusColor = nextStatus
    ? STATUS_COLORS[nextStatus]
    : "#ccc";

  // Status dropdown change
  const handleStatusChange = (value) => {
    setForm((prev) => ({
      ...prev,
      status: value,
      // If manually switching away from not_sold → clear reason
      notSoldReason: value === "not_sold" ? prev.notSoldReason : "",
    }));
  };

  // Utility: phone open
  const call = () => {
    if (!form.phone) return;
    window.open(`tel:${form.phone.replace(/[^\d]/g, "")}`);
  };

  const text = () => {
    if (!form.phone) return;
    window.open(`sms:${form.phone.replace(/[^\d]/g, "")}`);
  };

  const maps = () => {
    const query = `${form.address}, ${form.city}, ${form.state} ${form.zip}`;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        query
      )}`,
      "_blank"
    );
  };

  const handleProgressNext = () => {
    if (!nextStatus) return;

    // not_sold → sold clears reason
    if (currentStatus === "not_sold" && nextStatus === "sold") {
      setForm((p) => ({
        ...p,
        status: "sold",
        notSoldReason: "",
      }));
    } else {
      setForm((p) => ({
        ...p,
        status: nextStatus,
      }));
    }
  };

  return (
    <div
      className="px-6 pt-4 pb-5"
      style={{
        backgroundColor: STATUS_COLORS[currentStatus] || "#59687d",
      }}
    >
      <h2 className="text-2xl font-bold text-white mb-4">
        {form.name || "New Lead"}
      </h2>

      {/* CALL / TEXT / MAPS buttons */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <ActionButton label="Call" onClick={call} />
        <ActionButton label="Text" onClick={text} />
        <ActionButton label="Maps" onClick={maps} />
      </div>

      {/* STATUS SELECT + PROGRESSION */}
      <div className="flex items-center justify-between gap-4 mb-1">
        {/* Status Dropdown */}
        <div className="relative">
          <select
            value={currentStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="appearance-none bg-[#59687d] text-white text-sm font-semibold px-4 py-2 rounded-full pr-8 shadow cursor-pointer"
          >
            {Object.keys(STATUS_LABELS).map((statusKey) => (
              <option key={statusKey} value={statusKey}>
                {STATUS_LABELS[statusKey]}
              </option>
            ))}
          </select>

          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-sm pointer-events-none">
            ▼
          </span>
        </div>

        {/* PROGRESSION BUTTONS */}
        {currentStatus === "appointment_set" ? (
          <div className="flex gap-3">
            {/* SOLD from Appointment Set */}
            <button
              onClick={handleSoldFromAppt}
              className="px-5 py-2 rounded-full text-sm font-bold shadow text-white flex items-center"
              style={{ backgroundColor: STATUS_COLORS["sold"] }}
            >
              <span className="mr-1">»»</span> SOLD
            </button>

            {/* NOT SOLD from Appointment Set */}
            <button
              onClick={handleNotSoldFromAppt}
              className="px-5 py-2 rounded-full text-sm font-bold shadow text-white flex items-center"
              style={{ backgroundColor: STATUS_COLORS["not_sold"] }}
            >
              <span className="mr-1">»»</span> NOT SOLD
            </button>
          </div>
        ) : (
          <button
            onClick={handleProgressNext}
            disabled={!nextStatus}
            className={`px-6 py-2 rounded-full text-sm font-bold shadow flex items-center ${
              nextStatus ? "text-white" : "text-gray-600 bg-gray-300"
            }`}
            style={nextStatus ? { backgroundColor: nextStatusColor } : {}}
          >
            {nextStatusLabel ? (
              <>
                <span className="mr-1">»»</span>
                {nextStatusLabel.toUpperCase()}
              </>
            ) : (
              "NO NEXT STEP"
            )}
          </button>
        )}
      </div>
    </div>
  );
}

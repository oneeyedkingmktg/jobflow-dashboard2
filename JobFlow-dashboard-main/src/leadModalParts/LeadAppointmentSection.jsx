import React from "react";

export default function LeadAppointmentSection({
  form,
  setShowApptModal,
  setShowDateModal,
}) {
  const formatDate = (value) => {
    if (!value) return "Not Set";
    const d = new Date(value);
    if (isNaN(d)) return "Not Set";
    return `${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const formatTime = (value) => {
    if (!value) return "";
    const parts = String(value).split(":");
    let hour = parseInt(parts[0], 10);
    const minutes = parts[1] || "00";
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minutes.padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

      {/* APPOINTMENT DATE/TIME */}
      <div
        onClick={() => setShowApptModal(true)}
        className="bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm cursor-pointer hover:border-blue-500 transition"
      >
        <div className="text-xs text-gray-500">Appointment</div>
        <div className="text-blue-700 font-semibold">
          {formatDate(form.apptDate)}
        </div>
        <div className="text-gray-700 text-xs">
          {formatTime(form.apptTime)}
        </div>
      </div>

      {/* INSTALL DATE */}
      <div
        onClick={() => setShowDateModal("installDate")}
        className="bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm cursor-pointer hover:border-blue-500 transition"
      >
        <div className="text-xs text-gray-500">Install Date</div>
        <div className="text-blue-700 font-semibold">
          {formatDate(form.installDate)}
        </div>
      </div>
    </div>
  );
}

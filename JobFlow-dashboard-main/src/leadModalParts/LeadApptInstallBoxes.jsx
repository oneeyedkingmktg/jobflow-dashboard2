import React from "react";

export default function LeadApptInstallBoxes({
  form,
  formatDate,
  formatTime,
  setShowApptModal,
  setShowDateModal,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

      {/* APPOINTMENT BOX */}
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

      {/* INSTALL DATE BOX */}
      <div
        onClick={() => setShowDateModal("installDate")}
        className="bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm cursor-pointer hover:border-blue-500 transition"
      >
        <div className="text-xs text-gray-500">Install Date</div>
        <div className="text-blue-700 font-semibold">
          {formatDate(form.installDate)}
        </div>
        {form.installTentative && (
          <div className="text-xs text-amber-600 font-semibold">(Tentative)</div>
        )}
      </div>

    </div>
  );
}

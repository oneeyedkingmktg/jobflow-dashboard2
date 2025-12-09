import React from "react";

export default function LeadAppointmentSection({
  form,
  setShowApptModal,
  setShowDateModal,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 px-5 py-4 shadow-sm space-y-3 text-sm">

      {/* APPOINTMENT DATE */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-gray-500">Appointment Date</div>
          <div className="font-semibold">
            {form.apptDate ? form.apptDate : "Not Set"}
          </div>
        </div>

        <button
          onClick={() => setShowApptModal(true)}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-semibold text-xs shadow"
        >
          Set
        </button>
      </div>

      {/* APPOINTMENT TIME */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-gray-500">Appointment Time</div>
          <div className="font-semibold">
            {form.apptTime ? form.apptTime : "Not Set"}
          </div>
        </div>

        <button
          onClick={() => setShowApptModal(true)}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-semibold text-xs shadow"
        >
          Set
        </button>
      </div>

      {/* INSTALL DATE */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-gray-500">Install Date</div>
          <div className="font-semibold">
            {form.installDate ? form.installDate : "Not Set"}
            {form.installTentative ? " (Tentative)" : ""}
          </div>
        </div>

        <button
          onClick={() => setShowDateModal("installDate")}
          className="px-3 py-1.5 bg-green-600 text-white rounded-lg font-semibold text-xs shadow"
        >
          Set
        </button>
      </div>

    </div>
  );
}

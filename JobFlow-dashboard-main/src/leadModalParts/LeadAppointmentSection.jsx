import React from "react";

export default function LeadAppointmentSection({
  form,
  setShowApptModal,
  setShowDateModal,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 px-5 py-4 shadow-sm text-sm text-gray-800 space-y-3">

      {/* APPOINTMENT DATE */}
      <div className="flex justify-between items-center">
        <div>
          <div className="text-gray-500 text-xs">Appointment Date</div>
          <div className="font-semibold">
            {form.apptDate ? form.apptDate : "Not Set"}
          </div>
        </div>

        <button
          onClick={() => setShowApptModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-bold shadow hover:shadow-md"
        >
          {form.apptDate ? "Edit" : "Set"}
        </button>
      </div>

      {/* APPOINTMENT TIME */}
      <div className="flex justify-between items-center">
        <div>
          <div className="text-gray-500 text-xs">Appointment Time</div>
          <div className="font-semibold">
            {form.apptTime ? form.apptTime : "Not Set"}
          </div>
        </div>

        <button
          onClick={() => setShowApptModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-bold shadow hover:shadow-md"
        >
          {form.apptTime ? "Edit" : "Set"}
        </button>
      </div>

      {/* INSTALL DATE */}
      <div className="flex justify-between items-center">
        <div>
          <div className="text-gray-500 text-xs">Install Date</div>
          <div className="font-semibold">
            {form.installDate ? form.installDate : "Not Set"}
            {form.installTentative ? " (Tentative)" : ""}
          </div>
        </div>

        <button
          onClick={() => setShowDateModal("installDate")}
          className="px-4 py-2 bg-purple-600 text-white rounded-full text-xs font-bold shadow hover:shadow-md"
        >
          {form.installDate ? "Edit" : "Set"}
        </button>
      </div>
    </div>
  );
}

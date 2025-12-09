import React from "react";

export default function LeadAppointmentSection({
  form,
  setShowApptModal,
  setShowDateModal,
}) {
  const apptDisplay =
    form.apptDate || form.apptTime
      ? `${form.apptDate || "Date Not Set"}${
          form.apptTime ? ` @ ${form.apptTime}` : ""
        }`
      : "Not Set";

  const installDisplay = form.installDate
    ? `${form.installDate}${form.installTentative ? " (Tentative)" : ""}`
    : "Not Set";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 px-4 py-4 shadow-sm text-sm">
      <div className="grid grid-cols-2 gap-3">
        {/* APPOINTMENT CARD */}
        <button
          type="button"
          onClick={() => setShowApptModal(true)}
          className="bg-[#f5f6f7] rounded-xl border border-gray-200 px-3 py-3 text-left flex flex-col justify-between min-w-0"
        >
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Appointment
          </div>
          <div className="mt-1 font-semibold text-gray-900 break-words">
            {apptDisplay}
          </div>
        </button>

        {/* INSTALL DATE CARD */}
        <button
          type="button"
          onClick={() => setShowDateModal("installDate")}
          className="bg-[#f5f6f7] rounded-xl border border-gray-200 px-3 py-3 text-left flex flex-col justify-between min-w-0"
        >
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Install Date
          </div>
          <div className="mt-1 font-semibold text-gray-900 break-words">
            {installDisplay}
          </div>
        </button>
      </div>
    </div>
  );
}

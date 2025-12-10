import React from "react";

export default function LeadAppointmentSection({
  form,
  setShowApptModal,
  setShowDateModal,
}) {
  // Fix timezone issue — do not convert via new Date()
  const formatDate = (d) => {
    if (!d) return "";
    const [y, m, day] = d.split("-");
    return `${m}/${day}/${y}`;
  };

  const formatTime = (t) => {
    if (!t) return "";
    let [h, m] = t.split(":");
    h = parseInt(h, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

  const apptDateLine = form.apptDate ? formatDate(form.apptDate) : "Not Set";
  const apptTimeLine = form.apptTime ? formatTime(form.apptTime) : "";

  const installDateLine = form.installDate
    ? formatDate(form.installDate) +
      (form.installTentative ? " (Tentative)" : "")
    : "Not Set";

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-3">

        {/* APPOINTMENT BOX */}
        <button
          type="button"
          onClick={() => setShowApptModal(true)}
          className="bg-[#f5f6f7] rounded-xl border border-gray-200 px-3 py-3 text-left shadow-sm flex flex-col"
        >
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Appointment
          </div>

          <div className="mt-1 text-gray-900 text-sm font-semibold">
            {apptDateLine}
          </div>

          {apptTimeLine && (
            <div className="text-gray-700 text-sm">{apptTimeLine}</div>
          )}
        </button>

        {/* INSTALL BOX */}
        <button
          type="button"
          onClick={() => setShowDateModal("installDate")}
          className="bg-[#f5f6f7] rounded-xl border border-gray-200 px-3 py-3 text-left shadow-sm flex flex-col"
        >
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Install Date
          </div>

          <div className="mt-1 text-gray-900 text-sm font-semibold">
            {installDateLine}
          </div>
        </button>
      </div>
    </div>
  );
}

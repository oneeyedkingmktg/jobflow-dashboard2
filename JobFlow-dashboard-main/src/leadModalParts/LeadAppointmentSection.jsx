import React from "react";

export default function LeadAppointmentSection({
  form,
  setShowApptModal,
  setShowDateModal,
}) {
  // =====================================================
  // SAFE DATE FORMATTER — NO TIMEZONE SHIFTING
  // =====================================================
  const formatDate = (d) => {
    if (!d) return "Not Set";
    // Expected input: YYYY-MM-DD
    const parts = d.split("-");
    if (parts.length !== 3) return d;
    const [y, m, day] = parts;
    return `${m}/${day}/${y}`;
  };

  // =====================================================
  // TIME FORMATTER for display (HH:mm → h:mm AM/PM)
  // =====================================================
  const formatTime = (t) => {
    if (!t) return "";
    let [h, m] = t.split(":");
    h = parseInt(h, 10);

    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;

    return `${hour12}:${m} ${ampm}`;
  };

  // =====================================================
  // Build display strings
  // =====================================================
  const apptDateDisplay = formatDate(form.apptDate);
  const apptTimeDisplay = form.apptTime ? formatTime(form.apptTime) : "";

  const installDateDisplay = form.installDate
    ? formatDate(form.installDate) +
      (form.installTentative ? " (Tentative)" : "")
    : "Not Set";

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-3">

        {/* ========================= */}
        {/*      APPOINTMENT BOX     */}
        {/* ========================= */}
        <button
          type="button"
          onClick={() => setShowApptModal(true)}
          className="bg-[#f5f6f7] rounded-xl border border-gray-200 px-3 py-3
                     text-left shadow-sm flex flex-col"
        >
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Appointment
          </div>

          {/* DATE — always on its own line */}
          <div className="mt-1 text-gray-900 text-sm font-semibold">
            {apptDateDisplay}
          </div>

          {/* TIME — only appears if set */}
          {apptTimeDisplay && (
            <div className="text-gray-700 text-sm">{apptTimeDisplay}</div>
          )}
        </button>

        {/* ========================= */}
        {/*        INSTALL BOX        */}
        {/* ========================= */}
        <button
          type="button"
          onClick={() => setShowDateModal("installDate")}
          className="bg-[#f5f6f7] rounded-xl border border-gray-200 px-3 py-3
                     text-left shadow-sm flex flex-col"
        >
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Install Date
          </div>

          <div className="mt-1 text-gray-900 text-sm font-semibold">
            {installDateDisplay}
          </div>
        </button>

      </div>
    </div>
  );
}

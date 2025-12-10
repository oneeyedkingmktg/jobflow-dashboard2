import React from "react";

export default function LeadAppointmentSection({
  form,
  setShowApptModal,
  setShowDateModal,
}) {
  // Format date → MM DD YYYY
  const formatDate = (iso) => {
    if (!iso) return "Not Set";
    const d = new Date(iso);
    if (isNaN(d)) return "Not Set";

    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();

    return `${mm}/${dd}/${yyyy}`;
  };

  // Format time → h:mm AM/PM
  const formatTime = (timeStr) => {
    if (!timeStr) return null;

    try {
      // Expecting HH:MM or "2:00 PM"
      if (timeStr.toLowerCase().includes("am") || timeStr.toLowerCase().includes("pm")) {
        return timeStr; // already formatted
      }

      const [hour, minute] = timeStr.split(":");
      let h = parseInt(hour, 10);
      const m = minute || "00";
      const ampm = h >= 12 ? "PM" : "AM";

      h = h % 12;
      if (h === 0) h = 12;

      return `${h}:${m} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  // Build Appointment display
  const apptDate = form.apptDate ? formatDate(form.apptDate) : "Not Set";
  const apptTime = form.apptTime ? formatTime(form.apptTime) : null;

  // Build Install display
  const installDate = form.installDate ? formatDate(form.installDate) : "Not Set";
  const installDisplay = form.installTentative
    ? `${installDate} (Tentative)`
    : installDate;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        {/* APPOINTMENT BOX */}
        <button
          type="button"
          onClick={() => setShowApptModal(true)}
          className="bg-[#f5f6f7] rounded-xl border border-gray-200 px-4 py-4 
                     text-left shadow-sm flex flex-col justify-between min-w-0"
        >
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Appointment
          </div>

          {/* DATE */}
          <div className="mt-1 font-semibold text-gray-900 text-sm">
            {apptDate}
          </div>

          {/* TIME */}
          {apptTime && (
            <div className="text-xs text-gray-500 mt-0.5">
              {apptTime}
            </div>
          )}
        </button>

        {/* INSTALL BOX */}
        <button
          type="button"
          onClick={() => setShowDateModal("installDate")}
          className="bg-[#f5f6f7] rounded-xl border border-gray-200 px-4 py-4 
                     text-left shadow-sm flex flex-col justify-between min-w-0"
        >
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Install Date
          </div>

          <div className="mt-1 font-semibold text-gray-900 text-sm">
            {installDisplay}
          </div>
        </button>

      </div>
    </div>
  );
}

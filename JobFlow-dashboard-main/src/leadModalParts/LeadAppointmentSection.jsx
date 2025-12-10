import React from "react";

export default function LeadAppointmentSection({
  form,
  setShowApptModal,
  setShowDateModal,
}) {
  // =====================================================
  // SAFE DATE FORMATTER — handles:
  //   "YYYY-MM-DD"
  //   "YYYY-MM-DD HH:mm:ss" 
  //   "25-12-16"
  // =====================================================
  const formatDate = (d) => {
    if (!d) return "Not Set";

    // Remove time if included
    let clean = d.split(" ")[0].trim();

    // If format is DD-MM-YY or DD-MM-YYYY → convert to YYYY-MM-DD
    const parts = clean.split("-");
    if (parts.length === 3) {
      let [a, b, c] = parts;

      // Case: YYYY-MM-DD already correct
      if (a.length === 4) {
        return `${b}/${c}/${a}`;
      }

      // Case: YY-MM-DD → assume 20YY
      if (a.length === 2 && c.length === 2) {
        const year = `20${a}`;
        return `${b}/${c}/${year}`;
      }

      // Case: DD-MM-YYYY → flip
      if (c.length === 4) {
        return `${b}/${a}/${c}`;
      }
    }

    // Fallback: return original
    return clean;
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
    ? formatDate(form.installDate) + (form.installTentative ? " (Tentative)" : "")
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

          <div className="mt-1 text-gray-900 text-sm font-semibold">
            {apptDateDisplay}
          </div>

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

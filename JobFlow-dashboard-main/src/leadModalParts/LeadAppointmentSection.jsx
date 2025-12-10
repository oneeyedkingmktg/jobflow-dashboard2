import React from "react";

export default function LeadAppointmentSection({
  form,
  setShowApptModal,
  setShowDateModal,
}) {
  // Convert YYYY-MM-DD → MM/DD/YYYY
  const formatDisplayDate = (isoDate) => {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    if (isNaN(d)) return isoDate; // fallback
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };
  

  // Format appointment date + time
  const apptDateFormatted = form.apptDate ? formatDisplayDate(form.apptDate) : null;
  const apptTimeFormatted = form.apptTime || null;

  const apptDisplay =
    apptDateFormatted || apptTimeFormatted
      ? (
          <>
            <div>{apptDateFormatted || "Date Not Set"}</div>
            {apptTimeFormatted && (
              <div className="text-gray-600 text-xs mt-0.5">{apptTimeFormatted}</div>
            )}
          </>
        )
      : (
          <div>Not Set</div>
        );

  // Format install date
  const installDisplay = form.installDate
    ? (
        <>
          <div>{formatDisplayDate(form.installDate)}</div>
          {form.installTentative && (
            <div className="text-gray-600 text-xs mt-0.5">(Tentative)</div>
          )}
        </>
      )
    : (
        <div>Not Set</div>
      );

  return (
    <div className="w-full">
      {/* Two boxes side-by-side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        {/* APPOINTMENT BOX */}
        <button
          type="button"
          onClick={() => setShowApptModal(true)}
          className="bg-[#f5f6f7] rounded-xl border border-gray-200 px-3 py-3 text-left 
                     shadow-sm flex flex-col justify-between min-w-0"
        >
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Appointment
          </div>

          <div className="mt-1 font-semibold text-gray-900 text-sm leading-tight">
            {apptDisplay}
          </div>
        </button>

        {/* INSTALL BOX */}
        <button
          type="button"
          onClick={() => setShowDateModal("installDate")}
          className="bg-[#f5f6f7] rounded-xl border border-gray-200 px-3 py-3 text-left 
                     shadow-sm flex flex-col justify-between min-w-0"
        >
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Install Date
          </div>

          <div className="mt-1 font-semibold text-gray-900 text-sm leading-tight">
            {installDisplay}
          </div>
        </button>

      </div>
    </div>
  );
}

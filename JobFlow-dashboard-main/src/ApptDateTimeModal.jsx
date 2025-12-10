import React, { useState, useEffect } from "react";

export default function ApptDateTimeModal({
  apptDate,
  apptTime,
  onConfirm,
  onClose,
  onRemove,
}) {
  // Convert YYYY-MM-DD → MM/DD/YYYY for UI
  const formatDisplayDate = (isoDate) => {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  // Convert MM/DD/YYYY → YYYY-MM-DD for DB
  const normalizeToISO = (mmddyyyy) => {
    if (!mmddyyyy) return "";
    const [mm, dd, yyyy] = mmddyyyy.split("/");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Extract hour/minute/ampm from "2:00 PM"
  const parseTime = (t) => {
    if (!t) return { hour: "2", minute: "00", ampm: "PM" };
    const [timePart, ampm] = t.split(" ");
    let [h, m] = timePart.split(":");
    return { hour: h || "2", minute: m || "00", ampm: ampm || "PM" };
  };

  const initialTime = parseTime(apptTime);

  const [date, setDate] = useState(formatDisplayDate(apptDate));
  const [hour, setHour] = useState(initialTime.hour);
  const [minute, setMinute] = useState(initialTime.minute);
  const [ampm, setAmpm] = useState(initialTime.ampm);

  const handleSave = () => {
    if (!date) return;

    const iso = normalizeToISO(date);
    const formattedTime = `${hour}:${minute} ${ampm}`;

    onConfirm(iso, formattedTime);
    onClose();
  };

  const handleRemove = () => {
    if (onRemove) onRemove();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-xs p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-800 text-center">
          Set Appointment
        </h2>

        {/* DATE FIELD */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Appointment Date
          </label>
          <input
            type="text"
            placeholder="MM/DD/YYYY"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-2 text-sm"
          />
        </div>

        {/* TIME SELECTORS */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Appointment Time
          </label>

          <div className="flex gap-2">
            {/* HOUR */}
            <select
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className="border border-gray-300 rounded px-2 py-2 text-sm w-1/3"
            >
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map(
                (h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                )
              )}
            </select>

            {/* MINUTE */}
            <select
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              className="border border-gray-300 rounded px-2 py-2 text-sm w-1/3"
            >
              {["00", "15", "30", "45"].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {/* AM / PM */}
            <select
              value={ampm}
              onChange={(e) => setAmpm(e.target.value)}
              className="border border-gray-300 rounded px-2 py-2 text-sm w-1/3"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-between mt-4 gap-2">
          <button
            onClick={handleRemove}
            className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
          >
            Remove
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

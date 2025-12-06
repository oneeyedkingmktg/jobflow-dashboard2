import React, { useState, useEffect } from "react";

export default function ApptDateTimeModal({ apptDate, apptTime, onConfirm, onRemove, onClose }) {
  const [date, setDate] = useState(apptDate || "");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [ampm, setAmPm] = useState("AM");

  useEffect(() => {
    if (apptTime) {
      const [h, m] = apptTime.split(":");
      if (h) {
        const hr = parseInt(h, 10);
        setAmPm(hr >= 12 ? "PM" : "AM");
        setHour(String(hr % 12 || 12));
      }
      if (m) setMinute(m);
    }
  }, [apptTime]);

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const minutes = ["00", "15", "30", "45"];

  const handleSave = () => {
    if (!date || !hour || !minute) return;
    const finalHour = ampm === "PM" ? (parseInt(hour, 10) % 12) + 12 : parseInt(hour, 10) % 12;
    const formattedTime = `${String(finalHour).padStart(2, "0")}:${minute}`;
    onConfirm(date, formattedTime);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xs p-5" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-3 text-gray-800 text-center">Set Appointment</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Time</label>
          <div className="flex justify-between gap-2">
            <select value={hour} onChange={(e) => setHour(e.target.value)} className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm">
              <option value="">HH</option>
              {hours.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>

            <select value={minute} onChange={(e) => setMinute(e.target.value)} className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm">
              <option value="">MM</option>
              {minutes.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>

            <select value={ampm} onChange={(e) => setAmPm(e.target.value)} className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm">
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between mt-4 gap-2">
          <button 
            onClick={() => {
              if (onRemove) {
                onRemove();
              }
              onClose();
            }} 
            className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium"
          >
            Remove
          </button>

          <div className="flex gap-2">
            <button onClick={onClose} className="px-3 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm">
              Cancel
            </button>
            <button onClick={handleSave} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
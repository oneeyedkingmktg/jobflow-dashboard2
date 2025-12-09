import React, { useState, useEffect } from "react";

export default function ApptDateTimeModal({
  apptDate,
  apptTime,
  onConfirm,
  onClose,
  onRemove,
}) {
  const [date, setDate] = useState(apptDate || "");
  const [time, setTime] = useState(apptTime || "");

  useEffect(() => {
    if (apptDate) setDate(apptDate);
    if (apptTime) setTime(apptTime);
  }, [apptDate, apptTime]);

  const handleSave = () => {
    if (!date) return;
    const normalized = new Date(date).toISOString().split("T")[0];
    onConfirm(normalized, time);
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
        <h2 className="text-lg font-semibold mb-3 text-gray-800 text-center">
          Appointment Date & Time
        </h2>

        {/* Date */}
        <div className="mb-4 cursor-pointer">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>

        {/* Time */}
        <div className="mb-4 cursor-pointer">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>

        {/* Buttons */}
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

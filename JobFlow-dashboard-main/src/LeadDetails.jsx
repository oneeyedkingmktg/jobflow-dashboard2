// LeadDetails.jsx
import React from "react";

export default function LeadDetails({
  form,
  isEditing,
  onEditField,
  formatDate,
  formatTime,
  setShowApptModal,
  setShowDateModal,
}) {
  return (
    <div className="mb-4">
      {/* Address Section */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        {/* Clickable Address Box */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${form.address}, ${form.city}, ${form.state} ${form.zip}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`block bg-gray-50 rounded-lg p-2.5 mb-3 cursor-pointer transition-colors ${
            isEditing ? "hover:bg-blue-50 hover:border-blue-300 border border-transparent" : "hover:bg-gray-100 border border-transparent"
          }`}
        >
          <div className="text-xs text-gray-500 font-medium mb-0.5">📍 Tap to open in Maps</div>
          <p className={`font-semibold text-base ${isEditing ? "text-blue-600" : "text-gray-900"}`}>
            {form.address}
          </p>
          <p className={`text-sm ${isEditing ? "text-blue-600" : "text-gray-600"}`}>
            {form.city}, {form.state} {form.zip}
          </p>
        </a>
        
        {form.phone && (
          <p className="mt-2 text-sm text-gray-800 font-medium">{form.phone}</p>
        )}
        {form.leadSource && (
          <div className="mt-3 inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-200">
            <span className="text-sm">📍</span>
            <span>Lead Source: {form.leadSource}</span>
          </div>
        )}
      </div>

      {/* Dates Section - Appointment Left, Install Date Right */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        {/* Appointment Date/Time - LEFT */}
        <div
          onClick={() => setShowApptModal(true)}
          className={`bg-gray-50 rounded-lg p-2.5 cursor-pointer transition-colors ${
            isEditing ? "hover:bg-blue-50 hover:border-blue-300" : "hover:bg-gray-100"
          }`}
        >
          <div className="text-xs text-gray-500 font-medium mb-0.5">Appointment</div>
          <div className={`font-semibold ${isEditing ? "text-blue-600" : "text-gray-900"}`}>
            {formatDate(form.apptDate)}
          </div>
          <div className={`text-xs ${isEditing ? "text-blue-600" : "text-gray-600"}`}>
            {formatTime(form.apptTime)}
          </div>
        </div>

        {/* Install Date - RIGHT */}
        <div
          onClick={() => setShowDateModal("installDate")}
          className={`bg-gray-50 rounded-lg p-2.5 cursor-pointer transition-colors ${
            isEditing ? "hover:bg-blue-50 hover:border-blue-300" : "hover:bg-gray-100"
          }`}
        >
          <div className="text-xs text-gray-500 font-medium mb-0.5">Install Date</div>
          <div className={`font-semibold ${isEditing ? "text-blue-600" : "text-gray-900"}`}>
            {form.installTentative && form.installDate && (
              <span className="text-xs font-normal mr-1">Week of </span>
            )}
            {formatDate(form.installDate)}
          </div>
        </div>
      </div>
    </div>
  );
}
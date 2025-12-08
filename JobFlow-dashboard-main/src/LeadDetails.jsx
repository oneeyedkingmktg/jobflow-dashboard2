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

      {/* ============================================================
          CONTACT INFORMATION (RESTORED)
      ============================================================ */}
      <div className="mb-4 pb-4 border-b border-gray-300">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact</h3>

        <div className="space-y-2">

          {/* Name */}
          <div>
            <label className="text-xs font-medium text-gray-600">Name</label>
            <p
              className={`text-base font-semibold ${
                isEditing ? "text-blue-600 cursor-pointer" : "text-gray-900"
              }`}
              onClick={() => isEditing && onEditField("name")}
            >
              {form.name || "—"}
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-medium text-gray-600">Email</label>
            <p
              className={`text-sm ${
                isEditing ? "text-blue-600 cursor-pointer" : "text-gray-700"
              }`}
              onClick={() => isEditing && onEditField("email")}
            >
              {form.email || "—"}
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-medium text-gray-600">Phone</label>
            <p
              className={`text-sm ${
                isEditing ? "text-blue-600 cursor-pointer" : "text-gray-700"
              }`}
              onClick={() => isEditing && onEditField("phone")}
            >
              {form.phone || "—"}
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-medium text-gray-600">Notes</label>
            <p
              className={`text-sm whitespace-pre-line ${
                isEditing ? "text-blue-600 cursor-pointer" : "text-gray-700"
              }`}
              onClick={() => isEditing && onEditField("notes")}
            >
              {form.notes || "—"}
            </p>
          </div>

        </div>
      </div>

      {/* ============================================================
          ADDRESS SECTION
      ============================================================ */}
      <div className="mb-4 pb-4 border-b border-gray-200">

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${form.address}, ${form.city}, ${form.state} ${form.zip}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`block bg-gray-50 rounded-lg p-2.5 mb-3 cursor-pointer transition-colors ${
            isEditing
              ? "hover:bg-blue-50 hover:border-blue-300 border border-transparent"
              : "hover:bg-gray-100 border border-transparent"
          }`}
        >
          <div className="text-xs text-gray-500 font-medium mb-0.5">
            📍 Tap to open in Maps
          </div>
          <p
            className={`font-semibold text-base ${
              isEditing ? "text-blue-600" : "text-gray-900"
            }`}
          >
            {form.address}
          </p>
          <p
            className={`text-sm ${
              isEditing ? "text-blue-600" : "text-gray-600"
            }`}
          >
            {form.city}, {form.state} {form.zip}
          </p>
        </a>

        {form.leadSource && (
          <div className="mt-3 inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-200">
            <span className="text-sm">📍</span>
            <span>Lead Source: {form.leadSource}</span>
          </div>
        )}
      </div>

      {/* ============================================================
          DATES SECTION
      ============================================================ */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        
        {/* Appointment */}
        <div
          onClick={() => setShowApptModal(true)}
          className={`bg-gray-50 rounded-lg p-2.5 cursor-pointer transition-colors ${
            isEditing ? "hover:bg-blue-50 hover:border-blue-300" : "hover:bg-gray-100"
          }`}
        >
          <div className="text-xs text-gray-500 font-medium mb-0.5">Appointment</div>
          <div
            className={`font-semibold ${
              isEditing ? "text-blue-600" : "text-gray-900"
            }`}
          >
            {formatDate(form.apptDate)}
          </div>
          <div
            className={`text-xs ${
              isEditing ? "text-blue-600" : "text-gray-600"
            }`}
          >
            {formatTime(form.apptTime)}
          </div>
        </div>

        {/* Install Date */}
        <div
          onClick={() => setShowDateModal("installDate")}
          className={`bg-gray-50 rounded-lg p-2.5 cursor-pointer transition-colors ${
            isEditing ? "hover:bg-blue-50 hover:border-blue-300" : "hover:bg-gray-100"
          }`}
        >
          <div className="text-xs text-gray-500 font-medium mb-0.5">Install Date</div>
          <div
            className={`font-semibold ${
              isEditing ? "text-blue-600" : "text-gray-900"
            }`}
          >
            {formatDate(form.installDate)}
          </div>
        </div>
      </div>
    </div>
  );
}

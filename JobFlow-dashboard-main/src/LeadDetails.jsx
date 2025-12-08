// LeadDetails.jsx
import React from "react";

export default function LeadDetails({
  form,
  isEditing,
  formatDate,
  formatTime,
  setShowApptModal,
  setShowDateModal,
}) {
  return (
    <div className="space-y-6">

      {/* ============================ */}
      {/* CONTACT INFORMATION SECTION */}
      {/* ============================ */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h3 className="text-lg font-bold mb-3 text-gray-900">Contact Info</h3>

        {form.name && (
          <p className="text-gray-800 font-semibold text-base">{form.name}</p>
        )}

        {form.phone && (
          <p className="text-gray-700 text-sm mt-1">{form.phone}</p>
        )}

        {form.email && (
          <p className="text-gray-600 text-sm">{form.email}</p>
        )}

        {/* Address (Clickable Maps) */}
        {form.address && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${form.address}, ${form.city}, ${form.state} ${form.zip}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-lg p-2.5 mt-3 border hover:border-blue-400 transition-all shadow-sm text-sm"
          >
            <div className="text-xs text-gray-500 mb-0.5">📍 Open in Maps</div>
            <p className="text-gray-800 font-medium">{form.address}</p>
            <p className="text-gray-600 text-sm">
              {form.city}, {form.state} {form.zip}
            </p>
          </a>
        )}
      </div>

      {/* ============================ */}
      {/* LEAD DETAILS SECTION */}
      {/* ============================ */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h3 className="text-lg font-bold mb-3 text-gray-900">Lead Details</h3>

        <div className="space-y-2 text-sm">
          {form.buyerType && (
            <p>
              <span className="font-semibold text-gray-700">Buyer Type: </span>
              {form.buyerType}
            </p>
          )}

          {form.companyName && (
            <p>
              <span className="font-semibold text-gray-700">Company Name: </span>
              {form.companyName}
            </p>
          )}

          {form.projectType && (
            <p>
              <span className="font-semibold text-gray-700">Project Type: </span>
              {form.projectType}
            </p>
          )}

          {/* ONLY SHOW REFERRAL SOURCE */}
          {form.referralSource && (
            <p>
              <span className="font-semibold text-gray-700">Referred By: </span>
              {form.referralSource}
            </p>
          )}

          {form.preferredContact && (
            <p>
              <span className="font-semibold text-gray-700">Preferred Contact: </span>
              {form.preferredContact}
            </p>
          )}

          {form.contractPrice && (
            <p>
              <span className="font-semibold text-gray-700">Contract Price: </span>
              ${form.contractPrice}
            </p>
          )}

          {form.notSoldReason && (
            <p className="text-red-700 font-medium">
              <span className="font-semibold">Not Sold Reason: </span>
              {form.notSoldReason}
            </p>
          )}
        </div>
      </div>

      {/* ============================ */}
      {/* DATE INFORMATION SECTION */}
      {/* ============================ */}
      <div className="grid grid-cols-2 gap-3 text-sm">

        {/* APPOINTMENT DATE */}
        <div
          onClick={() => setShowApptModal(true)}
          className="bg-gray-50 rounded-lg p-3 cursor-pointer transition-colors border hover:bg-blue-50 hover:border-blue-300"
        >
          <div className="text-xs text-gray-500 mb-1">Appointment</div>

          <div className="font-semibold text-gray-900">
            {formatDate(form.apptDate)}
          </div>

          <div className="text-xs text-gray-600">
            {formatTime(form.apptTime)}
          </div>
        </div>

        {/* INSTALL DATE */}
        <div
          onClick={() => setShowDateModal("installDate")}
          className="bg-gray-50 rounded-lg p-3 cursor-pointer transition-colors border hover:bg-blue-50 hover:border-blue-300"
        >
          <div className="text-xs text-gray-500 mb-1">Install Date</div>

          <div className="font-semibold text-gray-900">
            {form.installTentative && form.installDate && (
              <span className="text-xs mr-1">Week of</span>
            )}
            {formatDate(form.installDate)}
          </div>
        </div>
      </div>

      {/* ============================ */}
      {/* NOTES SECTION */}
      {/* ============================ */}
      {form.notes && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <h3 className="text-lg font-bold mb-2 text-gray-900">Notes</h3>
          <p className="text-gray-700 text-sm whitespace-pre-line">{form.notes}</p>
        </div>
      )}
    </div>
  );
}

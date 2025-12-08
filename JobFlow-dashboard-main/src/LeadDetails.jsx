import React from "react";

export default function LeadDetails({
  form,
  isEditing,
  formatDate,
  formatTime,
  setShowApptModal,
  setShowDateModal
}) {
  return (
    <div className="mb-4">
      {/* ADDRESS SECTION */}
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

        {/* PHONE */}
        {form.phone && (
          <p className="mt-2 text-sm text-gray-800 font-medium">
            {form.phone}
          </p>
        )}

        {/* EMAIL */}
        {form.email && (
          <p className="text-sm text-gray-600 mt-1">{form.email}</p>
        )}

        {/* LEAD SOURCE */}
        {form.leadSource && (
          <div className="mt-3 inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-200">
            <span>Lead Source:</span>
            <span>{form.leadSource}</span>
          </div>
        )}

        {/* REFERRAL SOURCE */}
        {form.referralSource && (
          <div className="mt-2 inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200">
            <span>Referral:</span>
            <span>{form.referralSource}</span>
          </div>
        )}

        {/* PROJECT TYPE */}
        {form.projectType && (
          <div className="mt-2 inline-flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold border border-gray-300">
            <span>Project:</span>
            <span>{form.projectType}</span>
          </div>
        )}

        {/* BUYER TYPE */}
        {form.buyerType && (
          <div className="mt-2 inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold border border-purple-200">
            <span>Buyer:</span>
            <span>{form.buyerType}</span>
          </div>
        )}

        {/* COMPANY NAME */}
        {form.companyName && (
          <div className="mt-2 inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold border border-orange-200">
            <span>Company:</span>
            <span>{form.companyName}</span>
          </div>
        )}

        {/* CONTRACT PRICE */}
        {form.contractPrice && (
          <div className="mt-2 inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs font-semibold border border-teal-200">
            <span>Contract:</span>
            <span>${form.contractPrice}</span>
          </div>
        )}

        {/* PREFERRED CONTACT */}
        {form.preferredContact && (
          <div className="mt-2 inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold border border-yellow-200">
            <span>Preferred:</span>
            <span>{form.preferredContact}</span>
          </div>
        )}
      </div>

      {/* DATES SECTION */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        {/* APPOINTMENT */}
        <div
          onClick={() => setShowApptModal(true)}
          className={`bg-gray-50 rounded-lg p-2.5 cursor-pointer transition-colors ${
            isEditing
              ? "hover:bg-blue-50 hover:border-blue-300"
              : "hover:bg-gray-100"
          }`}
        >
          <div className="text-xs text-gray-500 font-medium mb-0.5">
            Appointment
          </div>
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

        {/* INSTALL DATE */}
        <div
          onClick={() => setShowDateModal("installDate")}
          className={`bg-gray-50 rounded-lg p-2.5 cursor-pointer transition-colors ${
            isEditing
              ? "hover:bg-blue-50 hover:border-blue-300"
              : "hover:bg-gray-100"
          }`}
        >
          <div className="text-xs text-gray-500 font-medium mb-0.5">
            Install Date
          </div>
          <div
            className={`font-semibold ${
              isEditing ? "text-blue-600" : "text-gray-900"
            }`}
          >
            {form.installTentative && form.installDate && (
              <span className="text-xs font-normal mr-1">Week of</span>
            )}
            {formatDate(form.installDate)}
          </div>
        </div>
      </div>
    </div>
  );
}

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

      {/* CONTACT INFORMATION */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">
          Contact Information
        </h3>

        <div className="space-y-1 text-sm">
          {form.name ? (
            <p className="text-gray-900 font-medium">{form.name}</p>
          ) : (
            <p className="text-gray-400 italic">No name entered</p>
          )}

          {form.phone ? (
            <p className="text-gray-700">{form.phone}</p>
          ) : (
            <p className="text-gray-400 italic">No phone entered</p>
          )}

          {form.email && (
            <p className="text-gray-600">{form.email}</p>
          )}
        </div>

        {form.address && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${form.address}, ${form.city}, ${form.state} ${form.zip}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-4 bg-gray-50 border rounded-lg p-3 hover:border-blue-400 transition shadow-sm"
          >
            <div className="text-xs text-gray-500">📍 Open in Maps</div>
            <p className="text-gray-900 font-medium">{form.address}</p>
            <p className="text-gray-700 text-sm">
              {form.city}, {form.state} {form.zip}
            </p>
          </a>
        )}
      </div>

      {/* LEAD DETAILS */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">
          Lead Details
        </h3>

        <div className="space-y-2 text-sm text-gray-700">

          {form.buyerType && (
            <p>
              <span className="font-semibold">Buyer Type:</span>{" "}
              {form.buyerType}
            </p>
          )}

          {form.companyName && (
            <p>
              <span className="font-semibold">Company Name:</span>{" "}
              {form.companyName}
            </p>
          )}

          {form.projectType && (
            <p>
              <span className="font-semibold">Project Type:</span>{" "}
              {form.projectType}
            </p>
          )}

          {form.leadSource && (
            <p>
              <span className="font-semibold">Lead Source:</span>{" "}
              {form.leadSource}
            </p>
          )}

          {form.referralSource && (
            <p>
              <span className="font-semibold">Referral Source:</span>{" "}
              {form.referralSource}
            </p>
          )}

          {form.preferredContact && (
            <p>
              <span className="font-semibold">Preferred Contact:</span>{" "}
              {form.preferredContact}
            </p>
          )}

          {form.contractPrice && (
            <p>
              <span className="font-semibold">Contract Price:</span>{" "}
              ${form.contractPrice}
            </p>
          )}

          {form.notSoldReason && (
            <p className="text-red-700 font-semibold">
              Not Sold Reason: {form.notSoldReason}
            </p>
          )}
        </div>
      </div>

      {/* APPOINTMENT & INSTALL */}
      <div className="grid grid-cols-2 gap-4">

        {/* Appointment */}
        <div
          onClick={() => setShowApptModal(true)}
          className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:border-blue-400 cursor-pointer transition"
        >
          <div className="text-xs text-gray-500 mb-1">Appointment</div>

          <div className="text-gray-900 font-semibold">
            {form.apptDate ? formatDate(form.apptDate) : "Not Set"}
          </div>

          <div className="text-gray-600 text-sm">
            {form.apptTime ? formatTime(form.apptTime) : "Not Set"}
          </div>
        </div>

        {/* Install Date */}
        <div
          onClick={() => setShowDateModal("installDate")}
          className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:border-blue-400 cursor-pointer transition"
        >
          <div className="text-xs text-gray-500 mb-1">Install Date</div>

          <div className="text-gray-900 font-semibold">
            {form.installDate
              ? formatDate(form.installDate)
              : "Not Set"}
          </div>

          {form.installTentative && (
            <p className="text-xs text-gray-500 mt-1">Week of</p>
          )}
        </div>
      </div>

      {/* NOTES */}
      {form.notes ? (
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">
            Notes
          </h3>
          <p className="text-gray-700 text-sm whitespace-pre-line">
            {form.notes}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">
            Notes
          </h3>
          <p className="text-gray-400 text-sm italic">No notes added</p>
        </div>
      )}
    </div>
  );
}

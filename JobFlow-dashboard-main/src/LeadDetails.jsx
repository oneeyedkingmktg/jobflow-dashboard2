import React from "react";

export default function LeadDetails({
  form,
  isEditing,
  formatDate,
  formatTime,
  setShowApptModal,
  setShowDateModal,
}) {
  // Helper to display a section row
  const Row = ({ label, value, onClick }) => (
    <div
      className={`flex justify-between py-1 ${
        onClick ? "cursor-pointer hover:bg-gray-50 rounded-lg px-2" : ""
      }`}
      onClick={onClick}
    >
      <span className="font-medium text-gray-600">{label}:</span>
      <span className="text-gray-900">{value || "—"}</span>
    </div>
  );

  /* ----------------------------------------------------
     VIEW MODE ONLY
  -----------------------------------------------------*/
  if (!isEditing) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4 shadow-sm">

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Contact</h3>
          <Row label="Phone" value={form.phone} />
          <Row label="Email" value={form.email} />
          <Row label="Preferred Contact" value={form.preferredContact} />
        </div>

        {/* ADDRESS */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Address</h3>
          <Row label="Address" value={form.address} />
          <Row label="City" value={form.city} />
          <Row label="State" value={form.state} />
          <Row label="Zip" value={form.zip} />
        </div>

        {/* PROJECT */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Project</h3>
          <Row label="Buyer Type" value={form.buyerType} />
          <Row label="Company Name" value={form.companyName} />
          <Row label="Project Type" value={form.projectType} />
        </div>

        {/* SOURCES */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Sources</h3>
          <Row label="Lead Source" value={form.leadSource} />
          <Row label="Referral Source" value={form.referralSource} />
        </div>

        {/* DATES */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Dates</h3>

          <Row
            label="Appointment"
            value={
              form.apptDate
                ? `${formatDate(form.apptDate)} @ ${formatTime(form.apptTime)}`
                : "Not Set"
            }
            onClick={() => setShowApptModal(true)}
          />

          <Row
            label="Install Date"
            value={
              form.installDate
                ? `${formatDate(form.installDate)}${
                    form.installTentative ? " (Tentative)" : ""
                  }`
                : "Not Set"
            }
            onClick={() => setShowDateModal("installDate")}
          />
        </div>

        {/* FINANCIAL */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Financial</h3>
          <Row label="Contract Price" value={form.contractPrice} />
        </div>

        {/* NOTES */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Notes</h3>
          <div className="p-3 bg-gray-50 rounded-lg border text-gray-800 whitespace-pre-line">
            {form.notes || "—"}
          </div>
        </div>

      </div>
    );
  }

  /* ----------------------------------------------------
     EDITING MODE — LeadModal controls fields
  -----------------------------------------------------*/
  return <></>;
}

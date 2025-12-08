import React, { useState } from "react";
import LeadDetails from "./LeadDetails.jsx";
import DateModal from "./DateModal.jsx";
import ApptDateTimeModal from "./ApptDateTimeModal.jsx";
import { useCompany } from "./CompanyContext";
import { formatPhoneNumber } from "./utils/formatting";

export default function LeadModal({
  lead,
  onClose,
  onSave,
  onDelete,
}) {
  const { currentCompany } = useCompany();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    buyerType: "",
    companyName: "",
    projectType: "",
    leadSource: "",
    referralSource: "",
    preferredContact: "",
    notes: "",
    contractPrice: "",
    apptDate: "",
    apptTime: "",
    installDate: "",
    installTentative: false,
    notSoldReason: "",
    status: "lead",
    ...lead,
  });

  const [isEditing, setIsEditing] = useState(lead?.isNew || false);
  const [showDateModal, setShowDateModal] = useState(null);
  const [showApptModal, setShowApptModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const formatDate = (value) => {
    if (!value) return "Not Set";
    const d = new Date(value);
    if (isNaN(d)) return "Not Set";
    return `${d.getMonth() + 1}-${d.getDate()}-${d.getFullYear()}`;
  };

  const formatTime = (value) => value || "Not Set";

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (value) => {
    const formatted = formatPhoneNumber(value);
    handleChange("phone", formatted);
  };

  const handleSave = () => {
    onSave(form);
    setIsEditing(false);
  };

  const handleExit = () => {
    onClose({ view: "home" });
  };

  const buyerTypes = ["Residential", "Small Business", "Buyer not Owner", "Competitive Bid"];

  const projectTypes = [
    "Garage Floor",
    "Basement",
    "Patio",
    "Sidewalk",
    "Pool Deck",
    "Commercial",
  ];

  const preferredContacts = ["Phone", "SMS", "Email"];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 relative">

        {/* HEADER */}
        <div className="bg-blue-700 text-white rounded-t-2xl p-5">
          <h2 className="text-2xl font-bold">{form.name || "New Lead"}</h2>
        </div>

        <div className="p-6 space-y-6">

          {/* STATUS + ACTION BUTTON */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <span className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 font-semibold capitalize">
              {form.status}
            </span>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold"
              >
                Save
              </button>
            )}
          </div>

          {/* VIEW MODE */}
          {!isEditing && (
            <LeadDetails
              form={form}
              isEditing={false}
              formatDate={formatDate}
              formatTime={formatTime}
              setShowApptModal={setShowApptModal}
              setShowDateModal={setShowDateModal}
            />
          )}

          {/* EDIT MODE */}
          {isEditing && (
            <div className="space-y-6">

              {/* CONTACT INFORMATION */}
              <div className="bg-gray-50 p-4 rounded-xl border">
                <h3 className="font-bold mb-3">Contact Information</h3>

                <input
                  className="input"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />

                <input
                  className="input mt-3"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                />

                <input
                  className="input mt-3"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />

                <input
                  className="input mt-3"
                  placeholder="Address"
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />

                <div className="grid grid-cols-3 gap-3 mt-3">
                  <input
                    className="input"
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />

                  <input
                    className="input"
                    placeholder="State"
                    value={form.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                  />

                  <input
                    className="input"
                    placeholder="Zip"
                    value={form.zip}
                    onChange={(e) => handleChange("zip", e.target.value)}
                  />
                </div>
              </div>

              {/* LEAD DETAILS */}
              <div className="bg-gray-50 p-4 rounded-xl border">
                <h3 className="font-bold mb-3">Lead Details</h3>

                {/* Buyer Type */}
                <select
                  className="input"
                  value={form.buyerType}
                  onChange={(e) => handleChange("buyerType", e.target.value)}
                >
                  <option value="">Buyer Type</option>
                  {buyerTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>

                {/* Company Name */}
                {form.buyerType !== "Residential" && (
                  <input
                    className="input mt-3"
                    placeholder="Company Name"
                    value={form.companyName}
                    onChange={(e) => handleChange("companyName", e.target.value)}
                  />
                )}

                {/* Project Type */}
                <select
                  className="input mt-3"
                  value={form.projectType}
                  onChange={(e) => handleChange("projectType", e.target.value)}
                >
                  <option value="">Project Type</option>
                  {projectTypes.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>

                {/* Lead Source — only editable if empty */}
                <input
                  className={`input mt-3 ${form.leadSource ? "bg-gray-200 cursor-not-allowed" : ""}`}
                  placeholder="Lead Source"
                  value={form.leadSource}
                  onChange={(e) => {
                    if (!form.leadSource) handleChange("leadSource", e.target.value);
                  }}
                  disabled={!!form.leadSource}
                />

                {/* Referral Source */}
                <input
                  className="input mt-3"
                  placeholder="Referral Source"
                  value={form.referralSource}
                  onChange={(e) => handleChange("referralSource", e.target.value)}
                />

                {/* Preferred Contact */}
                <select
                  className="input mt-3"
                  value={form.preferredContact}
                  onChange={(e) => handleChange("preferredContact", e.target.value)}
                >
                  <option value="">Preferred Contact</option>
                  {preferredContacts.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>

                {/* Contract Price */}
                <input
                  className="input mt-3"
                  placeholder="Contract Price"
                  value={form.contractPrice}
                  onChange={(e) => handleChange("contractPrice", e.target.value)}
                />
              </div>

              {/* Notes */}
              <div className="bg-gray-50 p-4 rounded-xl border">
                <h3 className="font-bold mb-2">Notes</h3>
                <textarea
                  className="input h-28"
                  value={form.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* FOOTER */}
          <div className="flex justify-between items-center pt-4 border-t">
            <button
              onClick={handleExit}
              className="bg-gray-600 text-white px-8 py-3 rounded-xl font-bold"
            >
              Exit
            </button>

            {!isEditing && (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="text-red-600 font-semibold underline"
              >
                Delete Lead
              </button>
            )}
          </div>

          {/* DELETE CONFIRM */}
          {deleteConfirm && (
            <div className="bg-red-50 border border-red-300 rounded-xl p-4 mt-4">
              <p className="font-semibold text-red-700 mb-3">
                Are you sure you want to delete this lead?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => onDelete(form)}
                  className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="bg-gray-300 px-6 py-2 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* INSTALL / DATE MODALS */}
      {showDateModal && (
        <DateModal
          initialDate={form[showDateModal]}
          initialTentative={showDateModal === "installDate" ? form.installTentative : false}
          allowTentative={showDateModal === "installDate"}
          label={showDateModal === "installDate" ? "Set Install Date" : "Select Date"}
          onConfirm={(date, tentative) => {
            setForm((p) => ({
              ...p,
              [showDateModal]: date,
              installTentative: tentative || false,
            }));
            setShowDateModal(null);
          }}
          onRemove={() => {
            setForm((p) => ({
              ...p,
              [showDateModal]: "",
              installTentative: false,
            }));
            setShowDateModal(null);
          }}
          onClose={() => setShowDateModal(null)}
        />
      )}

      {/* APPOINTMENT MODAL */}
      {showApptModal && (
        <ApptDateTimeModal
          apptDate={form.apptDate}
          apptTime={form.apptTime}
          onConfirm={(date, time) => {
            setForm((p) => ({ ...p, apptDate: date, apptTime: time }));
            setShowApptModal(false);
          }}
          onRemove={() => {
            setForm((p) => ({ ...p, apptDate: "", apptTime: "" }));
            setShowApptModal(false);
          }}
          onClose={() => setShowApptModal(false)}
        />
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import LeadDetails from "./LeadDetails.jsx";
import DateModal from "./DateModal.jsx";
import ApptDateTimeModal from "./ApptDateTimeModal.jsx";

export default function LeadModal({
  lead,
  onClose,
  onSave,
  onDelete
}) {
  const [form, setForm] = useState({
    id: null,
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
    status: lead?.status || "Lead",
    notSoldReason: "",
    contractPrice: "",
    apptDate: "",
    apptTime: "",
    installDate: "",
    installTentative: false,
    preferredContact: "",
    notes: "",
    ...lead
  });

  const [isEditing, setIsEditing] = useState(lead?.isNew || false);
  const [showDateModal, setShowDateModal] = useState(null);
  const [showApptModal, setShowApptModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // -----------------------------
  // Helpers
  // -----------------------------

  const formatDate = (value) => {
    if (!value) return "Not Set";
    const date = new Date(value + "T00:00:00");
    if (isNaN(date)) return "Not Set";
    return `${date.getMonth() + 1}-${String(date.getDate()).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const formatTime = (value) => {
    if (!value) return "Not Set";
    const [h, m] = value.split(":");
    let hour = parseInt(h, 10);
    let ampm = hour >= 12 ? "PM" : "AM";
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    return `${hour}:${m} ${ampm}`;
  };

  const parseName = (fullName) => {
    if (!fullName) return { first_name: "", last_name: "" };
    const parts = fullName.trim().split(" ");
    return {
      first_name: parts.shift() || "",
      last_name: parts.join(" ")
    };
  };

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleDateConfirm = (field, date, tentative = false) => {
    const updates = { [field]: date };
    if (field === "installDate") updates.installTentative = tentative;
    setForm(prev => ({ ...prev, ...updates }));
    setShowDateModal(null);
  };

  const handleApptConfirm = (date, time) => {
    setForm(prev => ({ ...prev, apptDate: date, apptTime: time }));
    setShowApptModal(false);
  };

  const handleSave = () => {
    const parsed = parseName(form.name);
    const cleanForm = { ...form, ...parsed };
    onSave(cleanForm);
  };

  const handleExit = () => {
    onClose();
  };

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 relative">

        {/* HEADER */}
        <div className="bg-slate-700 rounded-t-2xl p-5 text-white">
          <h2 className="text-2xl font-bold">
            {form.name || "New Lead"}
          </h2>
          {form.companyName && (
            <p className="text-white/80">{form.companyName}</p>
          )}

          <div className="flex gap-2 mt-4">
            <a href={`tel:${form.phone}`} className="action-btn">Call</a>
            <a href={`sms:${form.phone}`} className="action-btn">Text</a>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${form.address}, ${form.city}, ${form.state} ${form.zip}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn"
            >
              Maps
            </a>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">

          <LeadDetails
            form={form}
            isEditing={isEditing}
            formatDate={formatDate}
            formatTime={formatTime}
            setShowApptModal={setShowApptModal}
            setShowDateModal={setShowDateModal}
          />

          {/* FORM FIELDS WHEN EDITING */}
          {isEditing && (
            <div className="space-y-4">
              {/* NAME */}
              <input
                className="input"
                placeholder="Name"
                value={form.name}
                onChange={e => handleChange("name", e.target.value)}
              />

              {/* PHONE */}
              <input
                className="input"
                placeholder="Phone"
                value={form.phone}
                onChange={e => handleChange("phone", e.target.value)}
              />

              {/* EMAIL */}
              <input
                className="input"
                placeholder="Email"
                value={form.email}
                onChange={e => handleChange("email", e.target.value)}
              />

              {/* ADDRESS */}
              <input
                className="input"
                placeholder="Address"
                value={form.address}
                onChange={e => handleChange("address", e.target.value)}
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  className="input"
                  placeholder="City"
                  value={form.city}
                  onChange={e => handleChange("city", e.target.value)}
                />
                <input
                  className="input"
                  placeholder="State"
                  value={form.state}
                  onChange={e => handleChange("state", e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Zip"
                  value={form.zip}
                  onChange={e => handleChange("zip", e.target.value)}
                />
              </div>

              {/* PROJECT */}
              <input
                className="input"
                placeholder="Project Type"
                value={form.projectType}
                onChange={e => handleChange("projectType", e.target.value)}
              />

              {/* COMPANY */}
              <input
                className="input"
                placeholder="Company Name"
                value={form.companyName}
                onChange={e => handleChange("companyName", e.target.value)}
              />

              {/* PRICES */}
              <input
                className="input"
                placeholder="Contract Price"
                value={form.contractPrice}
                onChange={e => handleChange("contractPrice", e.target.value)}
              />

              {/* NOTES */}
              <textarea
                className="input h-28"
                placeholder="Notes..."
                value={form.notes}
                onChange={e => handleChange("notes", e.target.value)}
              />
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex justify-between items-center pt-4">
            <button onClick={handleExit} className="btn-gray">Exit</button>

            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="btn-blue">Edit</button>
            ) : (
              <button onClick={handleSave} className="btn-green">Save</button>
            )}
          </div>

          {/* DELETE */}
          <div className="text-center pt-4">
            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="text-red-600 hover:underline"
              >
                Delete Contact
              </button>
            ) : (
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => onDelete(form)}
                  className="btn-red"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="btn-gray"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {showApptModal && (
        <ApptDateTimeModal
          apptDate={form.apptDate}
          apptTime={form.apptTime}
          onConfirm={handleApptConfirm}
          onClose={() => setShowApptModal(false)}
        />
      )}

      {showDateModal && (
        <DateModal
          initialDate={form[showDateModal]}
          initialTentative={
            showDateModal === "installDate" ? form.installTentative : false
          }
          allowTentative={showDateModal === "installDate"}
          onConfirm={(date, tentative) =>
            handleDateConfirm(showDateModal, date, tentative)
          }
          onClose={() => setShowDateModal(null)}
        />
      )}
    </div>
  );
}

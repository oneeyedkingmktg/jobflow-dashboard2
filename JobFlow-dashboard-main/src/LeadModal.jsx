import React, { useState, useEffect } from "react";
import InputRow from "./InputRow.jsx";
import LeadDetails from "./LeadDetails.jsx";
import DateModal from "./DateModal.jsx";
import ApptDateTimeModal from "./ApptDateTimeModal.jsx";
import { LeadsAPI } from "./api";
import { useAuth } from "./AuthContext";
import { useCompany } from "./CompanyContext";

export default function LeadModal({
  lead,
  onClose,
  onSave,
  onDelete,
}) {
  const { user } = useAuth();
  const { currentCompany } = useCompany();

  // ------------------------------------------------------------------
  // State: FULL DB FIELDS
  // ------------------------------------------------------------------
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    buyer_type: "",
    company_name: "",
    project_type: "",
    lead_source: "",
    status: "Lead",
    not_sold_reason: "",
    contract_price: "",
    appointment_date: "",
    appointment_time: "",
    preferred_contact: "",
    notes: "",
    installDate: "",            // NEW
    installTentative: false,    // NEW
    ...lead,
  });

  const [isEditing, setIsEditing] = useState(lead?.isNew || false);
  const [showDateModal, setShowDateModal] = useState(null);
  const [showApptModal, setShowApptModal] = useState(false);
  const [showNotSoldModal, setShowNotSoldModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // ------------------------------------------------------------------
  // Status dropdown configuration
  // ------------------------------------------------------------------
  const statuses = ["Lead", "Appointment Set", "Sold", "Not Sold", "Completed"];
  const statusColors = {
    Lead: "bg-slate-500",
    "Appointment Set": "bg-blue-600",
    Sold: "bg-emerald-600",
    "Not Sold": "bg-red-600",
    Completed: "bg-amber-500",
  };

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------
  const formatDate = (value) => {
    if (!value) return "Not Set";
    const d = new Date(value + "T00:00:00");
    if (isNaN(d)) return "Not Set";
    return `${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const formatTime = (t) => {
    if (!t) return "Not Set";
    const [h, m] = t.split(":");
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    return `${hour}:${m} ${ampm}`;
  };

  const handleChange = (key, val) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  // ------------------------------------------------------------------
  // Date handlers
  // ------------------------------------------------------------------
  const handleDateConfirm = (field, date, tentative = false) => {
    if (field === "installDate") {
      setForm((p) => ({ ...p, installDate: date, installTentative: tentative }));
    } else {
      setForm((p) => ({ ...p, appointment_date: date }));
    }
    setShowDateModal(null);
  };

  const handleDateRemove = (field) => {
    if (field === "installDate") {
      setForm((p) => ({ ...p, installDate: "", installTentative: false }));
    } else {
      setForm((p) => ({ ...p, appointment_date: "" }));
    }
    setShowDateModal(null);
  };

  const handleApptConfirm = (date, time) => {
    setForm((p) => ({ ...p, appointment_date: date, appointment_time: time }));
    setShowApptModal(false);
  };

  const handleApptRemove = () => {
    setForm((p) => ({ ...p, appointment_date: "", appointment_time: "" }));
    setShowApptModal(false);
  };

  // ------------------------------------------------------------------
  // Save to DB
  // ------------------------------------------------------------------
  const handleSave = async () => {
    const payload = {
      ...form,
      install_date: form.installDate || null,
      install_tentative: form.installTentative,
    };

    await LeadsAPI.update(form.id, payload);
    onSave(payload);
    setIsEditing(false);
  };

  // ------------------------------------------------------------------
  // UI
  // ------------------------------------------------------------------
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 relative">
        {/* Header */}
        <div className={`${statusColors[form.status]} rounded-t-2xl p-5 text-white`}>
          <h2 className="text-2xl font-bold">{form.name || "New Lead"}</h2>

          <div className="flex gap-3 mt-4">
            <a href={`tel:${form.phone}`} className="bg-white text-gray-900 px-6 py-2.5 rounded-lg font-semibold flex-1 text-center">
              Call
            </a>
            <a href={`sms:${form.phone}`} className="bg-white text-gray-900 px-6 py-2.5 rounded-lg font-semibold flex-1 text-center">
              Text
            </a>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${form.address}, ${form.city}, ${form.state} ${form.zip}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-gray-900 px-6 py-2.5 rounded-lg font-semibold flex-1 text-center"
            >
              Maps
            </a>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* Lead Details Section */}
          <LeadDetails
            form={form}
            isEditing={isEditing}
            formatDate={formatDate}
            formatTime={formatTime}
            setShowApptModal={setShowApptModal}
            setShowDateModal={setShowDateModal}
          />

          {/* Editable Fields */}
          <div className="space-y-4">
            <InputRow label="Name" value={form.name} onChange={(v) => handleChange("name", v)} />
            <InputRow label="Address" value={form.address} onChange={(v) => handleChange("address", v)} />
            <InputRow label="City" value={form.city} onChange={(v) => handleChange("city", v)} />
            <InputRow label="State" value={form.state} onChange={(v) => handleChange("state", v)} />
            <InputRow label="Zip" value={form.zip} onChange={(v) => handleChange("zip", v)} />
            <InputRow label="Phone" value={form.phone} onChange={(v) => handleChange("phone", v)} />
            <InputRow label="Email" value={form.email} onChange={(v) => handleChange("email", v)} />
            <InputRow label="Buyer Type" value={form.buyer_type} onChange={(v) => handleChange("buyer_type", v)} />
            <InputRow label="Project Type" value={form.project_type} onChange={(v) => handleChange("project_type", v)} />
            <InputRow label="Contract Price" value={form.contract_price} onChange={(v) => handleChange("contract_price", v)} />
            <InputRow label="Preferred Contact" value={form.preferred_contact} onChange={(v) => handleChange("preferred_contact", v)} />
            <InputRow
              label="Notes"
              textarea
              value={form.notes}
              onChange={(v) => handleChange("notes", v)}
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t flex gap-3 justify-between">
            <button onClick={() => onClose()} className="bg-gray-700 text-white px-8 py-3 rounded-xl font-bold">
              Exit
            </button>
            <button onClick={handleSave} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold">
              Save
            </button>
          </div>

          {/* Delete */}
          <div className="text-center pt-3 border-t">
            {!deleteConfirm ? (
              <button onClick={() => setDeleteConfirm(true)} className="text-red-600 font-medium">
                Delete Contact
              </button>
            ) : (
              <div className="flex justify-center gap-4">
                <button onClick={() => onDelete(form)} className="text-red-700 font-bold">
                  Yes, Delete
                </button>
                <button onClick={() => setDeleteConfirm(false)} className="text-gray-600">
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDateModal && (
        <DateModal
          initialDate={showDateModal === "installDate" ? form.installDate : form.appointment_date}
          initialTentative={showDateModal === "installDate" ? form.installTentative : false}
          allowTentative={showDateModal === "installDate"}
          label={showDateModal === "installDate" ? "Set Install Date" : "Select Date"}
          onConfirm={(date, tentative) =>
            handleDateConfirm(showDateModal, date, tentative)
          }
          onRemove={() => handleDateRemove(showDateModal)}
          onClose={() => setShowDateModal(null)}
        />
      )}

      {showApptModal && (
        <ApptDateTimeModal
          apptDate={form.appointment_date}
          apptTime={form.appointment_time}
          onConfirm={handleApptConfirm}
          onRemove={handleApptRemove}
          onClose={() => setShowApptModal(false)}
        />
      )}
    </div>
  );
}

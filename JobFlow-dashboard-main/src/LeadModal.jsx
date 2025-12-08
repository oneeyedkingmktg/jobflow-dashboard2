import React, { useState, useEffect } from "react";
import InputRow from "./InputRow.jsx";
import LeadDetails from "./LeadDetails.jsx";
import DateModal from "./DateModal.jsx";
import ApptDateTimeModal from "./ApptDateTimeModal.jsx";

export default function LeadModal({
  lead,
  onClose,
  onSave,
  onDelete,
}) {
  const [form, setForm] = useState({
    id: lead?.id || null,
    name: lead?.name || "",
    phone: lead?.phone || "",
    email: lead?.email || "",
    address: lead?.address || "",
    city: lead?.city || "",
    state: lead?.state || "",
    zip: lead?.zip || "",
    buyerType: lead?.buyerType || "",
    companyName: lead?.companyName || "",
    projectType: lead?.projectType || "",
    leadSource: lead?.leadSource || "",
    referralSource: lead?.referralSource || "",
    status: lead?.status || "lead",
    notSoldReason: lead?.notSoldReason || "",
    contractPrice: lead?.contractPrice || "",
    apptDate: lead?.apptDate || "",
    preferredContact: lead?.preferredContact || "",
    notes: lead?.notes || "",
    installDate: lead?.installDate || "",
    installTentative: lead?.installTentative || false,
  });

  const [isEditing, setIsEditing] = useState(lead?.id ? false : true);
  const [showDateModal, setShowDateModal] = useState(null);
  const [showApptModal, setShowApptModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const parseName = (fullName) => {
    if (!fullName) return { first_name: "", last_name: "" };
    const parts = fullName.trim().split(" ");
    return {
      first_name: parts.shift() || "",
      last_name: parts.join(" ") || "",
    };
  };

  const handleSaveClick = () => {
    const parsedName = parseName(form.name);
    onSave({ ...form, ...parsedName });
    setIsEditing(false);
  };

  const statusColors = {
    lead: "bg-slate-500",
    appointment_set: "bg-blue-600",
    sold: "bg-emerald-600",
    not_sold: "bg-red-600",
    complete: "bg-amber-500",
  };

  const buyerTypes = [
    "Residential",
    "Small Business",
    "Buyer not Owner",
    "Competitive Bid",
  ];

  const notSoldReasons = [
    "Too Expensive",
    "Waiting for Another Bid",
    "Thinking About It",
    "Going with Another Contractor",
  ];

  const handleDateConfirm = (field, date, tentative = false) => {
    const updates = { [field]: date };
    if (field === "installDate") updates.installTentative = tentative;

    setForm((prev) => ({ ...prev, ...updates }));
    setShowDateModal(null);
  };

  const handleDateRemove = (field) => {
    const updates = { [field]: "" };
    if (field === "installDate") updates.installTentative = false;

    setForm((prev) => ({ ...prev, ...updates }));
    setShowDateModal(null);
  };

  const handleApptConfirm = (date, time) => {
    setForm((prev) => ({
      ...prev,
      apptDate: date,
      apptTime: time,
    }));
    setShowApptModal(false);
  };

  const handleApptRemove = () => {
    setForm((prev) => ({ ...prev, apptDate: "", apptTime: "" }));
    setShowApptModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 relative animate-slide-up">
        {/* HEADER */}
        <div className={`${statusColors[form.status]} rounded-t-2xl p-5 text-white`}>
          <h2 className="text-2xl font-bold">
            {form.name || "New Lead"}
          </h2>

          <div className="flex gap-2 mt-4">
            <a
              href={`tel:${form.phone}`}
              className="bg-white px-6 py-2 rounded-lg text-gray-900 font-semibold shadow-sm"
            >
              Call
            </a>
            <a
              href={`sms:${form.phone}`}
              className="bg-white px-6 py-2 rounded-lg text-gray-900 font-semibold shadow-sm"
            >
              Text
            </a>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${form.address}, ${form.city}, ${form.state} ${form.zip}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white px-6 py-2 rounded-lg text-gray-900 font-semibold shadow-sm"
            >
              Maps
            </a>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* STATUS ROW */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="px-4 py-2 rounded-full font-bold text-white bg-gray-700"
            >
              <option value="lead">Lead</option>
              <option value="appointment_set">Appointment Set</option>
              <option value="sold">Sold</option>
              <option value="not_sold">Not Sold</option>
              <option value="complete">Complete</option>
            </select>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={handleSaveClick}
                className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold"
              >
                Save
              </button>
            )}
          </div>

          {/* LEAD DETAILS (Maps, Phone, Appt, Install) */}
          <LeadDetails
            form={form}
            isEditing={isEditing}
            formatDate={(d) => (d ? new Date(d).toLocaleDateString() : "Not Set")}
            formatTime={(t) => t || ""}
            setShowApptModal={setShowApptModal}
            setShowDateModal={setShowDateModal}
          />

          {/* FORM FIELDS */}
          <div className="space-y-4">
            <InputRow label="Name" value={form.name} onChange={(v) => handleChange("name", v)} required />
            <InputRow label="Phone" value={form.phone} onChange={(v) => handleChange("phone", v)} required />
            <InputRow label="Email" value={form.email} onChange={(v) => handleChange("email", v)} />

            <InputRow label="Address" value={form.address} onChange={(v) => handleChange("address", v)} />
            <InputRow label="City" value={form.city} onChange={(v) => handleChange("city", v)} />
            <InputRow label="State" value={form.state} onChange={(v) => handleChange("state", v)} />
            <InputRow label="Zip" value={form.zip} onChange={(v) => handleChange("zip", v)} />

            <InputRow
              label="Buyer Type"
              type="select"
              options={["Residential", "Small Business", "Buyer not Owner", "Competitive Bid"]}
              value={form.buyerType}
              onChange={(v) => handleChange("buyerType", v)}
              required
            />

            <InputRow label="Company Name" value={form.companyName} onChange={(v) => handleChange("companyName", v)} />
            <InputRow label="Project Type" value={form.projectType} onChange={(v) => handleChange("projectType", v)} />

            <InputRow label="Lead Source" value={form.leadSource} onChange={(v) => handleChange("leadSource", v)} />
            <InputRow label="Referral Source" value={form.referralSource} onChange={(v) => handleChange("referralSource", v)} />

            <InputRow
              label="Contract Price"
              type="number"
              prefix="$"
              value={form.contractPrice}
              onChange={(v) => handleChange("contractPrice", v)}
            />

            <InputRow
              label="Preferred Contact"
              type="select"
              options={["Call", "Text", "Email"]}
              value={form.preferredContact}
              onChange={(v) => handleChange("preferredContact", v)}
            />

            <InputRow
              label="Notes"
              multiline
              value={form.notes}
              onChange={(v) => handleChange("notes", v)}
            />
          </div>

          {/* FOOTER */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gray-600 text-white rounded-xl font-bold"
            >
              Exit
            </button>

            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="text-red-600 font-semibold"
              >
                Delete Contact
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => onDelete(form)}
                  className="text-red-600 font-bold"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="text-gray-600 font-semibold"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDateModal && (
        <DateModal
          initialDate={form[showDateModal]}
          initialTentative={showDateModal === "installDate" ? form.installTentative : false}
          allowTentative={showDateModal === "installDate"}
          label={showDateModal === "installDate" ? "Set Install Date" : "Select Date"}
          onConfirm={(date, tentative) => handleDateConfirm(showDateModal, date, tentative)}
          onRemove={() => handleDateRemove(showDateModal)}
          onClose={() => setShowDateModal(null)}
        />
      )}

      {showApptModal && (
        <ApptDateTimeModal
          apptDate={form.apptDate}
          apptTime={form.apptTime}
          onConfirm={handleApptConfirm}
          onRemove={handleApptRemove}
          onClose={() => setShowApptModal(false)}
        />
      )}
    </div>
  );
}

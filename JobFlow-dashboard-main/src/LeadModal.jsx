import React, { useState, useEffect } from "react";
import DateModal from "./DateModal.jsx";
import ApptDateTimeModal from "./ApptDateTimeModal.jsx";
import { useCompany } from "./CompanyContext";
import { formatPhoneNumber } from "./utils/formatting";

const STATUS_LABELS = {
  lead: "Lead",
  appointment_set: "Appointment Set",
  sold: "Sold",
  not_sold: "Not Sold",
  complete: "Completed",
};

const STATUS_COLORS = {
  lead: "#59687d",
  appointment_set: "#225ce5", // booked Appt
  sold: "#048c63",
  not_sold: "#c72020",
  complete: "#ea8e09",
};

const STATUS_PROGRESS = {
  lead: "appointment_set",
  appointment_set: "sold",
  sold: "complete",
};

export default function LeadModal({
  lead,
  onClose,
  onSave,
  onDelete,
  presetPhone,
}) {
  const { currentCompany } = useCompany();

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

  const [isEditing, setIsEditing] = useState(!lead?.id);
  const [showDateModal, setShowDateModal] = useState(null);
  const [showApptModal, setShowApptModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!lead?.id && presetPhone) {
      setForm((prev) => ({
        ...prev,
        phone: formatPhoneNumber(presetPhone),
      }));
    }
  }, [presetPhone, lead]);

  const formatDate = (value) => {
    if (!value) return "Not Set";
    const d = new Date(value);
    if (isNaN(d)) return "Not Set";
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  };

  const formatTime = (value) => {
    if (!value) return "Not Set";
    // value might be "14:00" or "14:00:00"
    const parts = String(value).split(":");
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1] || "00";
    if (isNaN(hours)) return "Not Set";
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return `${hours}:${minutes.padStart(2, "0")} ${ampm}`;
  };

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

  const handleCall = () => {
    if (!form.phone) return;
    const digits = form.phone.replace(/[^\d+]/g, "");
    window.open(`tel:${digits}`);
  };

  const handleText = () => {
    if (!form.phone) return;
    const digits = form.phone.replace(/[^\d+]/g, "");
    window.open(`sms:${digits}`);
  };

  const handleMaps = () => {
    if (!form.address) return;
    const query = `${form.address}, ${form.city || ""}, ${form.state || ""} ${
      form.zip || ""
    }`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      query
    )}`;
    window.open(url, "_blank");
  };

  const currentStatus = form.status || "lead";
  const headerColor = STATUS_COLORS[currentStatus] || STATUS_COLORS.lead;

  const nextStatus = STATUS_PROGRESS[currentStatus] || null;
  const nextStatusLabel = nextStatus ? STATUS_LABELS[nextStatus] : null;
  const nextStatusColor = nextStatus ? STATUS_COLORS[nextStatus] : "#cccccc";

  const buyerTypes = [
    "Residential",
    "Small Business",
    "Buyer not Owner",
    "Competitive Bid",
  ];

  const projectTypes = [
    "Garage Floor",
    "Basement",
    "Patio",
    "Sidewalk",
    "Pool Deck",
    "Commercial",
  ];

  const preferredContacts = ["Phone", "SMS", "Email"];

  const handleProgressStatus = () => {
    if (!nextStatus) return;
    setForm((prev) => ({ ...prev, status: nextStatus }));
  };

  const statusOptions = [
    "lead",
    "appointment_set",
    "sold",
    "not_sold",
    "complete",
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-auto">
      <div className="bg-[#f4f5f7] rounded-3xl shadow-2xl w-full max-w-3xl my-6 overflow-hidden">
        {/* HEADER BAR */}
        <div
          className="px-6 pt-4 pb-5"
          style={{ backgroundColor: headerColor }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white truncate">
              {form.name || "New Lead"}
            </h2>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCall}
              className="flex-1 bg-white text-gray-800 rounded-lg py-2 font-semibold shadow-sm hover:shadow-md"
            >
              Call
            </button>
            <button
              onClick={handleText}
              className="flex-1 bg-white text-gray-800 rounded-lg py-2 font-semibold shadow-sm hover:shadow-md"
            >
              Text
            </button>
            <button
              onClick={handleMaps}
              className="flex-1 bg-white text-gray-800 rounded-lg py-2 font-semibold shadow-sm hover:shadow-md"
            >
              Maps
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="px-6 py-6 space-y-5">
          {/* STATUS ROW */}
          <div className="flex items-center justify-between">
            {/* Status dropdown */}
            <div className="relative">
              <select
                value={currentStatus}
                onChange={(e) => handleChange("status", e.target.value)}
                className="appearance-none bg-[#59687d] text-white text-sm font-semibold px-4 py-2 rounded-full pr-8 shadow-sm cursor-pointer"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white text-xs">
                ▼
              </span>
            </div>

            {/* Progress button */}
            <button
              disabled={!nextStatus}
              onClick={handleProgressStatus}
              className={`px-6 py-2 rounded-full text-sm font-bold shadow-md ${
                nextStatus
                  ? "text-white"
                  : "text-gray-500 bg-gray-300 cursor-not-allowed"
              }`}
              style={nextStatus ? { backgroundColor: nextStatusColor } : {}}
            >
              {nextStatusLabel ? nextStatusLabel.toUpperCase() : "NO NEXT STEP"}
            </button>
          </div>

          {/* ADDRESS CARD */}
          <div
            className="bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm cursor-pointer hover:border-blue-400 transition"
            onClick={handleMaps}
          >
            <div className="text-xs text-gray-500 mb-1">
              📍 Tap to open in Maps
            </div>
            <div className="text-blue-700 font-semibold">
              {form.address || "No address entered"}
            </div>
            {(form.city || form.state || form.zip) && (
              <div className="text-gray-700 text-sm">
                {[form.city, form.state, form.zip].filter(Boolean).join(", ")}
              </div>
            )}
          </div>

          {/* PHONE + LEAD SOURCE */}
          <div className="space-y-2">
            {form.phone && (
              <div className="text-gray-900 font-semibold text-sm">
                {form.phone}
              </div>
            )}

            {form.leadSource && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">
                <span className="mr-1">🧷</span>
                <span>Lead Source: {form.leadSource}</span>
              </div>
            )}
          </div>

          {/* APPOINTMENT + INSTALL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Appointment */}
            <div
              onClick={() => setShowApptModal(true)}
              className="bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm cursor-pointer hover:border-blue-400 transition"
            >
              <div className="text-xs text-gray-500 mb-1">Appointment</div>
              <div className="text-blue-700 font-semibold text-sm">
                {form.apptDate ? formatDate(form.apptDate) : "Not Set"}
              </div>
              <div className="text-gray-700 text-xs mt-1">
                {form.apptTime ? formatTime(form.apptTime) : ""}
              </div>
            </div>

            {/* Install */}
            <div
              onClick={() => setShowDateModal("installDate")}
              className="bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm cursor-pointer hover:border-blue-400 transition"
            >
              <div className="text-xs text-gray-500 mb-1">Install Date</div>
              <div className="text-blue-700 font-semibold text-sm">
                {form.installDate ? formatDate(form.installDate) : "Not Set"}
              </div>
            </div>
          </div>

          {/* EDIT / VIEW AREA */}
          {isEditing ? (
            <div className="bg-white rounded-2xl border border-gray-200 px-5 py-5 shadow-sm space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Address
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              </div>

              {/* City / State / Zip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    City
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    State
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Zip
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.zip}
                    onChange={(e) => handleChange("zip", e.target.value)}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Email
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>

              {/* Buyer Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Buyer Type
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.buyerType}
                  onChange={(e) => handleChange("buyerType", e.target.value)}
                >
                  <option value="">Select Buyer Type</option>
                  {buyerTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Company Name */}
              {form.buyerType && form.buyerType !== "Residential" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Company Name
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.companyName}
                    onChange={(e) =>
                      handleChange("companyName", e.target.value)
                    }
                  />
                </div>
              )}

              {/* Project Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Project Type
                </label>
                <input
                  list="project-types"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.projectType}
                  onChange={(e) => handleChange("projectType", e.target.value)}
                />
                <datalist id="project-types">
                  {projectTypes.map((p) => (
                    <option key={p} value={p} />
                  ))}
                </datalist>
              </div>

              {/* Contract Price */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Contract Price
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.contractPrice}
                  onChange={(e) => handleChange("contractPrice", e.target.value)}
                />
              </div>

              {/* Preferred Contact */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Preferred Contact
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.preferredContact}
                  onChange={(e) =>
                    handleChange("preferredContact", e.target.value)
                  }
                >
                  <option value="">Select Preferred Contact</option>
                  {preferredContacts.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Notes
                </label>
                <textarea
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={form.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                />
              </div>
            </div>
          ) : (
            // VIEW MODE DETAILS BLOCK
            <div className="bg-white rounded-2xl border border-gray-200 px-5 py-5 shadow-sm text-sm text-gray-800">
              <div className="space-y-1 border-b border-gray-200 pb-3 mb-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium">
                    {form.email || "Not Set"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Buyer Type</span>
                  <span className="font-medium">
                    {form.buyerType || "Not Set"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Project Type</span>
                  <span className="font-medium">
                    {form.projectType || "Not Set"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Contract Price</span>
                  <span className="font-medium">
                    {form.contractPrice ? `$${form.contractPrice}` : "Not Set"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Preferred Contact</span>
                  <span className="font-medium">
                    {form.preferredContact || "Not Set"}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-gray-500 mb-1">Notes</div>
                <div className="font-medium">
                  {form.notes && form.notes.trim() !== ""
                    ? form.notes
                    : "No notes"}
                </div>
              </div>

              <div className="mt-4 text-center text-xs text-gray-400">
                ✏️ Click Edit below to modify details
              </div>
            </div>
          )}

          {/* FOOTER BUTTONS */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={handleExit}
              className="bg-[#3b4250] text-white px-8 py-2 rounded-xl font-semibold shadow-sm hover:shadow-md"
            >
              Exit
            </button>

            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="bg-[#048c63] text-white px-8 py-2 rounded-xl font-semibold shadow-sm hover:shadow-md"
            >
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>

          {/* DELETE CONTACT */}
          <div className="pt-3 text-center">
            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="text-red-600 text-sm font-semibold"
              >
                Delete Contact
              </button>
            ) : (
              <div className="bg-red-50 border border-red-300 rounded-xl p-3 inline-block">
                <p className="text-red-700 text-sm font-semibold mb-2">
                  Are you sure you want to delete this contact?
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => onDelete(form)}
                    className="bg-red-600 text-white px-4 py-1 rounded-lg text-sm font-semibold"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="bg-gray-200 px-4 py-1 rounded-lg text-sm font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* INSTALL / DATE MODALS */}
      {showDateModal && (
        <DateModal
          initialDate={form[showDateModal]}
          initialTentative={
            showDateModal === "installDate" ? form.installTentative : false
          }
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

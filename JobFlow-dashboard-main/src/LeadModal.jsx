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
  appointment_set: "#225ce5",
  sold: "#048c63",
  not_sold: "#c72020",
  complete: "#ea8e09",
};

const STATUS_PROGRESS = {
  lead: "appointment_set",
  appointment_set: "sold",
  sold: "complete",
  not_sold: "sold",
};

// Split "full name" into first + last
const splitName = (full) => {
  if (!full) return { first: "", last: "" };

  const parts = full.trim().split(" ");
  if (parts.length === 1) {
    return { first: parts[0], last: "" };
  }
  return {
    first: parts[0],
    last: parts.slice(1).join(" "),
  };
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
    id: lead?.id || null,
    name: lead?.name || "",
    firstName: lead?.firstName || "",
    lastName: lead?.lastName || "",
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
    preferredContact: lead?.preferredContact || "",
    notes: lead?.notes || "",
    contractPrice: lead?.contractPrice || "",
    apptDate: lead?.apptDate || "",
    apptTime: lead?.apptTime || "",
    installDate: lead?.installDate || "",
    installTentative: lead?.installTentative || false,
    notSoldReason: lead?.notSoldReason || "",
    status: lead?.status || "lead",
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
    return `${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const formatTime = (value) => {
    if (!value) return "";
    const [h, m] = value.split(":");
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${(m || "00").padStart(2, "0")} ${ampm}`;
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhoneChange = (val) => {
    handleChange("phone", formatPhoneNumber(val));
  };

  // SAVE (stays on screen)
  const handleSave = () => {
    const { first, last } = splitName(form.name);

    onSave({
      ...form,
      firstName: first,
      lastName: last,
    });

    setIsEditing(false);
  };

  // EXIT (save + close)
  const handleExit = () => {
    const { first, last } = splitName(form.name);

    onSave({
      ...form,
      firstName: first,
      lastName: last,
    });

    onClose({ view: "home" });
  };

  // CALL TEXT MAPS
  const call = () => {
    if (!form.phone) return;
    window.open(`tel:${form.phone.replace(/[^\d]/g, "")}`);
  };

  const text = () => {
    if (!form.phone) return;
    window.open(`sms:${form.phone.replace(/[^\d]/g, "")}`);
  };

  const maps = () => {
    const query = `${form.address}, ${form.city}, ${form.state} ${form.zip}`;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        query
      )}`,
      "_blank"
    );
  };

  const currentStatus = form.status;
  const nextStatus = STATUS_PROGRESS[currentStatus] || null;
  const nextStatusLabel = nextStatus ? STATUS_LABELS[nextStatus] : null;
  const nextStatusColor = nextStatus ? STATUS_COLORS[nextStatus] : "#ccc";

  const statusOptions = [
    "lead",
    "appointment_set",
    "sold",
    "not_sold",
    "complete",
  ];

  const buyerTypes = [
    "Residential",
    "Small Business",
    "Buyer not Owner",
    "Competitive Bid",
  ];

  const preferredContacts = ["Phone", "SMS", "Email"];

  const projectTypes = [
    "Garage Floor",
    "Basement",
    "Patio",
    "Sidewalk",
    "Pool Deck",
    "Commercial",
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-auto">
      <div className="bg-[#f5f6f7] rounded-3xl shadow-2xl w-full max-w-3xl my-6 overflow-hidden">

        {/* HEADER */}
        <div
          className="px-6 pt-4 pb-5"
          style={{ backgroundColor: STATUS_COLORS[currentStatus] }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            {form.name || "New Lead"}
          </h2>

          <div className="grid grid-cols-3 gap-3">
            <button onClick={call} className="bg-white rounded-lg py-2 font-semibold">
              Call
            </button>
            <button onClick={text} className="bg-white rounded-lg py-2 font-semibold">
              Text
            </button>
            <button onClick={maps} className="bg-white rounded-lg py-2 font-semibold">
              Maps
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="px-6 py-6 space-y-5">

          {/* STATUS ROW */}
          <div className="flex items-center justify-between">
            <div className="relative">
              <select
                value={currentStatus}
                onChange={(e) => handleChange("status", e.target.value)}
                className="appearance-none bg-[#59687d] text-white text-sm font-semibold px-4 py-2 rounded-full pr-8"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>

              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-sm">
                ▼
              </span>
            </div>

            {/* STATUS PROGRESS BUTTON */}
            <button
              onClick={() => nextStatus && handleChange("status", nextStatus)}
              disabled={!nextStatus}
              className="px-6 py-2 rounded-full text-sm font-bold text-white"
              style={
                nextStatus
                  ? { backgroundColor: nextStatusColor }
                  : { backgroundColor: "#ccc", color: "#444" }
              }
            >
              {nextStatusLabel ? nextStatusLabel.toUpperCase() : "NO NEXT STEP"}
            </button>
          </div>

          {/* ADDRESS BOX */}
          <div
            onClick={maps}
            className="bg-white rounded-xl border px-4 py-3 cursor-pointer hover:border-blue-500"
          >
            <div className="text-xs text-gray-500">📍 Tap to open in Maps</div>
            <div className="text-blue-700 font-semibold">{form.address}</div>
            <div className="text-gray-700 text-sm">
              {[form.city, form.state, form.zip].filter(Boolean).join(", ")}
            </div>
          </div>

          {/* PHONE + LEAD SOURCE */}
          <div className="space-y-2">
            <div className="text-gray-900 font-semibold">{form.phone}</div>

            {form.leadSource && (
              <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                Lead Source: {form.leadSource}
              </div>
            )}
          </div>

          {/* APPOINTMENT + INSTALL */}
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => setShowApptModal(true)}
              className="bg-white rounded-xl border px-4 py-3 cursor-pointer hover:border-blue-500"
            >
              <div className="text-xs text-gray-500">Appointment</div>
              <div className="text-blue-700 font-semibold">
                {formatDate(form.apptDate)}
              </div>
              <div className="text-gray-700 text-xs">
                {formatTime(form.apptTime)}
              </div>
            </div>

            <div
              onClick={() => setShowDateModal("installDate")}
              className="bg-white rounded-xl border px-4 py-3 cursor-pointer hover:border-blue-500"
            >
              <div className="text-xs text-gray-500">Install Date</div>
              <div className="text-blue-700 font-semibold">
                {formatDate(form.installDate)}
              </div>
            </div>
          </div>

          {/* EDIT MODE */}
          {isEditing ? (
            <div className="bg-white rounded-2xl border px-5 py-5 space-y-4">

              <div>
                <label className="text-xs text-gray-600">Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Address</label>
                <input
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-600">City</label>
                  <input
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">State</label>
                  <input
                    value={form.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Zip</label>
                  <input
                    value={form.zip}
                    onChange={(e) => handleChange("zip", e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-600">Phone *</label>
                <input
                  value={form.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Email</label>
                <input
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Buyer Type</label>
                <select
                  value={form.buyerType}
                  onChange={(e) => handleChange("buyerType", e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg"
                >
                  <option value="">Select Type</option>
                  {buyerTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              {form.buyerType !== "Residential" && form.buyerType !== "" && (
                <div>
                  <label className="text-xs text-gray-600">Company Name</label>
                  <input
                    value={form.companyName}
                    onChange={(e) =>
                      handleChange("companyName", e.target.value)
                    }
                    className="w-full border px-3 py-2 rounded-lg"
                  />
                </div>
              )}

              <div>
                <label className="text-xs text-gray-600">Project Type</label>
                <select
                  value={form.projectType}
                  onChange={(e) => handleChange("projectType", e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg"
                >
                  <option value="">Choose Project</option>
                  {projectTypes.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-600">Contract Price</label>
                <input
                  value={form.contractPrice}
                  onChange={(e) =>
                    handleChange("contractPrice", e.target.value)
                  }
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">
                  Preferred Contact
                </label>
                <select
                  value={form.preferredContact}
                  onChange={(e) =>
                    handleChange("preferredContact", e.target.value)
                  }
                  className="w-full border px-3 py-2 rounded-lg"
                >
                  <option value="">Choose Contact</option>
                  {preferredContacts.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-600">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg h-24 resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border px-5 py-5 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-semibold">{form.email || "Not Set"}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Buyer Type</span>
                <span className="font-semibold">{form.buyerType || "Not Set"}</span>
              </div>

              {form.companyName && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Company</span>
                  <span className="font-semibold">{form.companyName}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-500">Project Type</span>
                <span className="font-semibold">{form.projectType || "Not Set"}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Contract Price</span>
                <span className="font-semibold">
                  {form.contractPrice ? `$${form.contractPrice}` : "Not Set"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Preferred Contact</span>
                <span className="font-semibold">
                  {form.preferredContact || "Not Set"}
                </span>
              </div>

              <div>
                <span className="text-gray-500">Notes</span>
                <p className="font-semibold whitespace-pre-line mt-1">
                  {form.notes?.trim() ? form.notes : "No notes added"}
                </p>
              </div>
            </div>
          )}

          {/* FOOTER */}
          <div className="flex justify-between items-center pt-4 border-t">
            <button
              onClick={handleExit}
              className="bg-[#3b4250] text-white px-8 py-2 rounded-xl font-semibold"
            >
              Exit
            </button>

            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="bg-[#048c63] text-white px-8 py-2 rounded-xl font-semibold"
            >
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>

          <div className="text-center pt-3">
            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="text-red-600 text-sm font-semibold"
              >
                Delete Contact
              </button>
            ) : (
              <div className="inline-block bg-red-50 border border-red-300 rounded-xl p-3">
                <p className="text-red-700 text-sm font-semibold mb-2">
                  Are you sure you want to delete this contact?
                </p>
                <div className="flex gap-3 justify-center text-sm font-semibold">
                  <button
                    onClick={() => onDelete(form)}
                    className="bg-red-600 text-white px-4 py-1 rounded"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="bg-gray-200 px-4 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DATE MODALS */}
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

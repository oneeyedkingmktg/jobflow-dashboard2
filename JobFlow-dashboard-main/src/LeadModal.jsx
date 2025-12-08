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
  fromView,
}) {
  const [form, setForm] = useState({
    id: lead?.id || null,

    // Names
    name: lead?.name || "",
    firstName: lead?.firstName || "",
    lastName: lead?.lastName || "",

    // Contact
    phone: lead?.phone || "",
    email: lead?.email || "",
    preferredContact: lead?.preferredContact || "",

    // Address
    address: lead?.address || "",
    city: lead?.city || "",
    state: lead?.state || "",
    zip: lead?.zip || "",

    // Project / Company
    buyerType: lead?.buyerType || "",
    companyName: lead?.companyName || "",
    projectType: lead?.projectType || "",

    // Sources
    leadSource: lead?.leadSource || "",
    referralSource: lead?.referralSource || "",

    // Status
    status: lead?.status || "lead",
    notSoldReason: lead?.notSoldReason || "",
    notes: lead?.notes || "",

    // Pricing
    contractPrice: lead?.contractPrice || "",

    // Dates
    apptDate: lead?.apptDate || "",
    apptTime: lead?.apptTime || "",
    installDate: lead?.installDate || "",
    installTentative: lead?.installTentative || false,
  });

  const [isEditing, setIsEditing] = useState(lead?.id ? false : true);
  const [showDateModal, setShowDateModal] = useState(null);
  const [showApptModal, setShowApptModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showNotSoldModal, setShowNotSoldModal] = useState(false);

  const buyerTypes = ["Residential", "Small Business", "Buyer not Owner", "Competitive Bid"];
  const notSoldReasons = [
    "Too Expensive",
    "Waiting for Another Bid",
    "Thinking About It",
    "Going with Another Contractor",
  ];

  const statuses = ["lead", "appointment_set", "sold", "not_sold", "complete"];
  const statusColors = {
    lead: "bg-slate-500",
    appointment_set: "bg-blue-600",
    sold: "bg-emerald-600",
    not_sold: "bg-red-600",
    complete: "bg-amber-500",
  };

  /* ------------------------------------------
     FORMATTERS
  -------------------------------------------*/

  const formatPhoneNumber = (value) => {
    if (!value) return "";
    const phoneNumber = value.replace(/[^\d]/g, "");
    if (phoneNumber.length < 4) return phoneNumber;
    if (phoneNumber.length < 7)
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneChange = (value) => {
    const formatted = formatPhoneNumber(value);
    setForm((prev) => ({ ...prev, phone: formatted }));
  };

  const formatDate = (value) => {
    if (!value) return "Not Set";
    const date = new Date(value);
    if (isNaN(date)) return "Not Set";
    return date.toLocaleDateString("en-US");
  };

  const formatTime = (value) => {
    if (!value) return "Not Set";
    const [h, m] = value.split(":");
    let hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    return `${hour}:${m} ${ampm}`;
  };

  const parseName = (fullName) => {
    if (!fullName) return { firstName: "", lastName: "" };
    const parts = fullName.trim().split(" ");
    const firstName = parts.shift() || "";
    const lastName = parts.join(" ");
    return { firstName, lastName };
  };

  /* ------------------------------------------
     DATE MODALS
  -------------------------------------------*/

  const handleDateConfirm = (field, date, tentative = false) => {
    const updates = { [field]: date };
    if (field === "installDate") {
      updates.installTentative = tentative;
    }
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
    setForm((prev) => ({ ...prev, apptDate: date, apptTime: time }));
    setShowApptModal(false);
  };

  const handleApptRemove = () => {
    setForm((prev) => ({ ...prev, apptDate: "", apptTime: "" }));
    setShowApptModal(false);
  };

  /* ------------------------------------------
     SAVE LEAD → DB ONLY
  -------------------------------------------*/

  const handleSave = async () => {
    if (!form.name || !form.phone || !form.buyerType) {
      setShowValidationModal(true);
      return;
    }

    if (form.buyerType !== "Residential" && !form.companyName) {
      setShowValidationModal(true);
      return;
    }

    const nameParts = parseName(form.name);

    const cleanForm = {
      ...form,
      firstName: nameParts.firstName,
      lastName: nameParts.lastName,
    };

    onSave(cleanForm);
    setIsEditing(false);
  };

  const handleExit = () => {
    if (onClose) onClose({ view: "home" });
  };

  const nextProgress = {
    lead: "appointment_set",
    appointment_set: "sold",
    sold: "complete",
  }[form.status];

  /* ------------------------------------------
     MAIN RENDER
  -------------------------------------------*/

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 relative animate-slide-up">
        
        {/* HEADER */}
        <div className={`${statusColors[form.status]} rounded-t-2xl p-5 text-white`}>
          <h2 className="text-2xl font-bold break-words">
            {form.name || "New Lead"}
          </h2>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">
          
          {/* STATUS BAR */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <button
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              className={`${statusColors[form.status]} text-white px-5 py-2 rounded-full font-bold`}
            >
              {form.status.replace("_", " ").toUpperCase()}
            </button>

            {statusDropdownOpen && (
              <div className="absolute mt-12 bg-white border rounded-xl shadow z-50 min-w-[200px]">
                {statuses.map((s) => (
                  <div
                    key={s}
                    onClick={() => {
                      if (s === "not_sold") {
                        setShowNotSoldModal(true);
                        setStatusDropdownOpen(false);
                      } else {
                        setForm((prev) => ({ ...prev, status: s }));
                        setStatusDropdownOpen(false);
                      }
                    }}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {s.replace("_", " ")}
                  </div>
                ))}
              </div>
            )}

            {nextProgress && (
              <button
                onClick={() => setForm((prev) => ({ ...prev, status: nextProgress }))}
                className="bg-blue-600 text-white px-5 py-2 rounded-full font-bold"
              >
                {nextProgress.replace("_", " ")}
              </button>
            )}
          </div>

          {/* LEAD DETAILS DISPLAY */}
          <LeadDetails
            form={form}
            isEditing={isEditing}
            formatDate={formatDate}
            formatTime={formatTime}
            setShowApptModal={setShowApptModal}
            setShowDateModal={setShowDateModal}
          />

          {/* EDITABLE FIELDS */}
          {isEditing && (
            <div className="space-y-3">
              <InputRow label="Name" value={form.name} onChange={(v) => setForm((p) => ({ ...p, name: v }))} />

              <InputRow label="Phone" value={form.phone} onChange={handlePhoneChange} />

              <InputRow label="Email" value={form.email} onChange={(v) => setForm((p) => ({ ...p, email: v }))} />

              <InputRow label="Address" value={form.address} onChange={(v) => setForm((p) => ({ ...p, address: v }))} />

              <InputRow label="City" value={form.city} onChange={(v) => setForm((p) => ({ ...p, city: v }))} />

              <InputRow label="State" value={form.state} onChange={(v) => setForm((p) => ({ ...p, state: v }))} />

              <InputRow label="Zip" value={form.zip} onChange={(v) => setForm((p) => ({ ...p, zip: v }))} />

              <InputRow label="Buyer Type" value={form.buyerType} onChange={(v) => setForm((p) => ({ ...p, buyerType: v }))} />

              <InputRow label="Company Name" value={form.companyName} onChange={(v) => setForm((p) => ({ ...p, companyName: v }))} />

              <InputRow label="Project Type" value={form.projectType} onChange={(v) => setForm((p) => ({ ...p, projectType: v }))} />

              <InputRow label="Lead Source" value={form.leadSource} onChange={(v) => setForm((p) => ({ ...p, leadSource: v }))} />

              <InputRow label="Referral Source" value={form.referralSource} onChange={(v) => setForm((p) => ({ ...p, referralSource: v }))} />

              <InputRow label="Contract Price" value={form.contractPrice} onChange={(v) => setForm((p) => ({ ...p, contractPrice: v }))} />

              <InputRow label="Notes" value={form.notes} onChange={(v) => setForm((p) => ({ ...p, notes: v }))} multiline />
            </div>
          )}

          {/* ACTION ROW */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              onClick={handleExit}
              className="bg-gray-700 text-white px-8 py-3 rounded-xl font-bold"
            >
              Exit
            </button>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={handleS

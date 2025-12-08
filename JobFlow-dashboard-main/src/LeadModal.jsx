import React, { useState, useEffect } from "react";
import InputRow from "./InputRow.jsx";
import LeadDetails from "./LeadDetails.jsx";
import DateModal from "./DateModal.jsx";
import ApptDateTimeModal from "./ApptDateTimeModal.jsx";
import { syncLeadToMailerLite } from "./mailerLiteAPI.js";
import { useAuth } from "./AuthContext";

export default function LeadModal({
  lead,
  onClose,
  onSave,
  onDelete,
  fromView,
  leadSource,
}) {
  const { user } = useAuth();

  const [form, setForm] = useState({
    buyerType: "",
    companyName: "",
    notSoldReason: "",
    leadSource: leadSource || "",
    installTentative: false,
    ...lead,
  });

  const [isEditing, setIsEditing] = useState(lead?.isNew || false);
  const [showDateModal, setShowDateModal] = useState(null);
  const [showApptModal, setShowApptModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showNotSoldModal, setShowNotSoldModal] = useState(false);
  const [previousStatus, setPreviousStatus] = useState(lead?.status || "Lead");

  useEffect(() => {
    if (form.status !== previousStatus) {
      if (form.status === "Appointment Set" && previousStatus !== "Appointment Set") {
        setShowApptModal(true);
      } else if (form.status === "Sold" && previousStatus !== "Sold") {
        setShowDateModal("installDate");
      }
      setPreviousStatus(form.status);
    }
  }, [form.status, previousStatus]);

  const statuses = ["Lead", "Appointment Set", "Sold", "Not Sold", "Completed"];
  const statusColors = {
    Lead: "bg-slate-500",
    "Appointment Set": "bg-blue-600",
    Sold: "bg-emerald-600",
    "Not Sold": "bg-red-600",
    Completed: "bg-amber-500",
  };

  const notSoldReasons = [
    "Too Expensive",
    "Waiting for Another Bid",
    "Thinking About It",
    "Going with Another Contractor",
  ];

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const len = phoneNumber.length;
    if (len < 4) return phoneNumber;
    if (len < 7) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneChange = (value) => {
    const formatted = formatPhoneNumber(value);
    handleChange("phone", formatted);
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const formatDate = (value) => {
    if (!value) return "Not Set";
    const date = new Date(value + "T00:00:00");
    if (isNaN(date)) return "Not Set";
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  };

  const formatTime = (value) => {
    if (!value) return "Not Set";
    const [hourStr, minute] = value.split(":");
    let hour = parseInt(hourStr, 10);
    if (isNaN(hour)) return value;
    const ampm = hour >= 12 ? "PM" : "AM";
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minute} ${ampm}`;
  };

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
    setForm((prev) => ({ ...prev, apptDate: date, apptTime: time }));
    setShowApptModal(false);
  };

  const handleApptRemove = () => {
    setForm((prev) => ({ ...prev, apptDate: "", apptTime: "" }));
    setShowApptModal(false);
  };

  const handleNotSoldReasonSelect = (reason) => {
    setForm((prev) => ({ ...prev, notSoldReason: reason, status: "Not Sold" }));
    setShowNotSoldModal(false);
  };

  const getNextProgression = () => {
    switch (form.status) {
      case "Lead": return "Appointment Set";
      case "Appointment Set": return "Sold";
      case "Sold": return "Completed";
      default: return null;
    }
  };

  const parseName = (fullName) => {
    if (!fullName) return { first_name: "", last_name: "" };
    const parts = fullName.trim().split(" ");
    return { first_name: parts.shift(), last_name: parts.join(" ") };
  };

  const handleSave = async () => {
    if (!form.name || !form.phone || !form.buyerType) {
      setShowValidationModal(true);
      return;
    }

    if (form.buyerType !== "Residential" && !form.companyName) {
      setShowValidationModal(true);
      return;
    }

    const parsed = parseName(form.name);
    const cleanForm = { ...form, ...parsed };

    onSave(cleanForm);
    setIsEditing(false);

    try {
      await syncLeadToMailerLite(cleanForm);
    } catch (_) {}
  };

  const handleExit = async () => {
    if (form.name && form.phone && form.buyerType) {
      try {
        const parsed = parseName(form.name);
        const cleanForm = { ...form, ...parsed };
        onSave(cleanForm);
        await syncLeadToMailerLite(cleanForm);
      } catch (_) {}
    }

    if (onClose) {
      if (fromView && typeof fromView === "object" && fromView.view) onClose(fromView);
      else if (typeof fromView === "string") onClose({ view: fromView });
      else onClose({ view: "home" });
    }
  };

  const nextProgress = getNextProgression();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 relative animate-slide-up">
        
        {/* HEADER */}
        <div className={`${statusColors[form.status]} rounded-t-2xl p-5 text-white`}>
          <div className="flex flex-col gap-3">
            <div>
              <h2 className="text-2xl font-bold break-words">{form.name || "New Lead"}</h2>
              {form.buyerType !== "Residential" && form.companyName && (
                <p className="text-lg font-semibold mt-1 text-white/90">{form.companyName}</p>
              )}
            </div>

            <div className="flex gap-2">
              <a href={`tel:${form.phone || ""}`} className="bg-white hover:bg-gray-100 text-gray-900 text-base px-6 py-2.5 rounded-lg font-semibold shadow-sm flex-1 text-center">
                Call
              </a>
              <a href={`sms:${form.phone || ""}`} className="bg-white hover:bg-gray-100 text-gray-900 text-base px-6 py-2.5 rounded-lg font-semibold shadow-sm flex-1 text-center">
                Text
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${form.address}, ${form.city}, ${form.state} ${form.zip}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-gray-100 text-gray-900 text-base px-6 py-2.5 rounded-lg font-semibold shadow-sm flex-1 text-center"
              >
                Maps
              </a>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">

          {/* STATUS BAR */}
          <div className="flex justify-between items-center gap-3 pb-4 border-b border-gray-200">
            <div className="relative">
              <button
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                className={`${statusColors[form.status]} text-white px-5 py-2 rounded-full font-bold text-sm uppercase shadow-md flex items-center gap-2`}
              >
                {form.status} <span className="text-xs">▼</span>
              </button>

              {statusDropdownOpen && (
                <div className="absolute mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden min-w-[200px]">
                  {statuses.map((s) => (
                    <div
                      key={s}
                      onClick={() => {
                        if (s === "Not Sold") {
                          setShowNotSoldModal(true);
                        } else {
                          setForm((prev) => ({ ...prev, status: s }));
                          if (s === "Appointment Set" && (!form.apptDate || !form.apptTime)) {
                            setTimeout(() => setShowApptModal(true), 300);
                          }
                        }
                        setStatusDropdownOpen(false);
                      }}
                      className="px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer border-b last:border-b-0 text-gray-700"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {form.status === "Appointment Set" ? (
                <>
                  <button
                    onClick={() => setForm((prev) => ({ ...prev, status: "Sold" }))}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-5 py-2 rounded-full font-bold"
                  >
                    Sold
                  </button>

                  <button
                    onClick={() => setShowNotSoldModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-5 py-2 rounded-full font-bold"
                  >
                    Not Sold
                  </button>
                </>
              ) : nextProgress ? (
                <button
                  onClick={() => setForm((prev) => ({ ...prev, status: nextProgress }))}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-full font-bold"
                >
                  {nextProgress}
                </button>
              ) : null}
            </div>
          </div>

          {/* CONTACT DETAILS + FIELDS */}
          <LeadDetails
            form={form}
            isEditing={isEditing}
            formatDate={formatDate}
            formatTime={formatTime}
            setShowApptModal={setShowApptModal}
            setShowDateModal={setShowDateModal}
          />

          {isEditing ? (
            <div className="space-y-4 pt-4">
              <InputRow label="Name" value={form.name || ""} onChange={(v) => handleChange("name", v)} isEditing={isEditing} />
              <InputRow label="Email" value={form.email || ""} onChange={(v) => handleChange("email", v)} isEditing={isEditing} />
              <InputRow label="Phone" value={form.phone || ""} onChange={handlePhoneChange} isEditing={isEditing} />
              <InputRow label="Address" value={form.address || ""} onChange={(v) => handleChange("address", v)} isEditing={isEditing} />
              <InputRow label="City" value={form.city || ""} onChange={(v) => handleChange("city", v)} isEditing={isEditing} />
              <InputRow label="State" value={form.state || ""} onChange={(v) => handleChange("state", v)} isEditing={isEditing} />
              <InputRow label="ZIP" value={form.zip || ""} onChange={(v) => handleChange("zip", v)} isEditing={isEditing} />
              <InputRow label="Notes" type="textarea" value={form.notes || ""} onChange={(v) => handleChange("notes", v)} isEditing={isEditing} />
            </div>
          ) : (
            <div
              onClick={(e) => {
                if (e.target.tagName !== "A") setIsEditing(true);
              }}
              className="text-sm space-y-3 bg-gray-50 rounded-xl p-4 border border-gray-200 cursor-pointer hover:shadow-md"
            ></div>
          )}

          {/* ACTIONS */}
          <div className="space-y-3">
            <div className="flex justify-between items-center pt-3 border-t border-gray-200 gap-3">
              <button
                onClick={handleExit}
                className="bg-gray-700 hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-bold text-base"
              >
                Exit
              </button>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-base"
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold text-base"
                >
                  Save
                </button>
              )}
            </div>
          </div>

          {/* DELETE */}
          <div className="text-center pt-4 border-t border-gray-100">
            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="text-red-600 text-sm hover:text-red-700"
              >
                Delete Contact
              </button>
            ) : (
              <div className="flex justify-center items-center gap-4">
                <span className="text-sm text-gray-600">Are you sure?</span>
                <button
                  onClick={() => onDelete(form)}
                  className="text-red-600 text-sm font-bold px-3 py-1 rounded bg-red-50 hover:bg-red-100"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="text-gray-600 text-sm font-medium px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
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

      {showNotSoldModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-2">Reason Not Sold</h3>
            <p className="text-sm text-gray-600 mb-5">Select a reason:</p>
            <div className="space-y-2">
              {notSoldReasons.map((reason) => (
                <button
                  key={reason}
                  onClick={() => handleNotSoldReasonSelect(reason)}
                  className="w-full px-4 py-3.5 text-left font-semibold bg-gray-50 hover:bg-blue-50 rounded-xl border border-gray-200"
                >
                  {reason}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowNotSoldModal(false)}
              className="w-full mt-4 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

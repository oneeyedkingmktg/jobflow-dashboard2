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
  fromView,
}) {
  const { user } = useAuth();
  const { currentCompany } = useCompany();

  // ===============================================================
  // STATE
  // ===============================================================
  const [form, setForm] = useState({
    id: lead?.id || null,
    name: lead?.name || "",
    first_name: lead?.first_name || "",
    last_name: lead?.last_name || "",
    full_name: lead?.full_name || "",
    phone: lead?.phone || "",
    email: lead?.email || "",
    address: lead?.address || "",
    city: lead?.city || "",
    state: lead?.state || "",
    zip: lead?.zip || "",
    buyer_type: lead?.buyer_type || "",
    company_name: lead?.company_name || "",
    project_type: lead?.project_type || "",
    lead_source: lead?.lead_source || "",
    referral_source: lead?.referral_source || "",
    status: lead?.status || "Lead",
    not_sold_reason: lead?.not_sold_reason || "",
    contract_price: lead?.contract_price || "",
    preferred_contact: lead?.preferred_contact || "",
    notes: lead?.notes || "",
    appointment_date: lead?.appointment_date || "",
    install_date: lead?.install_date || "",
    install_tentative: lead?.install_tentative || false,
  });

  const [isEditing, setIsEditing] = useState(lead?.id ? false : true);
  const [showDateModal, setShowDateModal] = useState(null);
  const [showApptModal, setShowApptModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [showNotSoldModal, setShowNotSoldModal] = useState(false);
  const [previousStatus, setPreviousStatus] = useState(lead?.status || "Lead");

  // ===============================================================
  // STATUS HANDLING
  // ===============================================================
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

  const getNextProgression = () => {
    switch (form.status) {
      case "Lead":
        return "Appointment Set";
      case "Appointment Set":
        return "Sold";
      case "Sold":
        return "Completed";
      default:
        return null;
    }
  };

  // Show appointment modal when status changes to Appointment Set
  useEffect(() => {
    if (form.status !== previousStatus) {
      if (form.status === "Appointment Set" && previousStatus !== "Appointment Set") {
        setShowApptModal(true);
      }
      if (form.status === "Sold" && previousStatus !== "Sold") {
        setShowDateModal("install_date");
      }
      setPreviousStatus(form.status);
    }
  }, [form.status, previousStatus]);

  // ===============================================================
  // UTILITIES
  // ===============================================================
  const parseName = (fullName) => {
    if (!fullName) return { first_name: "", last_name: "" };
    const parts = fullName.trim().split(" ");
    const first_name = parts.shift() || "";
    const last_name = parts.join(" ");
    return { first_name, last_name };
  };

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const digits = value.replace(/[^\d]/g, "");
    if (digits.length < 4) return digits;
    if (digits.length < 7)
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
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
    const d = new Date(value);
    if (isNaN(d)) return "Not Set";
    return d.toLocaleDateString("en-US");
  };

  const formatTime = (value) => {
    if (!value) return "Not Set";
    const [h, m] = value.split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const newHour = hour % 12 || 12;
    return `${newHour}:${m} ${ampm}`;
  };

  // ===============================================================
  // SAVE (DB ONLY)
  // ===============================================================
  const handleSave = async () => {
    const parsed = parseName(form.name);
    const cleanForm = { ...form, ...parsed };

    try {
      let saved;
      if (form.id) {
        saved = await LeadsAPI.update(form.id, cleanForm);
      } else {
        saved = await LeadsAPI.create(cleanForm);
      }
      onSave(saved);
      setIsEditing(false);
    } catch (err) {
      alert("Error saving lead.");
    }
  };

  // Save on exit if valid
  const handleExit = async () => {
    if (form.name && form.phone) {
      try {
        const parsed = parseName(form.name);
        const cleanForm = { ...form, ...parsed };

        if (form.id) {
          await LeadsAPI.update(form.id, cleanForm);
        } else {
          await LeadsAPI.create(cleanForm);
        }
      } catch (_) {}
    }
    onClose({ view: "home" });
  };

  // ===============================================================
  // DELETE
  // ===============================================================
  const handleDelete = async () => {
    await LeadsAPI.delete(form.id);
    onDelete(form);
  };

  // ===============================================================
  // RENDER
  // ===============================================================
  const nextProgress = getNextProgression();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 relative animate-slide-up">

        {/* HEADER */}
        <div className={`${statusColors[form.status]} rounded-t-2xl p-5 text-white`}>
          <h2 className="text-2xl font-bold">{form.name || "New Lead"}</h2>
          {form.company_name && (
            <p className="text-white/90 text-lg">{form.company_name}</p>
          )}
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">

          {/* STATUS */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <button
              className={`${statusColors[form.status]} text-white px-5 py-2 rounded-full font-bold uppercase tracking-wide`}
              onClick={() => setShowNotSoldModal(false)}
            >
              {form.status}
            </button>

            {nextProgress && (
              <button
                onClick={() => handleChange("status", nextProgress)}
                className="bg-blue-600 text-white px-5 py-2 rounded-full font-bold uppercase tracking-wide"
              >
                {nextProgress}
              </button>
            )}
          </div>

          {/* DETAILS */}
          <LeadDetails
            form={form}
            isEditing={isEditing}
            formatDate={formatDate}
            formatTime={formatTime}
            setShowApptModal={setShowApptModal}
            setShowDateModal={setShowDateModal}
          />

          {/* SAVE / EDIT */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <button onClick={handleExit} className="btn-gray">
              Exit
            </button>

            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="btn-blue">
                Edit
              </button>
            ) : (
              <button onClick={handleSave} className="btn-green">
                Save
              </button>
            )}
          </div>

          {/* DELETE */}
          <div className="text-center pt-4 border-t border-gray-100">
            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="text-red-600 text-sm hover:underline"
              >
                Delete Contact
              </button>
            ) : (
              <div className="flex justify-center gap-4">
                <button onClick={handleDelete} className="text-red-600 font-bold">
                  Yes, Delete
                </button>
                <button onClick={() => setDeleteConfirm(false)}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DATE MODALS */}
      {showDateModal && (
        <DateModal
          initialDate={form[showDateModal]}
          initialTentative={showDateModal === "install_date" ? form.install_tentative : false}
          allowTentative={showDateModal === "install_date"}
          label={showDateModal === "install_date" ? "Set Install Date" : "Select Date"}
          onConfirm={(date, tentative) =>
            setForm((prev) => ({
              ...prev,
              [showDateModal]: date,
              install_tentative: tentative,
            }))
          }
          onRemove={() =>
            setForm((prev) => ({
              ...prev,
              [showDateModal]: "",
              install_tentative: false,
            }))
          }
          onClose={() => setShowDateModal(null)}
        />
      )}

      {showApptModal && (
        <ApptDateTimeModal
          apptDate={form.appointment_date}
          apptTime={form.appointment_time}
          onConfirm={(date, time) =>
            setForm((prev) => ({ ...prev, appointment_date: date, appointment_time: time }))
          }
          onRemove={() =>
            setForm((prev) => ({ ...prev, appointment_date: "", appointment_time: "" }))
          }
          onClose={() => setShowApptModal(false)}
        />
      )}

      {/* NOT SOLD MODAL */}
      {showNotSoldModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-2">Reason Not Sold</h3>
            <div className="space-y-2">
              {notSoldReasons.map((r) => (
                <button
                  key={r}
                  onClick={() =>
                    setForm((p) => ({ ...p, status: "Not Sold", not_sold_reason: r }))
                  }
                  className="block w-full px-4 py-3 bg-gray-100 rounded-xl text-left"
                >
                  {r}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowNotSoldModal(false)}
              className="mt-4 w-full text-center text-sm text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useContext } from "react";
import InputRow from "./InputRow.jsx";
import LeadDetails from "./LeadDetails.jsx";
import DateModal from "./DateModal.jsx";
import ApptDateTimeModal from "./ApptDateTimeModal.jsx";
import { syncLeadToMailerLite } from "./mailerLiteAPI.js";
import { GHLAPI } from "./api";
import { AuthContext } from "./AuthContext";

export default function LeadModal({
  lead,
  onClose,
  onSave,
  onDelete,
  fromView,
  currentUser,
  leadSource,
}) {
  const { activeCompany } = useContext(AuthContext);

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
  const [syncLoading, setSyncLoading] = useState(false);

  // Auto-open modals when status changes
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

  const buyerTypes = ["Residential", "Small Business", "Buyer not Owner", "Competitive Bid"];
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
    if (field === "installDate") {
      updates.installTentative = tentative;
    }
    setForm((prev) => ({ ...prev, ...updates }));
    setShowDateModal(null);
  };

  const handleDateRemove = (field) => {
    const updates = { [field]: "" };
    if (field === "installDate") {
      updates.installTentative = false;
    }
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

  const parseName = (fullName) => {
    if (!fullName) return { first_name: "", last_name: "" };
    const parts = fullName.trim().split(" ");
    const first_name = parts.shift() || "";
    const last_name = parts.join(" ");
    return { first_name, last_name };
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
      if (fromView && typeof fromView === "object" && fromView.view) {
        onClose(fromView);
      } else if (typeof fromView === "string") {
        onClose({ view: fromView });
      } else {
        onClose({ view: "home" });
      }
    }
  };

  const handleSyncToGHL = async () => {
    if (!activeCompany?.id) {
      alert("No active company ID.");
      return;
    }
    setSyncLoading(true);

    try {
      const parsed = parseName(form.name);
      const cleanForm = { ...form, ...parsed };

      await GHLAPI.syncLead(cleanForm, activeCompany.id);

      alert("Lead synced to GHL successfully.");
    } catch (err) {
      alert("Failed to sync lead to GHL.");
    }

    setSyncLoading(false);
  };

  const nextProgress = getNextProgression();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 relative animate-slide-up">
        <div className={`${statusColors[form.status]} rounded-t-2xl p-5 text-white`}>
          <div className="flex flex-col gap-3">
            <div>
              <h2 className="text-2xl font-bold break-words">
                {form.name || "New Lead"}
              </h2>
              {form.buyerType &&
                form.buyerType !== "Residential" &&
                form.companyName && (
                  <p className="text-lg font-semibold mt-1 text-white/90">
                    {form.companyName}
                  </p>
                )}
            </div>
            <div className="flex gap-2">
              <a
                href={`tel:${form.phone || ""}`}
                className="bg-white hover:bg-gray-100 text-gray-900 text-base px-6 py-2.5 rounded-lg font-semibold transition-all shadow-sm hover:shadow flex-1 text-center"
              >
                Call
              </a>
              <a
                href={`sms:${form.phone || ""}`}
                className="bg-white

